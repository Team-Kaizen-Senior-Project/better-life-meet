<script setup lang="ts">
	import MeetingCard from '~/components/MeetingCard.vue'
	import type { Meeting } from '~/types'

	// Access the useApi composable
	const { getMeetings } = useApi()

	// Fetch all meetings for admin dashboard
	const {
		data: meetings,
		refresh,
		pending,
	} = await useAsyncData('allMeetings', async () => {
		// Use the getMeetings method with allPods: true to fetch meetings for all pods
		return getMeetings({ allPods: true, count: 100 })
	})
</script>

<template>
	<section class="page-header bg-zinc-800 py-12 text-white">
		<inner-column>
			<h1 className="text-2xl">All pod meetings</h1>
			<div class="rounded-lg bg-zinc-900 p-4">
				<div v-if="pending && !meetings">Loading meetings...</div>
				<div
					v-else-if="meetings && meetings.length"
					class="grid grid-cols-1 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
				>
					<div v-for="meeting in meetings" :key="meeting.id">
						<MeetingCard :meeting="meeting" :isFirst="false" @refresh="refresh" />
					</div>
				</div>
				<div v-else data-testid="no-meetings-found">No meetings found.</div>
			</div>
		</inner-column>
	</section>
</template>
