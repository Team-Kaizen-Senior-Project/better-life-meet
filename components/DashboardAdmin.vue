<script setup lang="ts">
	import MeetingCard from '~/components/MeetingCard.vue'
	import { toast } from 'vue-sonner'
	import { Button } from '~/components/ui/button'

	// Access the useApi composable
	const { getMeetings, updateMeeting: updateMeetingApi } = useApi()

	const videoIdRef = ref('')
	const loadingRef = ref(false)
	const overrideRef = ref(false)
	const popoverOpenRef = ref(false)

	// Fetch all meetings for admin dashboard
	const {
		data: meetings,
		refresh,
		pending,
	} = await useAsyncData('allMeetings', async () => {
		// Use the getMeetings method with allPods: true to fetch meetings for all pods
		return getMeetings({ allPods: true, count: 100 })
	})

	const updateAllVideos = async () => {
		if (!meetings.value || !meetings.value.length) return

		if (!videoIdRef.value) return

		try {
			loadingRef.value = true

			const requests: Promise<any>[] = []

			meetings.value.forEach(({ id, vimeoId }) => {
				if (!overrideRef.value && vimeoId) return
				requests.push(
					updateMeetingApi(id, {
						vimeoId: videoIdRef.value,
					}),
				)
			})

			await Promise.all(requests)

			refresh()

			popoverOpenRef.value = false
			overrideRef.value = false
			videoIdRef.value = ''

			toast('success', {
				description: `Updated meeting videos`,
			})
		} catch (error) {
			toast('error', {
				description: 'Could not update all video urls!',
			})
		} finally {
			loadingRef.value = false
		}
	}
</script>

<template>
	<section class="page-header bg-zinc-800 py-12 text-white">
		<inner-column>
			<header class="flex justify-between pb-4">
				<h1 className="text-2xl">All pod meetings</h1>
				<Popover v-model:open="popoverOpenRef">
					<PopoverTrigger asChild>
						<Button>Set Video</Button>
					</PopoverTrigger>
					<PopoverContent class="w-80 border-transparent bg-zinc-900">
						<h3 class="pb-2 font-medium">Update or set video of all meetings.</h3>

						<Input
							placeholder="Enter Vimeo Id"
							id="width"
							type="text"
							v-model="videoIdRef"
							class="col-span-2 mt-3 h-8 border-zinc-600 bg-zinc-800 text-white focus-visible:ring-zinc-700"
						/>

						<label class="mt-3 flex items-center gap-2">
							<input v-model="overrideRef" type="checkbox" />
							<span class="text-sm">Override current video urls</span>
						</label>

						<Button
							variant="ghost"
							size="sm"
							class="mt-2 h-8 w-full bg-zinc-800 text-white hover:bg-zinc-700 hover:text-white"
							@click="updateAllVideos"
							:loading="loadingRef"
						>
							Submit
						</Button>
					</PopoverContent>
				</Popover>
			</header>
			<div class="rounded-lg bg-zinc-900 p-4">
				<div v-if="pending && !meetings">Loading meetings...</div>
				<div
					v-else-if="meetings && meetings.length"
					class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
				>
					<div v-for="meeting in meetings" :key="meeting.id">
						<MeetingCard :meeting="meeting" :isFirst="false" @refresh="refresh" />
					</div>
				</div>
				<div v-else>No meetings found.</div>
			</div>
		</inner-column>
	</section>
</template>
