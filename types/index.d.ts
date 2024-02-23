// for ref fields like meetingRef, customerRef, etc
export interface GeneralRef {
	id: string
}

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

export interface Pod {
	id: string
	name: string
	meetingTime: Time
	leader: GeneralRef
}

export interface Meeting {
	id: string
	startTime: Time
	endTime: Time
	timeZone: string
	podRef: GeneralRef
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

export type Numberic = string | number
