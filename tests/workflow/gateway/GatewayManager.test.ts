import { GatewayManager } from '../../..//src/gateway/GatewayManager';
import { Client } from '../../../src/client/Client';
import { GatewayIntentBits } from '../../../src/types/Intents';
import WebSocket from 'ws';

jest.mock('ws');

const MockedWebSocket = WebSocket as jest.MockedClass<typeof WebSocket>;

describe('GatewayManager', () => {
  let client: Client;
  let gatewayManager: GatewayManager;
  let mockWebSocketInstance: any;

  beforeEach(() => {

    MockedWebSocket.mockClear();

    client = new Client({ intents: [GatewayIntentBits.GUILDS, GatewayIntentBits.GUILD_MESSAGES] });
    client.token = 'mock_token';
    gatewayManager = new GatewayManager(client);

    mockWebSocketInstance = {
      on: jest.fn(),
      send: jest.fn(),
      close: jest.fn(),
      readyState: WebSocket.OPEN,
    };
    MockedWebSocket.mockImplementation(() => mockWebSocketInstance);

    jest.spyOn(global, 'setInterval').mockReturnValue(123 as any);
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the gateway', () => {
    gatewayManager.connect();
    expect(WebSocket).toHaveBeenCalledWith('wss://gateway.discord.gg/?v=10&encoding=json');
    expect(mockWebSocketInstance.on).toHaveBeenCalledWith('message', expect.any(Function));
    expect(mockWebSocketInstance.on).toHaveBeenCalledWith('close', expect.any(Function));
    expect(mockWebSocketInstance.on).toHaveBeenCalledWith('error', expect.any(Function));
  });

  it('should throw error if no token is provided', () => {
    client.token = null;
    expect(() => gatewayManager.connect()).toThrow('No token provided to connect with.');
  });

  it('should not connect if already open', () => {
    gatewayManager.connect();
    gatewayManager.connect();
    expect(WebSocket).toHaveBeenCalledTimes(1);
  });

  it('should handle Hello (opcode 10) and identify', () => {
    gatewayManager.connect();
    const messageHandler = mockWebSocketInstance.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    const helloPayload = { op: 10, d: { heartbeat_interval: 45000 } };
    messageHandler(JSON.stringify(helloPayload));

    expect(global.setInterval).toHaveBeenCalledWith(expect.any(Function), 45000);
    expect(mockWebSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({
      op: 2,
      d: {
        token: 'mock_token',
        intents: client.intents,
        properties: {
          $os: 'win32',
          $browser: 'andromeda',
          $device: 'andromeda',
        },
      },
    }));
  });

  it('should send heartbeat', () => {
    gatewayManager.connect();
    const messageHandler = mockWebSocketInstance.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    const helloPayload = { op: 10, d: { heartbeat_interval: 100 } };
    messageHandler(JSON.stringify(helloPayload));

    const heartbeatFn = (global.setInterval as jest.Mock).mock.calls[0][0];
    heartbeatFn();

    expect(mockWebSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({ op: 1, d: null }));
  });

  it('should handle Dispatch (opcode 0) and emit event', () => {
    gatewayManager.connect();
    const emitSpy = jest.spyOn(client, 'emit');
    const messageHandler = mockWebSocketInstance.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    const dispatchPayload = { op: 0, t: 'MESSAGE_CREATE', s: 1, d: { id: 'msg1', content: 'test' } };
    messageHandler(JSON.stringify(dispatchPayload));

    expect(emitSpy).toHaveBeenCalledWith('messageCreate', dispatchPayload.d);
    expect((gatewayManager as any).lastSequence).toBe(1);
  });

  it('should handle ready event and set client.user', () => {
    gatewayManager.connect();
    const messageHandler = mockWebSocketInstance.on.mock.calls.find((call: any[]) => call[0] === 'message')[1];

    const readyPayload = { op: 0, t: 'READY', s: 2, d: { user: { id: 'user1', username: 'TestUser' } } };
    messageHandler(JSON.stringify(readyPayload));

    expect(client.user).toBeDefined();
    expect(client.user.id).toBe('user1');
    expect(client.user.username).toBe('TestUser');
  });

  it('should update presence', () => {
    gatewayManager.connect();
    const presenceData = { status: 'online', activities: [] };
    gatewayManager.updatePresence(presenceData);
    expect(mockWebSocketInstance.send).toHaveBeenCalledWith(JSON.stringify({ op: 3, d: presenceData }));
  });

  it('should warn if updatePresence called when not connected', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockWebSocketInstance.readyState = WebSocket.CLOSED;
    const presenceData = { status: 'online', activities: [] };
    gatewayManager.updatePresence(presenceData);
    expect(consoleWarnSpy).toHaveBeenCalledWith('WebSocket is not connected. Cannot update presence.');
    expect(mockWebSocketInstance.send).not.toHaveBeenCalled();
    consoleWarnSpy.mockRestore();
  });
});