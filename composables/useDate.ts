import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'
import duration from 'dayjs/plugin/duration'

export const useDate = () => {
	dayjs.extend(utc)
	dayjs.extend(timezone)
	dayjs.extend(isBetween)
	dayjs.extend(duration)

	const display = (date?: string) => {
		return dayjs(date).tz().format('MMM DD YYYY hh:mm a')
	}

	return {
		display,
		dayjs,
	}
}
