/*
* Serves as an HTTP API endpoint for the frontend to interact with.
* Handles the creation and configuration of WebRTC transports.

* TODO: specifically deal with configuring WebRTC transports, 
        which are part of setting up the media pipeline for sending/receiving media.
*/
import { defineEventHandler, readBody } from 'h3';
import { initWebRtcTransport } from '../controllers/mediasoupController';


export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    event.res.statusCode = 405; // Method Not Allowed
    return { error: 'Method Not Allowed' };
  }

  try {
    const body = await readBody(event);
    
    // Pass any necessary data to the init function
    const transportParams = await initWebRtcTransport(body);
    return transportParams;
  } catch (error) {
    // Type-check the error to satisfy TypeScript's type safety
    if (error instanceof Error) {
      event.res.statusCode = 500;
      return { error: error.message };
    } else {
      // where the error is not an instance of Error
      event.res.statusCode = 500;
      return { error: 'An unknown error occurred' };
    }
  }
})

