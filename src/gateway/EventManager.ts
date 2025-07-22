import { Client } from '../client/Client';
import { User } from '../structures/User';

/**
 * Manages the processing and emission of Discord Gateway events.
 */
export class EventManager {
    private client: Client;

    /**
     * Creates an instance of EventManager.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
    }

    private $toCamelCase(str: string): string {
        return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }

    /**
     * Handles a Discord Gateway Dispatch payload (opcode 0) and emits the corresponding client event.
     * @param {any} payload The dispatch payload received from the Gateway.
     */
    public handle(payload: any): void {
        const { t, d, s } = payload; // t: event name, d: event data, s: sequence

        const eventName = this.$toCamelCase(t);

        // Special handling for READY event to set client.user and session_id
        if (eventName === 'ready') {
            this.client.user = new User(this.client, d.user);
            // This sessionId is handled by GatewayManager, but we pass it for context if needed.
            // The GatewayManager will explicitly store this.sessionId on its own.
        }

        this.client.emit(eventName, d); // Emit the event to the client
    }
} 