<script setup lang="ts">
	import { cn } from '~/lib/utils'
	import { toast } from 'vue-sonner'
	import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
	import { Button } from '~/components/ui/button'
	import type { Meeting } from '~/types'

	const props = defineProps<{
		meeting: Meeting
		isFirst: boolean
	}>()

	const { display: displayDate, displayHours, dayjs } = useDate()
	const { deleteMeeting: deleteMeetingApi, updateMeeting: updateMeetingApi } = useApi()
	const { state: customerState } = usePodStore()

	const customerStore = useCustomerStore()
	const isAdmin = customerStore.isAdmin
	// computed and refs should not be directly destructed, instead use whole store or `storeToRefs`
	// https://pinia.vuejs.org/core-concepts/#Destructuring-from-a-Store
	const { isLeader } = storeToRefs(usePodStore())
	const pod = computed(() => customerState.pod)
	const { getVimeoVideo } = useApi()

	const popoverOpen = ref(false)
	const vimeoIdInput = ref(props.meeting.vimeoId)
	const loadingVimeo = ref(false)

	const deleting = ref<boolean>(false)

	const emit = defineEmits<{
		refresh: []
	}>()

	const media = useMediaStore()

	const isLive = computed(() => {
		if (!props.meeting) return false
		const start = props.meeting.startTime
		const end = props.meeting.endTime
		if (!start || !end) return false
		return dayjs().isBetween(start.isoString, end.isoString)
	})

	const borderClass = computed(() => {
		// Check if the meeting is live
		if (isLive.value && !isAdmin) {
			return 'ring-1 ring-inset ring-green-500/20 bg-green-500/10'
		}
		// Check if the user is an admin but the meeting does not have a vimeoId
		if (isAdmin && !props.meeting.vimeoId) {
			return 'ring-1 ring-inset ring-red-500/20 bg-red-500/10'
		}
		// Default case
		return 'border-transparent'
	})
	const buttonClass = computed(() => (isLive.value ? 'bg-sky-500 hover:bg-sky-600' : 'bg-zinc-700'))

	const justifyButtonsClass = computed(() => {
		// Only apply conditional logic if isAdmin is false
		if (!isAdmin) {
			return showJoinButton.value ? 'justify-between' : 'justify-end'
		}
		return 'justify-start' // Default class if isAdmin is true
	})

	const deleteMeeting = async () => {
		if (!props.meeting) return
		deleting.value = true
		try {
			await deleteMeetingApi(props.meeting.id)
			emit('refresh')
		} catch (error) {
			console.log('error deleting the meeting', error)
		} finally {
			deleting.value = false
		}
	}

	const updateMeeting = async () => {
		try {
			loadingVimeo.value = true
			await updateMeetingApi(props.meeting.id, { vimeoId: vimeoIdInput.value })
			popoverOpen.value = false
			emit('refresh')

			toast('success', {
				description: `Updated meeting with vimeo id: ${vimeoIdInput.value}`,
			})
		} catch (error) {
			console.log(error)
			toast('error', {
				description: 'error has occurred',
			})
		} finally {
			loadingVimeo.value = false
		}
	}

	const showJoinButton = computed(() => {
		if (!props.meeting) return false
		const startTime = dayjs(props.meeting.startTime.isoString)

		const endTime = dayjs(props.meeting.endTime.isoString)
		const now = dayjs()
		const fifteenMinutesBeforeStart = startTime.subtract(15, 'minute')
		return now.isAfter(fifteenMinutesBeforeStart) && now.isBefore(endTime)
	})

	const { renderText } = useMeetingCountdown({
		startTime: computed(() => props.meeting.startTime.isoString),
	})

	// Reactive reference for Vimeo video data
	const vimeo: Ref<any | null> = ref(null) // Indicates whether the Vimeo video data is being loaded
	const vimeoLoading = ref(false)

	// Computed property to determine if there's a vimeoId
	const hasVimeoId = computed(() => !!props.meeting.vimeoId)

	// Watch the hasVimeoId computed property to fetch data when true
	watchEffect(async (onInvalidate) => {
		if (hasVimeoId.value) {
			vimeoLoading.value = true
			try {
				const videoData = await getVimeoVideo(props.meeting.vimeoId)
				vimeo.value = videoData
			} catch (error) {
				console.error('Failed to fetch Vimeo video:', error)
				vimeo.value = null
			} finally {
				vimeoLoading.value = false
			}
		} else {
			vimeo.value = null
		}

		// Cleanup function in case the component is destroyed
		// or the watched source changes before the async operation completes
		onInvalidate(() => {
			vimeo.value = null
			vimeoLoading.value = false
		})
	})
</script>

<template>
	<div :class="cn('rounded-lg border border-transparent bg-zinc-800 p-4', borderClass)">
		<div class="grid gap-2">
			<div class="text-sm font-medium text-white" data-testid="pod-accountability-meeting">
				Pod accountability meeting
			</div>
			<div class="grid gap-2">
				<p class="text-sm text-zinc-300">{{ displayDate(meeting?.startTime.isoString) }}</p>
				<p class="text-sm text-zinc-300">
					<span>{{ displayHours(meeting?.startTime.isoString) }} - {{ displayHours(meeting?.endTime.isoString) }}</span>
				</p>
				<p
					v-if="props.isFirst"
					class="inline-flex max-w-fit items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20"
				>
					{{ renderText }}
				</p>
			</div>
		</div>
		<div class="mt-4 flex w-full items-center" :class="justifyButtonsClass">
			<NuxtLink
				v-if="showJoinButton && !isAdmin"
				:to="`/meeting/${meeting?.id}`"
				class="flex gap-2 rounded-md px-3 py-2 text-sm font-medium leading-tight text-white shadow"
				:class="buttonClass"
				data-testid="join-meeting"
			>
				Join
			</NuxtLink>

			<button
				v-if="isLeader && !isAdmin && pod && pod.id === meeting?.podRef?.id"
				class="rounded-md bg-red-600 px-3 py-2 text-sm font-medium leading-tight text-white shadow"
				@click="deleteMeeting"
			>
				Delete
				<span v-if="deleting">deleting...</span>
			</button>

			<div v-if="isAdmin">
				<div v-if="hasVimeoId" class="mb-2 text-sm">
					id:
					<span v-if="vimeoLoading">...</span>
					<NuxtLink class="underline" v-else-if="vimeo.link" :to="vimeo.link">{{ meeting?.vimeoId }}</NuxtLink>
					<span v-else>invalid id</span>
				</div>
				<div>
					<Popover v-model:open="popoverOpen">
						<PopoverTrigger as-child>
							<Button variant="ghost" size="sm" class="h-8 bg-zinc-900 hover:bg-zinc-800 hover:text-white">
								<span v-if="meeting.vimeoId">Update</span>
								<span v-else>Add video</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent class="w-80 border-transparent bg-zinc-900" align="start">
							<div class="grid gap-2">
								<div class="space-y-2">
									<h4 class="text-sm font-medium text-white">Vimeo id</h4>
									<p class="text-sm text-white">Vimeo id for the pre recorded video.</p>
								</div>
								<div class="space-y-2">
									<Label for="width" class="text-sm font-medium text-white">id</Label>
									<Input
										id="width"
										type="text"
										v-model="vimeoIdInput"
										class="col-span-2 h-8 border-zinc-600 bg-zinc-800 text-white focus-visible:ring-zinc-700"
									/>
								</div>
								<Button
									variant="ghost"
									size="sm"
									class="h-8 max-w-fit bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white"
									@click="updateMeeting()"
									:loading="loadingVimeo"
								>
									Submit
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	</div>
</template>
