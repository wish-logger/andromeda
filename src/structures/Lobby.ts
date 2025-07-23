import { Client } from '../client/Client';
import { Channel } from './Channel';
import { LobbyMember } from './LobbyMember';

/**
 * Represents a lobby within Discord.
 */
export class Lobby {
    /**
     * The ID of this lobby.
     * @type {bigint}
     */
    public id: bigint;

    /**
     * Application that created the lobby.
     * @type {bigint}
     */
    public applicationId: bigint;

    /**
     * Dictionary of string key/value pairs. The max total length is 1000.
     * @type {Record<string, string> | undefined}
     */
    public metadata?: Record<string, string>;

    /**
     * Members of the lobby.
     * @type {LobbyMember[]}
     */
    public members: LobbyMember[];

    /**
     * The guild channel linked to the lobby.
     * @type {Channel | undefined}
     */
    public linkedChannel?: Channel;

    private client: Client;

    /**
     * @param {Client} client The client that instantiated this lobby.
     * @param {any} data The raw data for the lobby.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.applicationId = BigInt(data.application_id);
        this.metadata = data.metadata;
        this.members = data.members ? data.members.map((m: any) => new LobbyMember(this.client, m)) : [];
        this.linkedChannel = data.linked_channel ? new Channel(this.client, data.linked_channel) : undefined;
    }

    /**
     * Returns a serializable object representation of the lobby.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            application_id: this.applicationId.toString(),
            metadata: this.metadata,
            members: this.members.map(m => m.toJSON()),
            linked_channel: this.linkedChannel?.toJSON(),
        };
    }
}