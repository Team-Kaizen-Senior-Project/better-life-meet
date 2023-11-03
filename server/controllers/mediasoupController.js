const { getRouter } = require("../mediasoup/mediasoup.js");

module.exports = {
  async initWebRtcTransport(req, res) {
    try {
      const router = getRouter();
      if (!router) {
        throw new Error('Router is not initialized');
      }
      
      const webRtcTransportOptions = {
        listenIps: [
          { ip: "127.0.0.1", announcedIp: null },
        ],
        enableUdp: true,
        enableTcp: false,
        preferUdp: true,
      };

      const webRtcTransport = await router.createWebRtcTransport(webRtcTransportOptions);

      const transportParams = {
        id: webRtcTransport.id,
        iceParameters: webRtcTransport.iceParameters,
        iceCandidates: webRtcTransport.iceCandidates,
        dtlsParameters: webRtcTransport.dtlsParameters,
      };

      res.json(transportParams);
    } catch (error) {
      console.error(`Failed to initialize WebRTC Transport: ${error}`);
      res.status(500).send(error.message);
    }
  },

  async createProducer(req, res) {
    try {
      const router = getRouter();
      if (!router) {
        throw new Error('Router is not initialized');
      }

      const { transportId, kind, rtpParameters } = req.body;

      const transport = router._transports.get(transportId);
      console.log(`transportId: ${transportId}`)
      if (!transport) {
        throw new Error(`Transport with id "${transportId}" not found`);
      }

      const producer = await transport.produce({ kind, rtpParameters });

      res.json({ id: producer.id });
      console.log(`Created producer with id ${producer.id}`);
    } catch (error) {
      console.error(`Failed to create producer: ${error}`);
      res.status(500).send(error.message);
    }
  }
};