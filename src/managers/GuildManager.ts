import { Client } from '../client/Client';
import { Guild } from '../structures/Guild';

export class GuildManager {
    private client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Fetches a guild by its ID.
     * @param {BigInt} guildId The ID of the guild to fetch.
     * @returns {Promise<Guild | null>} The guild object, or null if not found.
     */
    public async fetch(guildId: bigint): Promise<Guild | null> {
        const cachedGuild = this.client.guildCache.get(guildId);
        if (cachedGuild) {
            return cachedGuild;
        }

        try {
            const data = await this.client.rest.request('GET', `/guilds/${guildId.toString()}?with_counts=true`);
            const guild = new Guild(this.client, data);
            this.client.guildCache.set(guild);
            return guild;
        } catch (error) {
            console.error(`Failed to fetch guild ${guildId}:`, error);
            return null;
        }
    }
}