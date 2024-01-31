import http from 'http'
import io from 'socket.io'
import express, { Express } from 'express'
import cors from 'cors'
import SelectiveForwardingUnit from './SelectiveForwardingUnit'
import Meeting from './Meeting'

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

	// * Specify WebSocket events here
	wss.on('connection', async (socket: io.Socket) => {
		socket.on('join', (meetingId, callback) => {
			// Check if the meeting ID is valid
			if (sfu.meetings.has(meetingId)) {
				const meeting = sfu.meetings.get(meetingId)!
				console.log(`${socket.id} joined meeting: ${meeting.id}`)

				sockets.set(socket.id, meeting)
				console.log(sockets.keys())
				callback(true)
			} else {
				callback(false)
			}
		})

		socket.on('disconnect', () => {
			if (sockets.has(socket.id)) {
				const meeting = sockets.get(socket.id)!
				const peers = meeting.peers!

				if (peers.has(socket.id)) {
					peers.delete(socket.id)
					// TODO: Update other peers of this disconnect
				}

				console.log(`${socket.id} left meeting: ${meeting.id}`)
				sockets.delete(socket.id)
			}
			console.log(sockets.keys())
		})

		socket.on('getRouterCapabilities', (meetingId, callback) => {
			const meeting: Meeting = sfu.meetings.get(meetingId)!
			callback(meeting.rtpCapabilities)
		})

		// TODO: Create transports
		socket.on('createSendTransport', () => {})

		socket.on('createRecvTransport', () => {})
	})

	return wss
}

const main = async () => {
	const sfu: SelectiveForwardingUnit = await SelectiveForwardingUnit.getInstance()

	// Temporary room
	const room = await sfu.createRoom()
	console.log(room.id)

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
