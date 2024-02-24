// for ref fields like meetingRef, customerRef, etc
export interface GeneralRef {
	id: string
}

export interface Time {
	isoString: string
}

export interface Customer {
	firstName: string
	lastName: string
	email: string
	id: string
	podRef?: GeneralRef
}

export interface Meeting {
	startTime: string
	endTime: string
	timeZone: string
	podRef: GeneralRef
	id: string
}

export interface MeetingFields {
	startTime?: string
	endTime?: string
	timeZone?: string
	podRef?: string
	vimeoId?: string
}

export interface Attendee {
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

export type Numberic = string | number
