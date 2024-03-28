<script setup lang="ts">
	const { state: customerState } = useCustomerStore()
	const customer = computed(() => customerState.customer)
	const podMeetings = ref<Meeting[]>([])
	const { state: podState } = usePodStore()

	async function getPodMeetings() {
		if (!podState.pod) return
		const podId = podState.pod.id
		const { getMeetings } = useApi()
		const allMeetings = await getMeetings({ podId, count: 100 })
		const formattedMeetings = allMeetings.map((meeting) => {
			const { id, timeZone, startTime, endTime } = meeting
			const { displayHours, displayMonthDay } = useDate()
			const dateStart = displayMonthDay(startTime.isoString)
			const start = displayHours(startTime.isoString)
			const end = displayHours(endTime.isoString)
			return [
				{
					label: `${dateStart}: ${start} - ${end}`,
					icon: 'i-heroicons-calendar-20-solid',
					click: () => {
						console.log('View Meeting', id) // If needed
					},
				},
			]
		})
		podMeetings.value = formattedMeetings
	}
	onMounted(getPodMeetings)
</script>
<template>
	<header class="bg-black py-4">
		<div class="mx-auto flex w-[90vw] max-w-[1600px] items-center justify-between">
			<div class="flex items-center gap-4">
				<p class="text-lg font-medium text-white">Weekly Pod Accountability Meeting</p>
				<div class="schedule-dropdown">
					<!-- Used to override width -->
					<UDropdown :items="podMeetings" :popper="{ placement: 'bottom-start' }">
						<UButton
							class="bg-sky-500 hover:bg-sky-600"
							label="View Schedule"
							trailing-icon="i-heroicons-chevron-down-20-solid"
							data-testid="view-schedule"
						/>
					</UDropdown>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button class="aspect-square h-[2rem] w-[2rem] rounded-full bg-gray-200 text-lg">U</button>
				<div class="flex flex-col text-sm text-white" v-if="customer">
					<p>{{ customer.firstName }}</p>
					<p>{{ customer.email }}</p>
				</div>
			</div>
		</div>
	</header>
</template>

<style>
	.schedule-dropdown .group.w-48 {
		width: 250px;
		overflow-x: hidden;
		overflow-y: auto;
		max-width: 40vh;
	}
</style>
