// Managing the state and interactions of each participant in real time communication setup
import { types as mediasoupTypes } from 'mediasoup'

// Peer represents each participant in a room
class Peer {
    id: string
    name: string
    transports: Map<string, mediasoupTypes.Transport>
    consumers: Map<string, mediasoupTypes.Consumer>
    producers: Map<string, mediasoupTypes.Producer>

    constructor(socket_id: string, name: string) {
        this.id = socket_id
        this.name = name
        this.transports = new Map()
        this.consumers = new Map()
        this.producers = new Map()
    }

    addTransport(transport: mediasoupTypes.Transport) {
        this.transports.set(transport.id, transport)
    }

    async connectTransport(transport_id: string, dtlsParameters: mediasoupTypes.DtlsParameters) {
        const transport = this.transports.get(transport_id)
        if (transport) {
            await transport.connect({ dtlsParameters })
        }
    }

    async createProducer(producerTransportId: string, rtpParameters: mediasoupTypes.RtpParameters, kind: mediasoupTypes.MediaKind): Promise<mediasoupTypes.Producer> {
        const transport = this.transports.get(producerTransportId)
        if (!transport) {
            throw new Error("Transport not found")
        }
        let producer = await transport.produce({ kind, rtpParameters });
        this.producers.set(producer.id, producer)

        producer.on('transportclose', () => {
            console.log('Producer transport close', { name: this.name, producer_id: producer.id })
            producer.close()
            this.producers.delete(producer.id)
        });

        return producer
    }
    
    async createConsumer(consumer_transport_id: string, producer_id: string, rtpCapabilities: mediasoupTypes.RtpCapabilities): Promise<any> { 
        const consumerTransport = this.transports.get(consumer_transport_id)
        if (!consumerTransport) {
            throw new Error("Consumer transport not found")
        }

        const consumer = await consumerTransport.consume({
            producerId: producer_id,
            rtpCapabilities,
            paused: false, 
        })

        this.consumers.set(consumer.id, consumer)

        consumer.on('transportclose', () => {
            console.log('Consumer transport close', { name: this.name, consumer_id: consumer.id })
            this.consumers.delete(consumer.id)
        })

        return {
            consumer,
            params: {
                producerId: producer_id,
                id: consumer.id,
                kind: consumer.kind,
                rtpParameters: consumer.rtpParameters,
                type: consumer.type,
                producerPaused: consumer.producerPaused
            }
        }
    }

    closeProducer(producer_id: string) {
        const producer = this.producers.get(producer_id)
        if (producer) {
            producer.close()
            this.producers.delete(producer_id);
        }
    }

    getProducer(producer_id: string): mediasoupTypes.Producer | undefined {
        return this.producers.get(producer_id)
    }

    close() {
        this.transports.forEach(transport => transport.close())
    }

    removeConsumer(consumer_id: string) {
        this.consumers.delete(consumer_id)
    }
}

export default Peer;