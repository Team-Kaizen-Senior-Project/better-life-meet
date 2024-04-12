import type {
	HmsRoom,
	HmsSession,
	HmsEventsResponse,
	HmsPeers,
	HmsEventsFilters,
	HmsSessions,
	HmsSessionsFilters,
} from '~/types'

export const getHmsRoom = async (roomId: string): Promise<unknown> => {
	const managementToken = await generateManagementToken()

	const room = await fetch(`https://api.100ms.live/v2/active-rooms/${roomId}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${managementToken}`,
			'Content-Type': 'application/json',
		},
	})

	return room
}

export const getHmsSession = async (sessionId: string): Promise<HmsSession> => {
	const managementToken = await generateManagementToken()

	const session = await $fetch<HmsSession>(`https://api.100ms.live/v2/sessions/${sessionId}`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${managementToken}`,
			'Content-Type': 'application/json',
		},
	})

	return session
}

export const getHmsSessions = async (filters?: HmsSessionsFilters): Promise<HmsSessions> => {
	const managementToken = await generateManagementToken()

	// 100ms only allows values min: 10 and max: 100 so we clamp here
	if (filters?.limit) {
		filters.limit = Math.max(10, Math.min(100, filters.limit))
	}

	const queryParams = { ...filters }

	const response = await $fetch(`https://api.100ms.live/v2/sessions`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${managementToken}`,
			'Content-Type': 'application/json',
		},
		query: queryParams,
	})

	const sessions = response as HmsSessions

	return sessions
}

export const getHmsEvents = async (
	roomId: string,
	eventType: 'add' | 'update' | 'remove',
	filters?: HmsEventsFilters,
): Promise<HmsEventsResponse> => {
	const managementToken = await generateManagementToken()

	const queryParams = {
		room_id: roomId,
		type: `track.${eventType}.success`,
		...filters,
	}

	const events = await $fetch<HmsEventsResponse>(`https://api.100ms.live/v2/analytics/events`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${managementToken}`,
			'Content-Type': 'application/json',
		},
		query: queryParams,
	})

	return events
}

export const getHmsPeers = async (roomId: string, filters?: { user_id?: string; role?: string }): Promise<HmsPeers> => {
	const managementToken = await generateManagementToken()

	const queryParams = { ...filters }

	const peers = await $fetch<HmsPeers>(`https://api.100ms.live/v2/active-rooms/${roomId}/peers`, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${managementToken}`,
			'Content-Type': 'application/json',
		},
		query: queryParams,
	})

	return peers
}
