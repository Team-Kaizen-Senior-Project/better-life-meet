export default defineNuxtPlugin(async () => {
	const { getMe } = useCustomerStore()
	const { getMyPod } = usePodStore()
	await callOnce(async () => {
		await getMe()
		await getMyPod()
	})
})
