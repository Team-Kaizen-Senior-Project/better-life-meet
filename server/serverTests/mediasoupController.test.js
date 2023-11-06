/* 
    This file is for testing the mediasoupController.js file.
    The first test is testing the initWebRtcTransport function.
    The second test is testing the createProducer function.
*/

const { initWebRtcTransport, createProducer } = require('../controllers/mediasoupController.js');
const { getRouter } = require("../mediasoup/mediasoup.js");
const h3 = require('h3');

jest.mock('../mediasoup/mediasoup.js');
jest.mock('h3', () => ({
  ...jest.requireActual('h3'),
  readBody: jest.fn(),
}));

describe("WebRTC Controller", () => {
  const mockTransportId = 'mockTransportId'; // mocked transport ID
  const mockProducerId = 'mockProducerId'; // mocked producer ID

  beforeEach(() => {
    // reset mocks
    getRouter.mockReset();
    h3.readBody.mockReset();
  });

  it("should initialize WebRTC transport", async () => {
    // Setup
    getRouter.mockReturnValue({
      createWebRtcTransport: jest.fn().mockResolvedValue({
        id: mockTransportId,
        // other properties as needed
      })
    });

    const result = await initWebRtcTransport();

    // Verify
    expect(result).toEqual({
      id: mockTransportId,
      // other properties as needed
    });
  });

  it('should create a producer', async () => {
    // Setup
    h3.readBody.mockResolvedValue({
      transportId: mockTransportId,
      kind: 'audio', // or 'video'...
      rtpParameters: {}, // the actual RTP parameters needed
    });

    const mockTransport = {
      produce: jest.fn().mockResolvedValue({
        id: mockProducerId,
      }),
    };

    const mockTransportsMap = new Map();
    mockTransportsMap.set(mockTransportId, mockTransport);

    getRouter.mockReturnValue({
      _transports: mockTransportsMap,
    });

    const result = await createProducer({ req: { body: {} }, res: {} });

    // Verify
    expect(result).toEqual({
      id: mockProducerId,
    });
  });
});
