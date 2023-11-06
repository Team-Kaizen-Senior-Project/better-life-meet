/*
* Serves as an HTTP API endpoint for the frontend to interact with.
* Handles the creation and configuration of WebRTC transports.
*/
import { defineEventHandler, readBody } from 'h3';
import { initWebRtcTransport } from '../controllers/mediasoupController';


export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    event.res.statusCode = 405; 
    return { error: 'Method Not Allowed' };
  }

  try {
    const body = await readBody(event);
    
    const transportParams = await initWebRtcTransport(body);
    return transportParams;
  } catch (error) {
    if (error instanceof Error) {
      event.res.statusCode = 500;
      return { error: error.message };
    } else {
      event.res.statusCode = 500;
      return { error: 'An unknown error occurred' };
    }
  }
})

