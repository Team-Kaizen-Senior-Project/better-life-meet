import config from './config'
import { types as mediasoupTypes } from "mediasoup"
import { Server as SocketIOServer } from 'socket.io'
import Peer from './Peer'

interface Producer {
    id: string
}

class Room {
    id: string
    router: mediasoupTypes.Router | undefined
    io: SocketIOServer
    peers: Map<string, Peer>
  
    constructor(room_id: string, worker: mediasoupTypes.Worker, io: SocketIOServer) {
      this.id = room_id
      this.io = io
      this.peers = new Map<string, Peer>()
      this.initializeRouter(worker)
    }
  
    async initializeRouter(worker: mediasoupTypes.Worker) {
      const mediaCodecs = config.mediasoup.router.mediaCodecs
  
      try {
        const router = await worker.createRouter({ mediaCodecs })
        this.router = router
      } catch (error) {
        console.error('Error creating router:', error)
      }
    }

    // add peer
    addPeer(peer: Peer) {
        this.peers.set(peer.id, peer)
    }

    // Get producer list for peer
    getProducerListForPeer(): Array<{ producer_id: string }> {
        let producerList: Array<{ producer_id: string }> = []
        this.peers.forEach(peer => {
            peer.producers.forEach((producer: Producer) => {
                producerList.push({ producer_id: producer.id })
            });
        });
        return producerList
    }

    // get RTP capabilities
    getRtpCapabilities() {
        if (!this.router) {
            console.error('Router is not initialized yet')
            return
        }
        return this.router.rtpCapabilities
    }

    // Connect peer transport
    async connectPeerTransport(socket_id: string, peerId: string, transport: mediasoupTypes.WebRtcTransport, 
        dtlsParameters: mediasoupTypes.DtlsParameters) {
        if (!this.router) {
            console.error('Router is not initialized yet, cannot connect peer transport')
            return
        }
        const peer = this.peers.get(socket_id)
        if (!peer) {
            console.error('Peer not found')
            throw new Error('Peer not found')
        }
        await peer.connectTransport(transport.id, dtlsParameters)
    }

    // Create producer for specific peer in the room
    async produce(socket_id: string, producerTransportId: string, rtpParameters: mediasoupTypes.RtpParameters, kind: mediasoupTypes.MediaKind): Promise<any> {
        if (!this.router) {
            console.error('Router is not initialized yet, cannot make producer')
            throw new Error('Router is not initialized')
        }
        const peer = this.peers.get(socket_id)
        if (!peer) {
            console.error('Peer not found')
            throw new Error('Peer not found')
        }
        let producer = await peer.createProducer(producerTransportId, rtpParameters, kind)
        
        // broadcasting new producer to other peers in the room
        this.broadCast(socket_id, 'newProducers', [{
            producer_id: producer.id,
            producer_socket_id: socket_id
        }]);

        return producer.id 
    }
    
    // Create a consumer for specific peer in the room
    async consume(socket_id: string, consumer_transport_id: string, producer_id: string, rtpCapabilities: mediasoupTypes.RtpCapabilities): Promise<any> { 
        if (!this.router || !this.router.canConsume({
            producerId: producer_id,
            rtpCapabilities,
        })) {
            console.error('Cannot consume: router not initialized or cannot consume')
            throw new Error('Cannot consume')
        }
        const peer = this.peers.get(socket_id)
        if (!peer) {
            console.error('Peer not found')
            throw new Error('Peer not found')
        }

        let { consumer, params } = await peer.createConsumer(consumer_transport_id, producer_id, rtpCapabilities)

        consumer.on('producerclose', () => {
            console.log('Consumer closed due to producerclose event', {
                name: `${this.peers.get(socket_id)?.name}`,
                consumer_id: consumer.id,
            });
            this.peers.get(socket_id)?.removeConsumer(consumer.id);
            this.io.to(socket_id).emit('consumerClosed', {
                consumer_id: consumer.id,
            })
        })

        return params
    }

    // Broadcast a message to all peers except the one specified by socket_id
    broadCast(socket_id: string, name: string, data: any): void {
        for (let otherID of Array.from(this.peers.keys()).filter(id => id !== socket_id)) {
            this.send(otherID, name, data)
        }
    } 
    
    // send a message to a specific peer identified by socket_id
    send(socket_id: string, name: string, data: any): void {
        this.io.to(socket_id).emit(name, data)
    }

    // utility for getting all peers in the room
    getPeers(): Map<string, Peer> {
        return this.peers
    }
}

module.exports = Room
