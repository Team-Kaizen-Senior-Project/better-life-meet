import { WebRtcTransport } from 'mediasoup/node/lib/types'
import io from 'socket.io'
import Meeting from './Meeting'
import config from './config'

export default class Peer {
	readonly id: string
	private sendTransport: WebRtcTransport | undefined
	private recvTransports: WebRtcTransport[]

	constructor(socket: io.Socket) {
		this.id = socket.id
        this.recvTransports = []
	}

	public async createSendTransport(meeting: Meeting): Promise<WebRtcTransport> {
		this.sendTransport = await meeting.createWebRtcTransport(config.webRtcTransportOptions)
        return this.sendTransport
	}

	// public static build(socket: io.Socket) {

	// }
}
