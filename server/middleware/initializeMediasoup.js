import { fromNodeMiddleware } from 'h3'; 
import { initializeMediaSoup } from '../mediasoup/mediasoup';

export default fromNodeMiddleware(async (req, res, next) => {
  await initializeMediaSoup(); // initialize mediasoup
  next(); // call next middleware or route handler
});
