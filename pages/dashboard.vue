<script setup>
	import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
	import { MicrophoneIcon } from '@heroicons/vue/24/solid'
	import MeetingCard from '@/components/MeetingCard.vue'
	const meetings = [
		{
			title: 'Week 16 Accountability Meeting',
			date: 'Wednesday October 4th',
			time: '4:00pm',
			link: '#link1',
			isLive: true,
		},
		{
			title: 'Week 17 Accountability Meeting',
			date: 'Wednesday October 11th',
			time: '4:00pm',
			link: '#link2',
			isLive: false,
		},
		{
			title: 'Week 18 Accountability Meeting',
			date: 'Friday, October 20th',
			time: '2:00pm',
			link: '#link3',
			isLive: false,
		},
		{
			title: 'Week 19 Accountability Meeting',
			date: 'Thursday October 26th',
			time: '3:00 PM',
			link: '#link4',
			isLive: false,
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
					<div class="border border-dashed border-zinc-500 p-4">
						<h2 class="mb-4 text-lg font-medium">Your goals for the quarter</h2>
						<ul class="grid gap-2 pl-4">
							<li v-for="i in 3" :key="i" class="list-disc text-sm">Lorem ipsum dolor sit amet consectetur</li>
						</ul>
					</div>
				</div>

				<!-- column 2 -->
				<div class="col-span-1 grid gap-4 md:col-span-6">
					<VideoSettings />

					<div class="grid grid-cols-2 gap-4 lg:grid-cols-2">
						<div v-for="meeting in meetings" :key="meeting.title" class="">
							<MeetingCard :meeting="meeting" :isLive="meeting.isLive" />
						</div>
					</div>
				</div>
				<!-- column 3 -->
				<div class="col-span-1 lg:col-span-3">
					<div class="mb-4">
						<h2 class="mb-4 text-lg font-medium text-white">Upcoming events</h2>
						<VCalendar v-model="date" :attributes="attrs" isDark="true" />
					</div>

					<ScheduleMeetingCard />
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
