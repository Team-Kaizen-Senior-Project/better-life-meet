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

  // other methods related to WebRTC like createProducer, createConsumer
};
