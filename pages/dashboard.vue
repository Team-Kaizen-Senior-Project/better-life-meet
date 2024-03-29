<script setup lang="ts">
	import MeetingCard from '@/components/MeetingCard.vue'
	import MeetingCalendar from '@/components/MeetingCalendar.vue'

	const { getMeetings } = useApi()

	const { state: podState } = usePodStore()

	const { data, refresh, pending } = await useAsyncData('dashboard', async () => {
		const [meetings] = await Promise.all([
			getMeetings({
				podId: podState.pod?.id,
				count: 100,
			}),
		])

		return {
			meetings,
		}
	})
</script>

<template>
	<section class="page-header bg-zinc-800 py-12 text-white">
		<inner-column>
			<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
				<!-- column 1 -->
				<div class="col-span-1 grid gap-4 self-start lg:col-span-3">
					<HabitsList />
					<div class="rounded-lg bg-zinc-900 p-4">
						<h2 class="mb-4 text-lg font-medium">Your goals for the quarter</h2>
						<ul class="grid gap-2 pl-4">
							<li v-for="i in 3" :key="i" class="list-disc text-sm">Lorem ipsum dolor sit amet consectetur</li>
						</ul>
					</div>
				</div>

				<!-- column 2 -->
				<div class="col-span-1 grid gap-4 md:col-span-6">
					<VideoSettings title="Video settings" :boxLength="55" />
				</div>
				<!-- column 3 -->
				<div class="col-span-1 grid gap-4 self-start lg:col-span-3">
					<div class="rounded-lg bg-zinc-900 p-4">
						<h2 class="mb-4 text-lg font-medium text-white">Upcoming events</h2>
						<MeetingCalendar :meetings="data?.meetings" />
						<div class="mt-4">
							<ScheduleMeetingCard @refresh="refresh" />
						</div>
					</div>

					<div class="rounded-lg bg-zinc-900 p-4">
						<h2 class="mb-4 text-lg font-medium text-white">Meetings this week</h2>
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
