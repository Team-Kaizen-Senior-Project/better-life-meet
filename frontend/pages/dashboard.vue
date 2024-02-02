<script setup>
	import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
	import { MicrophoneIcon } from '@heroicons/vue/24/solid'
	import MeetingCard from '@/components/MeetingCard.vue'
	const meetings = [
		{
			title: 'Week 16 Accountability Meeting',
			id: 2,
			date: 'Wednesday October 4th',
			time: '4:00pm',
			isLive: true,
		},
	]
	const date = ref(new Date())

	const attrs = ref([
		{
			key: 'today',
			highlight: {
				color: 'green',
				fillMode: 'solid',
			},
			dates: new Date(),
		},
	])
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
					<VideoSettings title="Video settings" boxLength="55" />
				</div>
				<!-- column 3 -->
				<div class="col-span-1 grid gap-4 self-start lg:col-span-3">
					<div class="rounded-lg bg-zinc-900 p-4">
						<h2 class="mb-4 text-lg font-medium text-white">Upcoming events</h2>
						<ClientOnly>
							<div class="my-calendar">
								<VCalendar v-model="date" :attributes="attrs" class="" isDark />
							</div>
						</ClientOnly>
						<div class="mt-4">
							<ScheduleMeetingCard />
						</div>
					</div>

					<div class="rounded-lg bg-zinc-900 p-4">
						<h2 class="mb-4 text-lg font-medium text-white">Meetings for today</h2>
						<div class="grid grid-cols-1 gap-4">
							<div v-for="meeting in meetings" :key="meeting.title" class="">
								<MeetingCard :meeting="meeting" :isLive="meeting.isLive" />
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

	.my-calendar :deep(.vc-dark) {
		--vc-bg: #27272a;
	}
	.my-calendar :deep(.vc-bordered) {
		border-color: transparent;
	}

	h3 {
		margin: 0;
	}
</style>
