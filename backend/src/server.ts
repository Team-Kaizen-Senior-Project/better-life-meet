import http from 'http'
import io from 'socket.io'
import express, { Express } from 'express'
import cors from 'cors'
import SelectiveForwardingUnit from './SelectiveForwardingUnit'
import Meeting from './Meeting'
import Peer from './Peer'

import type { TransportOptions, DtlsParameters } from 'mediasoup-client/lib/types'
import type { WebRtcTransport } from 'mediasoup/node/lib/WebRtcTransport'
import type { ProducerOptions } from 'mediasoup/node/lib/Producer'
import type { DataProducerOptions } from 'mediasoup/node/lib/DataProducer'

const initializeExpressServer = (): Express => {
	const app: Express = express()
	app.use(cors())

	// * Specify Express endpoints here
	app.get('/mediasoup', (req, res) => {
		res.send('Hello, world!')
	})

	return app
}

const initializeWebSocketServer = (httpServer: http.Server, sfu: SelectiveForwardingUnit): io.Server => {
	const wss: io.Server = new io.Server(httpServer, {
		path: '/wss',
		cors: {
			origin: '*',
		},
	})

	const sockets: Map<string, Meeting> = new Map()
	const transports: Map<string, WebRtcTransport> = new Map() // FIXME: Dead transports need to be removed when socket closes

	// * Specify WebSocket events here
	wss.on('connection', async (socket: io.Socket) => {
		socket.on('join', (meetingId, callback) => {
			// Check if the meeting ID is valid
			if (sfu.meetings.has(meetingId)) {
				const meeting: Meeting = sfu.meetings.get(meetingId)!

				const peer: Peer = new Peer(socket)
				meeting.peers.set(peer.id, peer)

				console.log(`${peer.id} joined meeting: ${meeting.id}`)

				sockets.set(socket.id, meeting)
				callback(true)
			} else {
				callback(false)
			}
		})

		socket.on('disconnect', () => {
			if (sockets.has(socket.id)) {
				const meeting: Meeting = sockets.get(socket.id)!
				const peer: Peer = meeting.peers.get(socket.id)!

				if (meeting.peers.has(peer.id)) {
					meeting.peers.delete(peer.id)
					// TODO: Update other peers of this disconnect
				}

				console.log(`${peer.id} left meeting: ${meeting.id}`)
				sockets.delete(socket.id)
			}
		})

		socket.on('getRouterCapabilities', (meetingId, callback) => {
			const meeting: Meeting = sfu.meetings.get(meetingId)!
			callback(meeting.rtpCapabilities)
		})

		socket.on('createSendTransport', async (meetingId, callback) => {
			const meeting: Meeting = sfu.meetings.get(meetingId)!
			const peer: Peer = meeting.peers.get(socket.id)!

			const sendTransport = await peer.createSendTransport(meeting)
			transports.set(sendTransport.id, sendTransport)

			const transportOptions: TransportOptions = {
				id: sendTransport.id,
				iceParameters: sendTransport.iceParameters,
				iceCandidates: sendTransport.iceCandidates,
				dtlsParameters: sendTransport.dtlsParameters,
			}

			callback(transportOptions)
		})

		socket.on('transport-connect', (transportId: string, parameters: { dtlsParameters: DtlsParameters }) => {
			const transport = transports.get(transportId)!
			transport.connect(parameters)
		})

		socket.on('transport-produce', async (transportId, parameters: ProducerOptions, callback) => {
			const transport = transports.get(transportId)!
			const producer = await transport.produce(parameters)

			callback(producer.id)
		})

		socket.on('transport-producedata', async (transportId, parameters: DataProducerOptions, callback) => {
			const transport = transports.get(transportId)!
			const producer = await transport.produceData(parameters)

			callback(producer.id)
		})
	})

	return wss
}

const main = async () => {
	const sfu: SelectiveForwardingUnit = await SelectiveForwardingUnit.getInstance()

	// Temporary meeting
	const meeting = await sfu.createMeeting()
	console.log(meeting.id)

	const app: Express = initializeExpressServer()

	const httpServer: http.Server = new http.Server(app)

	const wss: io.Server = initializeWebSocketServer(httpServer, sfu)

	httpServer.listen(3333, () => {
		console.log('Listening on port 3333')
	})
}

if (require.main === module) {
	main()
}
