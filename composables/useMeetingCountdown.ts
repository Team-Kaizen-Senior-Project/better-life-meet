interface Params {
	startTime?: MaybeRef<string | undefined>
	onMeetingStart?: () => any
}

export const useMeetingCountdown = (params: Params) => {
	const { display: displayDate, dayjs } = useDate()

	const countdown = ref<string | undefined>(undefined)
	const hasStarted = ref<boolean>(false)

	const interval = ref<NodeJS.Timeout | undefined>(undefined)

	const updateCountdown = () => {
		const unrefedTime = unref(params.startTime)

		if (!unrefedTime) {
			countdown.value = undefined
			console.log('no start time is provided')
			return
		}

		const startTime = dayjs(unrefedTime)
		const now = dayjs()

		if (now.isAfter(startTime)) {
			onTimerFinish()
			return
		}

		const duration = dayjs.duration(startTime.diff(now))
		countdown.value = `Starts in ${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
		hasStarted.value = false
	}

	const runInterval = () => {
		clearInterval(interval.value)
		interval.value = setInterval(() => updateCountdown(), 1000)
		updateCountdown()
	}

	const stopInterval = () => {
		clearInterval(interval.value)
	}

	const onTimerFinish = () => {
		hasStarted.value = true
		params.onMeetingStart?.()
		stopInterval()
	}

	const renderText = computed(() => (!hasStarted.value ? countdown.value : 'Meeting Has Started'))

	onMounted(() => runInterval())
	onBeforeUnmount(() => stopInterval())

	return {
		hasStarted,
		countdown,
		renderText,
	}
}
