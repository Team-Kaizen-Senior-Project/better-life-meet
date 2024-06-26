// The types that are followed by 'fields' key are used in create and update types instead of the actual type
// AttendeeFields is the create/update type of Attendee
import type { IHMSNotifications } from '@100mslive/hms-video-store'

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
	admin: boolean
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
	vimeoId: string
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

interface VimeoVideo {
	download: { link: string }[]
	width: number
	height: number
	link: string
}

export interface HmsInstance {
	userName: Ref<string>
	roomCode: Ref<string>
	videoRefs: Ref<Array<any>> // Specify a more accurate type if available
	isLocalAudioEnabled: Ref<boolean>
	isLocalVideoEnabled: Ref<boolean>
	isConnected: Ref<boolean>
	peers: Ref<Array<any>> // Specify a more accurate type if available
	peersWithAudioStatus: Ref<Array<any>>
	joinRoom: (roomCode: string, username: string) => Promise<void>
	leaveRoom: () => Promise<void>
	toggleAudio: () => Promise<void>
	toggleVideo: () => Promise<void>
	sendBroadcastMessage: (message: string) => Promise<void>
	messages: Ref<Array<ChatMessage>>
	hmsNotifications: IHMSNotifications
}
interface ChatMessage {
	id: string
	content: string
	sendername: string | any
	time: Date
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

export interface HmsPeer {
	id: string
	session_id: string
	name: string
	role: string
	user_id: string
	joined_at: string
	left_at?: string
}

interface HmsPeers {
	[key: string]: HmsPeer
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

export interface HmsSessions {
	limit: number
	data: HmsSession[]
	last?: string
}

export interface HmsSessionsFilters {
	active?: boolean
	room_id?: string
	after?: string
	before?: string
	limit?: number
	start?: string
}

interface HmsTrackEvent {
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
	type: 'audio' | 'video'
	source: string
	mute: boolean
	started_at: string
	stopped_at?: string // only specified in track.remove.success event
}

export interface HmsEvent {
	version: string
	id: string
	timestamp: string
	type: string
	data: HmsTrackEvent
}

export interface HmsEventsResponse {
	limit: number
	total: number
	next?: string
	events: HmsEvent[]
}

export type HmsEventsFilters = {
	session_id?: string
	peer_id?: string
	user_id?: string
	limit?: number
	start?: string
}

export interface MeetingAnalytics {
	id: string
	pod_id: string
	pod_name: string
	start_time: string
	end_time: string
	time_zone: string
	peers: MeetingSessionPeer[]
}

export interface MeetingSessionPeer {
	name: string
	joined_at: string
	left_at?: string
	duration: number
	mic_duration: number
	video_duration: number
}
