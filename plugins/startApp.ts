export default defineNuxtPlugin(async () => {
	const { getMe, state: customerState } = useCustomerStore()
	const { getPod } = usePodStore()
	const { getCustomer } = useApi()
	await callOnce(async () => {
		await getMe()

		// TODO: send pod request if there is a pod id on customer
		// if(customerState.customer?.podRef.id) {
		// await getPod()
		// }

		// FIXME: customerState.podId should be available, we doing this because it's not
		if (customerState.customer) {
			const res = await getCustomer(customerState.customer?.id)
			if (res.data.podRef) await getPod(res.data.podRef.id)
		}
	})
})
