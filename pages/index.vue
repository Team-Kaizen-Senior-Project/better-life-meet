<script setup>
	import { Cog6ToothIcon } from '@heroicons/vue/24/outline'
	import { VideoCameraSlashIcon } from '@heroicons/vue/24/outline'
	import { MicrophoneIcon } from '@heroicons/vue/24/solid'

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
					<div class="border border-dashed border-zinc-500 p-4">
						<h2>Video settings</h2>
						<div>
							<!-- TODO: change to real video source -->
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
					</div>

					<div class="grid grid-cols-2 gap-4 md:grid-cols-2">
						<div v-for="i in 4" :key="i" class="border border-dashed border-zinc-500 p-4">
							<h2>Week 16 accountability meeting</h2>
							<p>Wednesday October 4th</p>
							<p>4:00pm</p>
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
