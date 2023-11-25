import express from 'express'
import type { Request, Response } from 'express'
import { Server as SocketIOServer } from 'socket.io'
import * as mediasoup from 'mediasoup'
import http from 'http'
import { types as mediasoupTypes } from "mediasoup";


const app = express()
const port = process.env.PORT || 3000
const httpServer = http.createServer(app)
const io = new SocketIOServer(httpServer)

let worker: mediasoupTypes.Worker
let router: mediasoupTypes.Router
let transport: mediasoupTypes.WebRtcTransport


async function startMediaSoup() {
	try {
		worker = await mediasoup.createWorker({
			logLevel: 'warn',
		})
		// router with RTP capabilities
		router = await worker.createRouter({
			mediaCodecs: [
				{
					kind: 'audio',
					mimeType: 'audio/opus',
					clockRate: 48000,
					channels: 2,
				},
				{
					kind: 'video',
					mimeType: 'video/VP8',
					clockRate: 90000,
					parameters: {
						'x-google-start-bitrate': 1000,
					},
				},
			],
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
