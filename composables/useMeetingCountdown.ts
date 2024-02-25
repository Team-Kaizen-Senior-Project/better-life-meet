export const useMeetingCountdown = () => {
	const { display: displayDate, dayjs } = useDate()

	const countdown = ref<string | undefined>(undefined)

	const updateCountdown = () => {
		if (!props.meeting) {
			countdown.value = ''
			return
		}
		const startTime = dayjs(props.meeting.startTime.isoString)
		const now = dayjs()
		if (now.isAfter(startTime)) {
			countdown.value = 'Meeting has started'
			return
		}
		const duration = dayjs.duration(startTime.diff(now))
		countdown.value = `Starts in ${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
	}
}
