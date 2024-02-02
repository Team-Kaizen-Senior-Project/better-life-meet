<template></template>

<script setup>
	import { fetchPod } from '../../services/podService'

	const route = useRoute()
	const id = route.params.id
	const podName = route.query.name

	// Calls Service layer functions for Pods
	const testServices = async () => {
		// Call GET pod by ID
		const podById = await fetchPod(id)
		console.log('Pod By ID: \n', podById)

		// Call GET all pods
		const pods = await fetchAllPods()
		console.log('All pods: \n', pods.data)
	}

	onMounted(() => {
		testServices()
	})
</script>
