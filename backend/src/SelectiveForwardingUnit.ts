import { Worker } from 'mediasoup/node/lib/types'
import { createWorker } from 'mediasoup'
import Room from './Room'
import config from './config'


export default class SelectiveForwardingUnit {
	private static instance: SelectiveForwardingUnit

	private workers: Worker[]
	private workerIndex: number = 0

	public rooms: Room[]

	public static async getInstance(): Promise<SelectiveForwardingUnit> {
		if (!this.instance) {
			this.instance = new SelectiveForwardingUnit()
			await this.instance.setupWorkers()
		}

		return this.instance
	}

	private constructor() {
		this.workers = []
		this.rooms = []
	}

	private async setupWorkers() {
		for (let i = 0; i < config.numberOfWorkers; i++) {
			const worker = await createWorker(config.workerSettings)
			this.workers.push(worker);
		}
	}

	private getWorker(): Worker {
		const worker = this.workers[this.workerIndex]
		this.workerIndex = (this.workerIndex + 1) % config.numberOfWorkers

		return worker
	}

	public async createRoom() {
		const room = await Room.build(this.getWorker())

		this.rooms.push(room)

		return room
	}
}
