import express from 'express'
import type { Request, Response } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import * as mediasoup from 'mediasoup'
import http from 'http'
import { types as mediasoupTypes } from 'mediasoup'

const Room = require('./Room')
import config from './config'
const app = express()
const port = process.env.PORT || 3000
const httpServer = http.createServer(app)
const io = new SocketIOServer(httpServer)
const mediaCodecs = config.mediasoup.router.mediaCodecs

let worker: mediasoupTypes.Worker
let router: mediasoupTypes.Router
let transport: mediasoupTypes.WebRtcTransport

let roomList = new Map()


async function startMediaSoup() {
	try {
		worker = await mediasoup.createWorker({
			logLevel: 'warn',
		})
		// router with RTP capabilities
		router = await worker.createRouter({
			mediaCodecs: mediaCodecs,
		})
		// create transport
		transport = await router.createWebRtcTransport({
			listenIps: [{ ip: '127.0.0.1'}],
			enableUdp: true,
			enableTcp: true,
			preferUdp: true,
		});
		console.log('mediasoup started successfully')
		console.log("mediasoup version: " + mediasoup.version)
	} catch (err) {	
		console.error('Error starting mediasoup:', err)
	}
}

// Initialize mediasoup 
startMediaSoup()

// Express route handlers
app.get('/', (req: Request, res: Response) => {
	res.send('Hello, world!')
})

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`)
})

function getMediasoupWorker() {
	if (worker) {
		return worker
	}
	else console.error('Mediasoup worker not initialized')
  }

io.on('connection', (socket) => {
	socket.on('createRoom', async ({ room_id }, callback) => {
	  if (roomList.has(room_id)) {
		callback('already exists')
	  } else {
		console.log('Created room', { room_id: room_id })
		let worker = await getMediasoupWorker()
		roomList.set(room_id, new Room(room_id, worker, io))
		callback(room_id)
	  }
	})
})