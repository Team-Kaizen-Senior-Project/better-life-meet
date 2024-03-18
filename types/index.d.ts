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
	userName: Ref<string>;
	roomCode: Ref<string>;
	videoRefs: Ref<Array<any>>; // Specify a more accurate type if available
	isLocalAudioEnabled: Ref<boolean>;
	isLocalVideoEnabled: Ref<boolean>;
	isConnected: Ref<boolean>;
	peers: Ref<Array<any>>; // Specify a more accurate type if available
	joinRoom: (roomCode: string, username: string) => Promise<void>;
	leaveRoom: () => Promise<void>;
	toggleAudio: () => Promise<void>;
	toggleVideo: () => Promise<void>;
  }