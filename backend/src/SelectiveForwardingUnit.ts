import { Worker } from 'mediasoup/node/lib/types'
import { createWorker } from 'mediasoup'
import Meeting from './Meeting'
import config from './config'

export default class SelectiveForwardingUnit {
	private static instance: SelectiveForwardingUnit

	private workers: Worker[]
	private workerIndex: number = 0

	public meetings: Map<string, Meeting>

	public static async getInstance(): Promise<SelectiveForwardingUnit> {
		if (!this.instance) {
			this.instance = new SelectiveForwardingUnit()
			await this.instance.setupWorkers()
		}

		return this.instance
	}

	private constructor() {
		this.workers = []
		this.meetings = new Map()
	}

	private async setupWorkers() {
		for (let i = 0; i < config.numberOfWorkers; i++) {
			const worker = await createWorker(config.workerSettings)
			this.workers.push(worker)
		}
	}

	private getWorker(): Worker {
		const worker = this.workers[this.workerIndex]
		this.workerIndex = (this.workerIndex + 1) % config.numberOfWorkers

		return worker
	}

	public async createRoom(): Promise<Meeting> {
		const meeting = await Meeting.build(this.getWorker())

		this.meetings.set(meeting.id, meeting)

		return meeting
	}
}
