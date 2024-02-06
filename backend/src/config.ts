import { WorkerSettings, RouterOptions, WebRtcTransportOptions } from 'mediasoup/node/lib/types'
import os from 'os'

type MediasoupConfiguration = {
	numberOfWorkers: number
	workerSettings: WorkerSettings
	routerOptions: RouterOptions
	webRtcTransportOptions: WebRtcTransportOptions
}

const config: MediasoupConfiguration = {
	numberOfWorkers: os.cpus().length,
	workerSettings: {
		logLevel: 'warn',
		logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp', 'rtx', 'bwe', 'score', 'simulcast', 'svc', 'sctp'],
	},
	routerOptions: {
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
			{
				kind: 'video',
				mimeType: 'video/VP9',
				clockRate: 90000,
				parameters: {
					'profile-id': 2,
					'x-google-start-bitrate': 1000,
				},
			},
			{
				kind: 'video',
				mimeType: 'video/h264',
				clockRate: 90000,
				parameters: {
					'packetization-mode': 1,
					'profile-level-id': '4d0032',
					'level-asymmetry-allowed': 1,
					'x-google-start-bitrate': 1000,
				},
			},
			{
				kind: 'video',
				mimeType: 'video/h264',
				clockRate: 90000,
				parameters: {
					'packetization-mode': 1,
					'profile-level-id': '42e01f',
					'level-asymmetry-allowed': 1,
					'x-google-start-bitrate': 1000,
				},
			},
		],
	},
	webRtcTransportOptions: {
		listenIps: [
			{
				ip: '0.0.0.0',
				announcedIp: '127.0.0.1',
			},
		],
		enableUdp: true,
		enableTcp: true,
		preferUdp: true,
	},
}

export default config