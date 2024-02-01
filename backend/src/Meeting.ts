import { Router, Worker } from 'mediasoup/node/lib/types'
import Peer from './Peer'
import config from './config'

export default class Meeting extends Router {
	public peers!: Map<string, Peer>

	public static async build(worker: Worker): Promise<Meeting> {
		const meeting = (await worker.createRouter(config.routerOptions)) as Meeting
		meeting.peers = new Map()

		return meeting
	}
}
