// The types that are followed by 'fields' key are used in create and update types instead of the actual type
// AttendeeFields is the create/update type of Attendee

// for ref fields like meetingRef, customerRef, etc
export interface GeneralRef {
	id: string
}

export type GeneralRefField = Numberic
export type Numberic = string | number

export interface Time {
	isoString: string
}

export interface Customer {
	id: string
	firstName: string
	lastName: string
	email: string
	netWorth: number
	podRef: GeneralRef
}

export interface CustomerFields {
	firstName?: string
	lastName?: string
	email?: string
	netWorth?: number
	podRef?: GeneralRefField
}

export interface Pod {
	id: string
	name: string
	meetingTime: Time
	leader: GeneralRef
}

export interface PodFields {
	name?: string
	meetingTime?: string
	leader?: GeneralRefField
}

export interface Meeting {
	id: string
	startTime: Time
	endTime: Time
	timeZone: string
	podRef: GeneralRef
	roomId: string
	roomCode: string
}

export interface MeetingFields {
	startTime?: string
	endTime?: string
	timeZone?: string
	podRef?: string
	vimeoId?: string
}

export interface Attendee {
	id: string
	joinTime: string
	leaveTime: string
	usedVideo: boolean
	platform: string
	customerRef: GeneralRef
	meetingRef: GeneralRef
}

export interface AttendeeFields {
	joinTime?: string
	leaveTime?: string | null
	customerRef?: string
	meetingRef?: string
	platform?: string
	usedVideo?: boolean
}

export interface HmsInstance {
	userName: Ref<string>
	roomCode: Ref<string>
	videoRefs: Ref<Array<any>> // Specify a more accurate type if available
	isLocalAudioEnabled: Ref<boolean>
	isLocalVideoEnabled: Ref<boolean>
	isConnected: Ref<boolean>
	peers: Ref<Array<any>> // Specify a more accurate type if available
	joinRoom: (roomCode: string, username: string) => Promise<void>
	leaveRoom: () => Promise<void>
	toggleAudio: () => Promise<void>
	toggleVideo: () => Promise<void>
	sendBroadcastMessage: (message: string) => Promise<void>
	messages: Ref<Array<ChatMessage>>
}
interface ChatMessage {
	id: string
	content: string
	sendername: string | any
}

export interface RoomResponse {
	id: string
	name: string
	description: string
	enabled: boolean
}

export interface RoomCodeResponse {
	data: Array<{
		code: string
		roomId: string
		role: string
		enabled: boolean
	}>
}

interface HmsRoomSession {
	id: string
	created_at: string
	peers: string[]
}

export interface HmsRoom {
	id: string
	name: string
	customer_id: string
	session: Session
}

export interface Peer {
	id: string
	session_id: string
	name: string
	role: string
	user_id: string
	joined_at: string
	left_at: string
}

interface HmsPeers {
	[key: string]: Peer
}

export interface HmsSession {
	id: string
	room_id: string
	customer_id: string
	active: boolean
	peers: HmsPeers
	created_at: string
	updated_at: string
}

interface HmsTrackEvents {
	room_id: string
	session_id: string
	room_name: string
	peer_id: string
	user_id: string
	user_name: string
	joined_at: string
	role: string
	track_id: string
	stream_id: string
	type: string
	source: string
	mute: boolean
	started_at: string
	stopped_at?: string // only specified in track.remove.success event
}

export interface HmsEvents {
	version: string
	id: string
	timestamp: string
	type: string
	data: HmsTrackEvents
}

export interface HmsEventsResponse {
	limit: number
	total: number
	next: string
	events: HmsEvents[]
}
