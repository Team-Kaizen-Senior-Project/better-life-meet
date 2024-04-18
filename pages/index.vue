<script setup lang="ts">
	const { state: customerState } = useCustomerStore()
	const isAdmin = computed(() => customerState.customer?.admin)
	const media = useMediaStore()
	await media.initDeviceSources() // set the initial state for the audio and video
	navigator.mediaDevices.ondevicechange = (event) => {
		//event listener for when devices are added
		media.initDeviceSources()
	}
	console.log(media.state)
</script>

<template>
	<Head>
		<title>TribeMeet Dashboard</title>
	</Head>
	<!-- Render AdminDashboard if the user is an admin -->
	<DashboardAdmin v-if="isAdmin" />

	<!-- Render CurrentDashboard if the user is not an admin -->
	<DashboardCustomer v-else />
</template>
