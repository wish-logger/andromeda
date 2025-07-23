import { Guild } from '../../structures/Guild';
import { Client } from '../../client/Client';

export class GuildCacheManager {
    private client: Client;
    private cache: Map<bigint, Guild>;

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<bigint, Guild>();
    }

    public set(guild: Guild): void {
        this.cache.set(BigInt(guild.id), guild);
    }

    public get(guildId: bigint): Guild | undefined {
        return this.cache.get(guildId);
    }

    public delete(guildId: bigint): void {
        this.cache.delete(guildId);
    }

    public clear(): void {
        this.cache.clear();
    }

    public get size(): number {
        return this.cache.size;
    }
} 