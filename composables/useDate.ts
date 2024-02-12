import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import isBetween from 'dayjs/plugin/isBetween'

export const useDate = () => {
	dayjs.extend(utc)
	dayjs.extend(timezone)
	dayjs.extend(isBetween)

	const display = (date?: string) => {
		return dayjs(date).tz().format('YYYY/MM/DD HH:mm')
	}

	return {
		display,
		dayjs,
	}
}
