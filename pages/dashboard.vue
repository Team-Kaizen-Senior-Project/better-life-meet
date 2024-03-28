<script setup lang="ts">
	const { state: customerState } = useCustomerStore()

	const isAdmin = computed(() => customerState.customer?.admin)
</script>

<template>
	<div class="container">
		<!-- Render AdminDashboard if the user is an admin -->
		<DashboardAdmin v-if="isAdmin" />

		<!-- Render CurrentDashboard if the user is not an admin -->
		<DashboardCustomer v-else />
	</div>
</template>
