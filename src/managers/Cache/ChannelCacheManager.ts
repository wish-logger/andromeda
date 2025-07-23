import { Channel } from '../../structures/Channel';
import { Client } from '../../client/Client';

export class ChannelCacheManager {
    private client: Client;
    private cache: Map<bigint, Channel>;

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<bigint, Channel>();
    }

    public set(channel: Channel): void {
        this.cache.set(channel.id, channel);
    }

    public get(channelId: bigint): Channel | undefined {
        return this.cache.get(channelId);
    }

    public delete(channelId: bigint): void {
        this.cache.delete(channelId);
    }

    public clear(): void {
        this.cache.clear();
    }

    public get size(): number {
        return this.cache.size;
    }
} 