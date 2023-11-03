/* 
    This file is for testing the mediasoupController.js file.
    The first test is testing the initWebRtcTransport function.
    The second test is testing the createProducer function.
*/

const { initWebRtcTransport, createProducer } = require('../controllers/mediasoupController.js');
const { getRouter } = require("../mediasoup/mediasoup.js");

jest.mock('../mediasoup/mediasoup.js');

describe("WebRTC Controller", () => {
  const mockTransportId = 'mockTransportId'; // Mocked transport ID
  const mockProducerId = 'mockProducerId'; // Mocked producer ID

  beforeEach(() => {
    // Reset the mock implementations before each test
    getRouter.mockReset();
  });

  it("should initialize WebRTC transport", async () => {
    // Setup
    getRouter.mockReturnValue({
      createWebRtcTransport: jest.fn().mockResolvedValue({
        id: mockTransportId,
        // maybe want other properties later
      })
    });

    const mockReq = {};
    const mockRes = {
      json: jest.fn()
    };

    // Exercise
    await initWebRtcTransport(mockReq, mockRes);

    // Verify
    expect(mockRes.json).toHaveBeenCalledWith({
      id: mockTransportId,
      // other properties that your initWebRtcTransport function adds to the response
    });
  });

  it('should create a producer', async () => {
    // Mocking a transport object that has a `produce` method.
    const mockTransport = {
      produce: jest.fn().mockResolvedValue({
        id: mockProducerId,
      }),
    };

    // Mocking the _transports map to return the mockTransport when `get` is called with `mockTransportId`.
    const mockTransportsMap = new Map();
    mockTransportsMap.set(mockTransportId, mockTransport);

    // Adjust the getRouter mock to return an object that includes the _transports map.
    getRouter.mockReturnValue({
      _transports: mockTransportsMap,
      // might want to include any other properties and methods that are necessary for the router mock
    });

    const mockReq = {
      body: {
        transportId: mockTransportId,
        kind: 'audio', // TODO: Test 'video' as well
        rtpParameters: {}, // TODO: Test with rtpParameters
      }
    };

    const mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(), // Mock the status function to allow chaining
      send: jest.fn(), // Mock the send function to complete the chain
    };

    // Exercise
    await createProducer(mockReq, mockRes);

    // Verify
    expect(mockRes.json).toHaveBeenCalledWith({
      id: mockProducerId,
    });

    // Verify that the status and send functions are not called since there should be no error
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockRes.send).not.toHaveBeenCalled();
  });
});
