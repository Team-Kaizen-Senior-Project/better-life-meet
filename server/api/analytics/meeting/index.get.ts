import { AbortError, ServiceError, fql } from 'fauna'
import type { Meeting, MeetingAnalytics } from '~/types'

interface MeetingList {
	data: Meeting[]
	after?: string
}

// Endpoint for retrieving meetings
export default defineEventHandler(async (event) => {
	// Extract params from request query
	const { cursor, count, podId, fromTime, toTime, order }: any = getQuery(event)

	// Initialize Fauna client
	const { client, error } = useFauna()
	if (error !== null) return error

	try {
		let query = fql`Meeting.all().order(.startTime)`

		// Filter by Pod ID
		if (podId) {
			query = fql`
			let pod = Pod.byId(${podId})
			${query}.where(.podRef == pod)`
		}

		// Filter meetings starting 'fromTime'
		if (fromTime) {
			query = fql`${query}.where(Time.fromString(${fromTime}) <= .startTime)`
		}

		// Filter meetings ending 'toTime'
		if (toTime) {
			query = fql`${query}.where(.startTime <= Time.fromString(${toTime}))`
		}

		// Sort by startTime ascending/descending
		if (order) {
			if (order === 'asc') {
				query = fql`${query}.order(asc(.startTime))`
			} else {
				query = fql`${query}.order(desc(.startTime))`
			}
		}

		// Enable pagination if 'count' specified
		if (count) {
			query = fql`${query}.paginate(${Number(count)})`
		}

		// Ignore other parameters and continue from 'after' cursor
		if (cursor) {
			query = fql`Set.paginate(${cursor})`
		}

		const response = await client.query(query)
		const meetingList = response.data as MeetingList

		const analytics: MeetingAnalytics[] = []
		await Promise.all(
			meetingList.data.map(async (meeting) => {
				try {
					const meetingAnalytics = await $fetch(`/api/analytics/meeting/${meeting.id}`)
					analytics.push(meetingAnalytics as MeetingAnalytics)
				} catch (err) {
					// Something went wrong in fetching meeting analytics...
					// Most likely no 100ms session associated with meeting.
					console.error(err)
				}
			}),
		)

		// Sanity sort... Order probably got lost on promises.
		if (order) {
			if (order === 'asc') {
				analytics.sort((a, b) => {
					return Date.parse(a.start_time) - Date.parse(b.start_time)
				})
			} else {
				analytics.sort((a, b) => {
					return Date.parse(b.start_time) - Date.parse(a.start_time)
				})
			}
		}

		return {
			data: analytics,
			after: meetingList.after,
		}
	} catch (error) {
		if (error instanceof AbortError) {
			const abortError = error as AbortError
			const abort = abortError.abort! as { message: string }
			throw createError({
				statusCode: abortError.httpStatus,
				statusMessage: abort.message,
			})
		} else {
			const serviceError = error as ServiceError
			throw createError({
				statusCode: serviceError.httpStatus,
				statusMessage: serviceError.message,
			})
		}
	}
})
