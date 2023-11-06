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
    getRouter.mockReset();
    h3.readBody.mockReset();
  });

  it("should initialize WebRTC transport", async () => {
    getRouter.mockReturnValue({
      createWebRtcTransport: jest.fn().mockResolvedValue({
        id: mockTransportId,
      })
    });

    const result = await initWebRtcTransport();

    expect(result).toEqual({
      id: mockTransportId,
    });
  });

  it('should create a producer', async () => {
    h3.readBody.mockResolvedValue({
      transportId: mockTransportId,
      kind: 'audio', 
      rtpParameters: {}, 
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

    expect(result).toEqual({
      id: mockProducerId,
    });
  });
});
