<script setup lang="ts">
	import MeetingCard from '@/components/MeetingCard.vue'
	import MeetingCalendar from '@/components/MeetingCalendar.vue'

	const { getMeetings } = useApi()

	const { state: podState } = usePodStore()

	const { data, refresh, pending } = await useAsyncData(
		'dashboard',
		async () => {
			const [meetings] = await Promise.all([
				getMeetings({
					podId: podState.pod?.id,
					count: 100,
				}),
			])

			return {
				meetings,
			}
		},
		{ server: false },
	)
</script>

<template>
	<section class="page-header mx-auto bg-zinc-800 py-12 text-white max-lg:w-[90%] max-lg:max-w-[700px]">
		<inner-column>
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-10 xl:grid-cols-12 xl:gap-8">
				<!-- column 1 -->
				<div class="col-span-1 grid gap-4 self-start lg:col-span-3">
					<div class="flex justify-between rounded-lg bg-zinc-900 p-4">
						<div class="w-1/2">
							<h2 class="mb-4 text-lg font-medium text-white" data-testid="upcoming-events">Upcoming events</h2>
							<MeetingCalendar :meetings="data?.meetings" />
							<div class="mt-4">
								<ScheduleMeetingCard @refresh="refresh" />
							</div>
						</div>
						<div class="w-1/2 max-h-[60vh] overflow-y-auto hidden md:block lg:hidden">
							<h2 class="mb-4 text-lg font-medium text-white" data-testid="meetings-this-week">Meetings this week</h2>
							<div class="grid grid-cols-1 gap-4">
								<div v-if="data?.meetings?.length" v-for="(meeting, index) in data?.meetings" class="">
									<MeetingCard :meeting="meeting" :isFirst="index === 0" @refresh="refresh" />
								</div>
								<div v-else>
									<p>No meetings scheduled this week</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- column 2 -->
				<div class="col-span-1 grid gap-4 lg:col-span-4 xl:col-span-6">
					<VideoSettings title="Video settings" />
				</div>
				<!-- column 3 -->
				<div class="md:hidden lg:grid col-span-1 gap-4 self-start lg:col-span-3 xl:col-span-3">
					<div class="rounded-lg bg-zinc-900 p-4">
						<h2 class="mb-4 text-lg font-medium text-white" data-testid="meetings-this-week">Meetings this week</h2>
						<div class="grid grid-cols-1 gap-4">
							<div v-if="data?.meetings?.length" v-for="(meeting, index) in data?.meetings" class="">
								<MeetingCard :meeting="meeting" :isFirst="index === 0" @refresh="refresh" />
							</div>
							<div v-else>
								<p>No meetings scheduled this week</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</inner-column>
	</section>
</template>
<style scoped>
	.count {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	h3 {
		margin: 0;
	}
</style>
