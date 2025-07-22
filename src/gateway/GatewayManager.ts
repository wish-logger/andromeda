import { Client } from '../client/Client';
import WebSocket from 'ws';
import { User } from '../structures/User';
import { $heartbeat } from './structures/heartbeat';
import { $identify } from './structures/identify';
import { $updatePresence } from './structures/Presence';
import { $resume } from './structures/resume';
import { GatewayOpcodes } from '../types/Gateway';
import { EventManager } from './EventManager';

/**
 * Manages the WebSocket connection to the Discord Gateway.
 */
export class GatewayManager {
    /**
     * The client instance.
     * @private
     * @type {Client}
     */
    private client: Client;
    /**
     * The WebSocket instance.
     * @private
     * @type {WebSocket | null}
     */
    private ws: WebSocket | null = null;
    /**
     * The URL for the Discord Gateway.
     * @private
     * @type {string}
     */
    private readonly gatewayURL = 'wss://gateway.discord.gg/?v=10&encoding=json';
    /**
     * The interval for sending heartbeats.
     * @private
     * @type {NodeJS.Timeout | null}
     */
    private heartbeatInterval: NodeJS.Timeout | null = null;
    /**
     * The last sequence number received from the Gateway.
     * @private
     * @type {number | null}
     */
    private lastSequence: number | null = null;
    /**
     * The session ID for resuming connections.
     * @private
     * @type {string | null}
     */
    private sessionId: string | null = null;
    private eventManager: EventManager;

    /**
     * Creates a new GatewayManager instance.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
        this.eventManager = new EventManager(client);
    }

    /**
     * Establishes a connection to the Discord Gateway.
     * @returns {void}
     * @throws {Error} If no token is provided.
     */
    public connect(): void {
        if (!this.client.token) {
            throw new Error('No token provided to connect with.');
        }

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return;
        }

        this.ws = new WebSocket(this.gatewayURL);

        this.ws.on('open', () => {
            if (this.sessionId && this.lastSequence !== null) {
                this.resume();
            } else {
                this.identify();
            }
        });

        this.ws.on('message', (data) => {
            const payload = JSON.parse(data.toString());
            this.handlePayload(payload);
        });

        this.ws.on('close', (code, reason) => {
            console.warn(`Gateway connection closed: ${code} - ${reason.toString()}`);
            if (this.heartbeatInterval) {
                clearInterval(this.heartbeatInterval);
                this.heartbeatInterval = null;
            }
        });

        this.ws.on('error', (error) => {
            console.error('Gateway error:', error);
        });
    }


    /**
     * Handles incoming payloads from the Discord Gateway.
     * @private
     * @param {any} payload The payload received from the Gateway.
     * @returns {void}
     */
    private handlePayload(payload: any): void {
        const { op, d, s, t } = payload;

        if (s) {
            this.lastSequence = s;
        }

        switch (op) {
            case GatewayOpcodes.Hello:
                this.startHeartbeat(d.heartbeat_interval);
                break;
            case GatewayOpcodes.HeartbeatACK:
                break;
            case GatewayOpcodes.Dispatch:
                this.eventManager.handle(payload);
                if (t === 'READY') {
                    this.sessionId = d.session_id;
                }
                break;
            case GatewayOpcodes.InvalidSession:
                console.warn(`Invalid Session. Attempting to ${d ? 're-identify' : 'reconnect'}.`);
                this.sessionId = null;
                this.connect();
                break;
            case GatewayOpcodes.Reconnect:
                this.ws?.close();
                break;
            default:
                console.warn('Received unhandled opcode:', op);
        }
    }

    /**
     * Starts the heartbeat interval.
     * @private
     * @param {number} interval The heartbeat interval in milliseconds.
     * @returns {void}
     */
    private startHeartbeat(interval: number): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, interval);
    }

    /**
     * Sends a heartbeat to the Discord Gateway.
     * @private
     * @returns {void}
     */
    private sendHeartbeat(): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send($heartbeat(this.lastSequence));
        }
    }

    /**
     * Sends the IDENTIFY payload to the Discord Gateway.
     * @private
     * @returns {void}
     * @throws {Error} If the WebSocket is not initialized or no token provided.
     */
    private identify(): void {
        if (!this.ws) {
            throw new Error("WebSocket is not initialized.");
        }
        if (!this.client.token) {
            throw new Error('No token provided for identify.');
        }
        this.ws.send($identify(this.client.token, [this.client.clusterId, this.client.totalClusters], this.client.intents));
    }

    /**
     * Sends the RESUME payload to the Discord Gateway.
     * @private
     * @returns {void}
     * @throws {Error} If WebSocket is not initialized, no token, session ID, or sequence.
     */
    private resume(): void {
        if (!this.ws) {
            throw new Error("WebSocket is not initialized.");
        }
        if (!this.client.token || !this.sessionId || this.lastSequence === null) {
            console.warn('Cannot resume: missing token, session ID, or last sequence. Identifying instead.');
            this.identify();
            return;
        }
        this.ws.send($resume(this.client.token, this.sessionId, this.lastSequence));
    }

    /**
     * Sends a presence update to the Discord Gateway.
     * @param {any} data The presence data to send.
     * @returns {void}
     */
    public updatePresence(data: any): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket is not connected. Cannot update presence.');
            return;
        }
        const { activities, status, afk, since } = data;
        const activityName = activities && activities.length > 0 ? activities[0].name : '';
        const activityType = activities && activities.length > 0 ? activities[0].type : 0;

        this.ws.send($updatePresence(activityName, activityType, status, afk, since));
    }
}