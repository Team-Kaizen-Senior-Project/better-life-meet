import { fromNodeMiddleware } from 'h3'; // h3 is a wrapper around express, used for server-side rendering
import { initializeMediaSoup } from '../mediasoup/mediasoup';

export default fromNodeMiddleware(async (req, res, next) => {
  await initializeMediaSoup(); // initialize mediasoups
  next(); // call next middleware or route handler
});
