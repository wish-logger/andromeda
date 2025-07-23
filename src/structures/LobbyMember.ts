import { Client } from '../client/Client';
import { User } from './User';

/**
 * Represents a member of a lobby, including optional metadata and flags.
 */
export class LobbyMember {
    /**
     * The ID of the user.
     * @type {bigint}
     */
    public id: bigint;

    /**
     * Dictionary of string key/value pairs. The max total length is 1000.
     * @type {Record<string, string> | undefined}
     */
    public metadata?: Record<string, string>;

    /**
     * Lobby member flags combined as a bitfield.
     * @type {LobbyMemberFlags | undefined}
     */
    public flags?: LobbyMemberFlags;

    private client: Client;

    /**
     * @param {Client} client The client that instantiated this lobby member.
     * @param {any} data The raw data for the lobby member.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.metadata = data.metadata;
        this.flags = data.flags;
    }

    /**
     * Fetches the user associated with this lobby member.
     * @returns {Promise<User | null>}
     */
    public async fetchUser(): Promise<User | null> {
        return this.client.fetchUser(this.id);
    }

    /**
     * Returns a serializable object representation of the lobby member.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            metadata: this.metadata,
            flags: this.flags,
        };
    }
}

/**
 * Lobby Member Flags
 */
export enum LobbyMemberFlags {
    /**
     * User can link a text channel to a lobby.
     */
    CanLinkLobby = 1 << 0,
}