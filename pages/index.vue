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
			<div class="grid grid-cols-1 gap-8 md:grid-cols-12">
				<!-- column 1 -->
				<div class="col-span-3 grid gap-4 self-start">
					<HabitsList />
					<div class="border border-dashed border-zinc-500 p-4">
						<h2 class="mb-4 text-lg font-medium">Your goals for the quarter</h2>
						<ul class="grid gap-2">
							<li v-for="i in 3" :key="i">Lorem ipsum dolor sit amet consectetur</li>
						</ul>
					</div>
				</div>

				<!-- column 2 -->
				<div class="col-span-6 grid gap-4">
					<!-- <div class="border border-dashed border-zinc-500 p-4">
						<h2>Video settings</h2>
						<div>
							<picture class="max-w-md border border-dashed border-zinc-500">
								<img
									src="https://ucarecdn.com/46acb38a-3e2e-40d9-9bbf-14e79b6293eb/CleanShot20231106at1652362x.png"
									alt=""
								/>
							</picture>
							<div class="mt-2 flex flex-row gap-2">
								<Button type="primary">
									<div class="h-4 w-4">
										<Cog6ToothIcon />
									</div>
								</Button>
								<Button type="primary" disabled>
									<div class="h-4 w-4"><VideoCameraSlashIcon /></div>
								</Button>
								<Button type="primary">
									<div class="h-4 w-4"><MicrophoneIcon /></div>
								</Button>
							</div>
						</div>
					</div> -->
					<VideoSettings />

					<div class="grid grid-cols-2 gap-4 md:grid-cols-2">
						<div v-for="meeting in meetings" :key="meeting.title" class="flex justify-center">
							<MeetingCard :meeting="meeting" :isLive="meeting.isLive" />
						</div>
					</div>
				</div>
				<!-- column 3 -->
				<div class="col-span-3">
					<div>
						<h2>Upcoming events</h2>
						<VCalendar v-model="date" :attributes="attrs" />
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
