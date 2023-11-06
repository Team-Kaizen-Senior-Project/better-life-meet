export async function getWebRtcTransport() {
    const transportParams = await useFetch('/api/webrtc-transport'); // temp name of the api, will change later
    // use transportParams to construct and configure an RTCPeerConnection on the client side
    return transportParams;
  }
  