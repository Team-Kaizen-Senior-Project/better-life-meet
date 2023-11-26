import os from 'os'

type MediaKind = 'audio' | 'video'

// configuration for workers,=
interface MediasoupWorkerConfig {
    rtcMinPort: number
    rtcMaxPort: number
    logLevel: string
    logTags: string[]
}

// configuration for WebRTC transport
interface MediasoupWebRtcTransportConfig {
    listenIps: {
        ip: string
        announcedIp?: string
    }[];
    maxIncomingBitrate: number
    initialAvailableOutgoingBitrate: number
}

// confirguration for router
interface MediasoupRouterConfig {
    mediaCodecs: {
        kind: MediaKind
        mimeType: string
        clockRate: number
        channels?: number
        parameters?: {
            [key: string]: number | string
        }
    }[]
}

// configuration structure for mediasoup
interface MediasoupConfig {
    listenIp: string
    listenPort: number
    sslCrt: string
    sslKey: string
    mediasoup: {
        numWorkers: number
        worker: MediasoupWorkerConfig
        router: MediasoupRouterConfig
        webRtcTransport: MediasoupWebRtcTransportConfig
    }
}

// retreive local IP address
const getLocalIp = (): string => {
  let localIp = '127.0.0.1'
  const ifaces = os.networkInterfaces()
  
  for (const ifname of Object.keys(ifaces)) {
    for (const iface of ifaces[ifname]!) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address
        break
      }
    }
  }
  return localIp
}

// define actual config object using interfaces defined above
const config: MediasoupConfig = {
  listenIp: '0.0.0.0',
  listenPort: 3016,
  sslCrt: '../ssl/cert.pem',
  sslKey: '../ssl/key.pem',
  mediasoup: {
    numWorkers: os.cpus().length,
    worker: {
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
      logLevel: 'warn',
      logTags: [
        'info',
        'ice',
        'dtls',
        'rtp',
        'srtp',
        'rtcp',
        // 'rtx',
        // 'bwe',
        // 'score',
        // 'simulcast',
        // 'svc'
      ],
    },
    router: {
      mediaCodecs: [
        {
            kind: 'audio',
            mimeType: 'audio/opus',
            clockRate: 48000,
            channels: 2
          },
          {
            kind: 'video',
            mimeType: 'video/VP8',
            clockRate: 90000,
            parameters: {
              'x-google-start-bitrate': 1000
            }
          }
      ],
    },
    webRtcTransport: {
      listenIps: [
        {
          ip: '0.0.0.0',
          announcedIp: getLocalIp(),
        },
      ],
      maxIncomingBitrate: 1500000,
      initialAvailableOutgoingBitrate: 1000000,
    },
  },
}

export default config
