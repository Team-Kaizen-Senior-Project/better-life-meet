const { readBody } = require('h3');
const { getRouter } = require("../mediasoup/mediasoup.js");

// Utility function to get the configured router
function getInitializedRouter() {
  const router = getRouter();
  if (!router) {
    throw new Error('Router is not initialized');
  }
  return router;
}

const commonWebRtcTransportOptions = {
  listenIps: [{ ip: "127.0.0.1", announcedIp: null }],
  enableUdp: true,
  enableTcp: false,
  preferUdp: true,
  // maybe add more options?
};

async function createWebRtcTransport(options) {
  const router = getInitializedRouter();
  const transportOptions = { ...commonWebRtcTransportOptions, ...options };
  return router.createWebRtcTransport(transportOptions);
}

function constructTransportResponse(webRtcTransport) {
  return {
    id: webRtcTransport.id,
    iceParameters: webRtcTransport.iceParameters,
    iceCandidates: webRtcTransport.iceCandidates,
    dtlsParameters: webRtcTransport.dtlsParameters,
  };
}

async function initWebRtcTransport(transportOptions) {
  const webRtcTransport = await createWebRtcTransport(transportOptions);
  return constructTransportResponse(webRtcTransport);
}

async function createProducer(event) {
  const router = getInitializedRouter();
  const { transportId, kind, rtpParameters } = await readBody(event);
  const transport = router._transports.get(transportId); // Might need to find a safer way to access the transport

  if (!transport) {
    throw new Error(`Transport with id "${transportId}" not found`);
  }

  const producer = await transport.produce({ kind, rtpParameters });
  console.log(`Created producer with id ${producer.id}`);
  return { id: producer.id };
}

async function createConsumer(event) {
  const router = getInitializedRouter();
  const { transportId, producerId } = await readBody(event);
  const transport = router._transports.get(transportId);

  if (!transport) {
    throw new Error(`Transport with id "${transportId}" not found`);
  }

  const consumer = await transport.consume({ producerId });
  return {
    id: consumer.id,
    producerId,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
    type: consumer.type,
  };
}

module.exports = {
  createWebRtcTransport,
  constructTransportResponse,
  initWebRtcTransport,
  createProducer,
  createConsumer,
};
