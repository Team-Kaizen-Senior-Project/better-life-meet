export async function getWebRtcTransport() {
    const transportParams = await useFetch('/api/webrtc-transport'); // temp name of the api
    // use transportParams to construct and configure an RTCPeerConnection on the client side
    return transportParams;
  }
  