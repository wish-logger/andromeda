import { Client } from '../client/Client';
import WebSocket from 'ws';
import { User } from '../structures/User';

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
     * Creates a new GatewayManager instance.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
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

    private _toCamelCase(str: string): string {
        return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
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
            case 10: // Hello
                this.startHeartbeat(d.heartbeat_interval);
                this.identify();
                break;
            case 11: // Heartbeat ACK
                break;
            case 0: // Dispatch
                const eventName = this._toCamelCase(t);
                if (eventName === 'ready') {
                    this.client.user = new User(this.client, d.user);
                }
                this.client.emit(eventName, d);
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
            this.ws.send(JSON.stringify({ op: 1, d: this.lastSequence }));
        }
    }

    /**
     * Sends the IDENTIFY payload to the Discord Gateway.
     * @private
     * @returns {void}
     * @throws {Error} If the WebSocket is not initialized.
     */
    private identify(): void {
        if (!this.ws) {
            throw new Error("WebSocket is not initialized.");
        }
        const payload = {
            op: 2,
            d: {
                token: this.client.token,
                intents: 513, // GUILDS and GUILD_MESSAGES
                properties: {
                    $os: 'win32',
                    $browser: 'andromeda',
                    $device: 'andromeda'
                }
            }
        };
        this.ws.send(JSON.stringify(payload));
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
        this.ws.send(JSON.stringify({ op: 3, d: data }));
    }
}
