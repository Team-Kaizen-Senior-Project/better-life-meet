import { WorkerSettings, RouterOptions, WebRtcTransportOptions, TransportListenInfo } from 'mediasoup/node/lib/types'
import os from 'os'

type MediasoupConfiguration = {
	numberOfWorkers: number
	workerSettings: WorkerSettings
	routerOptions: RouterOptions
	webRtcTransportOptions: WebRtcTransportOptions
}

const getListenInfos = (): TransportListenInfo[] => {
	const listenIps: TransportListenInfo[] = []

	for (const networkInterfaces of Object.values(os.networkInterfaces())) {
		networkInterfaces?.forEach((networkInterface) => {
			if (networkInterface.family === 'IPv4') {
				listenIps.push({ ip: networkInterface.address, protocol: 'udp' })
			} else if (networkInterface.family === 'IPv6' && networkInterface.address[0] !== 'f') {
				listenIps.push({ ip: networkInterface.address, protocol: 'udp' })
			}
		})
	}

	if (listenIps.length === 0) {
		listenIps.push({ ip: '127.0.0.1', protocol: 'udp' })
	}

	// TODO: If we have a public IP address, add it
	// listenIps.push({ ip: '0.0.0.0', announcedIp: 'X.X.X.X', protocol: 'udp' })

	return listenIps
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
		listenInfos: getListenInfos(),
	},
}

export default config
