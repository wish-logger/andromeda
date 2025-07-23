import { GatewayManager } from '../../..//src/gateway/GatewayManager';
import { Client } from '../../../src/client/Client';
import { GatewayIntentBits } from '../../../src/types/Intents';
import { ActivityType, PresenceUpdateStatus } from '../../../src/types/Presence';
import WebSocket from 'ws';
import { GatewayOpcodes } from '../../../src/types/Gateway';

jest.mock('ws');

const MockedWebSocket = WebSocket as jest.MockedClass<typeof WebSocket>;

describe('GatewayManager', () => {
  let client: Client;
  let gatewayManager: GatewayManager;

  let createdWsInstances: any[] = [];

  beforeEach(() => {

    MockedWebSocket.mockClear();
    createdWsInstances = [];

    MockedWebSocket.mockImplementation(() => {
      const newMockWs: any = {
        on: jest.fn(),
        send: jest.fn(),
        close: jest.fn(() => {
          newMockWs.readyState = WebSocket.CLOSED; // Simulate closure
        }),
        readyState: WebSocket.OPEN,
      };
      createdWsInstances.push(newMockWs); // Store the new instance
      return newMockWs;
    });

    client = new Client({ intents: [GatewayIntentBits.GUILDS, GatewayIntentBits.GUILD_MESSAGES], clusterId: 0, totalClusters: 1 });
    client.token = 'mock_token';
    gatewayManager = new GatewayManager(client);

    jest.spyOn(global, 'setInterval').mockReturnValue(123 as any);
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the gateway', () => {
    gatewayManager.connect();
    expect(MockedWebSocket).toHaveBeenCalledWith('wss://gateway.discord.gg/?v=10&encoding=json');
    // Expect that a WebSocket instance was created
    expect(createdWsInstances.length).toBe(1);
    const currentWs = createdWsInstances[0];

    expect(currentWs.on).toHaveBeenCalledWith('open', expect.any(Function));
    expect(currentWs.on).toHaveBeenCalledWith('message', expect.any(Function));
    expect(currentWs.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(currentWs.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should throw error if no token is provided', () => {
    client.token = null;
    expect(() => gatewayManager.connect()).toThrow('No token provided to connect with.');
  });

  it('should not connect if already open', () => {
    gatewayManager.connect();

    expect(createdWsInstances.length).toBe(1);
    
    gatewayManager.connect(); // Second call
    // Should not create a new WebSocket if already open
    expect(createdWsInstances.length).toBe(1);
  });

  it('should handle Hello (opcode 10) and identify', () => {
    gatewayManager.connect();
    const currentWs = createdWsInstances[0]; // Get the initial WS instance
    const openHandler = currentWs.on.mock.calls.find((call: any[]) => call[0] === 'open')[1];
    const messageHandler = currentWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    // Simulate 'open' to trigger identify
    openHandler();

    const helloPayload = { op: 10, d: { heartbeat_interval: 45000 } };
    messageHandler(JSON.stringify(helloPayload));

    expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), 45000);

    const expectedIdentifyPayload = {
      op: 2,
      d: {
        token: 'mock_token',
        properties: {
          os: process.platform,
          browser: 'Andromeda',
          device: 'Andromeda',
        },
        large_threshold: 250,
        shard: [0, 1],
        presence: {
          activities: [{ name: 'Starting cluster 0...', type: ActivityType.PLAYING }],
          status: PresenceUpdateStatus.Idle,
          since: null,
          afk: true,
        },
        intents: client.intents,
      },
    };

    expect(currentWs.send).toHaveBeenCalledTimes(1); // Ensure send was called once on current WS
    const sentPayloadString = currentWs.send.mock.calls[0][0];
    const sentPayloadObject = JSON.parse(sentPayloadString);

    expect(sentPayloadObject).toEqual(expectedIdentifyPayload);
  });

  it('should send heartbeat', () => {
    gatewayManager.connect();
    const currentWs = createdWsInstances[0];
    const messageHandler = currentWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    const helloPayload = { op: 10, d: { heartbeat_interval: 100 } };
    messageHandler(JSON.stringify(helloPayload));

    const heartbeatFn = (global.setInterval as jest.Mock).mock.calls[0][0];
    heartbeatFn();

    expect(currentWs.send).toHaveBeenCalledWith(JSON.stringify({ op: 1, d: null }));
  });

  it('should handle Dispatch (opcode 0) and emit event', () => {
    gatewayManager.connect();
    const currentWs = createdWsInstances[0];
    const emitSpy = jest.spyOn(client, 'emit');
    const messageHandler = currentWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    const dispatchPayload = { op: 0, t: 'MESSAGE_CREATE', s: 1, d: { id: 'msg1', content: 'test' } };
    messageHandler(JSON.stringify(dispatchPayload));

    expect(emitSpy).toHaveBeenCalledWith('messageCreate', dispatchPayload.d);
    expect((gatewayManager as any).lastSequence).toBe(1);
  });

  it('should handle ready event and set client.user', () => {
    gatewayManager.connect();
    const currentWs = createdWsInstances[0];
    const messageHandler = currentWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    const readyPayload = { op: 0, t: 'READY', s: 2, d: { user: { id: '123456789012345679', username: 'TestUser' }, session_id: 'mock_session_id' } };
    messageHandler(JSON.stringify(readyPayload));

    expect(client.user).toBeDefined();
    expect(client.user.id).toBe(123456789012345679n);
    expect(client.user.username).toBe('TestUser');
    expect((gatewayManager as any).sessionId).toBe('mock_session_id');
  });

  it('should successfully resume a session', () => {
    // 1. Initial connection and READY event
    gatewayManager.connect();
    const initialWs = createdWsInstances[0];
    const initialOpenHandler = initialWs.on.mock.calls.find((call: any[]) => call[0] === 'open')[1];
    const initialMessageHandler = initialWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    initialOpenHandler(); // Triggers initial IDENTIFY
    const readyPayload = { op: 0, t: 'READY', s: 2, d: { user: { id: '123456789012345679', username: 'TestUser' }, session_id: 'mock_session_id' } }; // Changed from 'user1' to a numeric string
    initialMessageHandler(JSON.stringify(readyPayload));

    // Simulate disconnection by calling close on the initial WS instance
    initialWs.close();

    expect(initialWs.readyState).toBe(WebSocket.CLOSED);

    // Reset mock send to check for RESUME payload on the NEW WebSocket
    MockedWebSocket.mockClear(); // Clear constructor calls as well for this check

    // 2. Simulate client reconnecting with existing session data
    gatewayManager.connect(); // This should create a NEW WebSocket and trigger resume logic
    
    // Get the newly created WebSocket instance (it should be the second one in the array)
    expect(createdWsInstances.length).toBe(2); 
    const resumedWs = createdWsInstances[1];
    const resumedOpenHandler = resumedWs.on.mock.calls.find((call: any[]) => call[0] === 'open')[1];
    resumedOpenHandler(); // Trigger RESUME

    // Define the expected RESUME payload
    const expectedResumePayload = {
      op: GatewayOpcodes.Resume,
      d: {
        token: 'mock_token',
        session_id: 'mock_session_id',
        seq: 2, // lastSequence from the READY event
      },
    };

    expect(resumedWs.send).toHaveBeenCalledTimes(1);
    const sentPayloadString = resumedWs.send.mock.calls[0][0];
    const sentPayloadObject = JSON.parse(sentPayloadString);

    expect(sentPayloadObject).toEqual(expectedResumePayload);
  });

  it('should handle Invalid Session (opcode 9) by re-identifying if d is true', () => {
    gatewayManager.connect();
    const initialWs = createdWsInstances[0];
    const initialOpenHandler = initialWs.on.mock.calls.find((call: any[]) => call[0] === 'open')[1];
    const messageHandlerForInitialWs = initialWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    // Simulate initial connection and READY event to set session_id and lastSequence
    initialOpenHandler();
    const readyPayload = { op: 0, t: 'READY', s: 5, d: { user: { id: '123456789012345679', username: 'TestUser' }, session_id: 'mock_session_id' } }; // Changed from 'user1' to a numeric string
    messageHandlerForInitialWs(JSON.stringify(readyPayload));

    // Simulate invalidating the current WebSocket connection
    initialWs.close();
    expect(initialWs.readyState).toBe(WebSocket.CLOSED);

    // Reset mocks for the re-identify sequence
    MockedWebSocket.mockClear(); // Clear constructor calls to count new WS creation

    // Simulate Invalid Session payload where d is true (can re-identify).
    // This will cause GatewayManager.handlePayload to call `this.connect()`. 
    const invalidSessionPayload = { op: GatewayOpcodes.InvalidSession, d: true };
    messageHandlerForInitialWs(JSON.stringify(invalidSessionPayload)); // Use the correct message handler

    // Expect a new WebSocket instance to be created for re-identification
    expect(createdWsInstances.length).toBe(2); // Initial WS + new WS for re-identify
    const reIdentifyWs = createdWsInstances[1]; // Get the new WS instance
    const reIdentifyOpenHandler = reIdentifyWs.on.mock.calls.find((call: any[]) => call[0] === 'open')[1];
    reIdentifyOpenHandler(); // Trigger the open event for the new connection, which calls identify.

    const expectedIdentifyPayload = {
      op: 2,
      d: {
        token: 'mock_token',
        properties: {
          os: process.platform,
          browser: 'Andromeda',
          device: 'Andromeda',
        },
        large_threshold: 250,
        shard: [0, 1],
        presence: {
          activities: [{ name: 'Starting cluster 0...', type: ActivityType.PLAYING }],
          status: PresenceUpdateStatus.Idle,
          since: null,
          afk: true,
        },
        intents: client.intents,
      },
    };

    expect(reIdentifyWs.send).toHaveBeenCalledWith(JSON.stringify(expectedIdentifyPayload));
    expect((gatewayManager as any).sessionId).toBeNull(); // Session ID should be cleared
  });

  it('should handle Reconnect (opcode 7) by closing the WebSocket', () => {
    gatewayManager.connect();
    const initialWs = createdWsInstances[0]; // Get the initial WebSocket instance
    const messageHandler = initialWs.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    // Simulate Reconnect payload
    const reconnectPayload = { op: GatewayOpcodes.Reconnect, d: null };
    messageHandler(JSON.stringify(reconnectPayload));

    expect(initialWs.close).toHaveBeenCalledTimes(1); // Expect the initial WebSocket to be closed
    expect(initialWs.readyState).toBe(WebSocket.CLOSED); // Verify state is set to CLOSED
  });

  it('should warn if updatePresence called when not connected', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    // Simulate a connection being made, then manually set its state to CLOSED
    gatewayManager.connect();
    const currentWs = createdWsInstances[0];
    currentWs.readyState = WebSocket.CLOSED;

    const presenceData = { status: PresenceUpdateStatus.Online, activities: [] };
    gatewayManager.updatePresence(presenceData);
    expect(consoleWarnSpy).toHaveBeenCalledWith('WebSocket is not connected. Cannot update presence.');
    // Expect send not to be called on this specific closed instance
    expect(currentWs.send).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});