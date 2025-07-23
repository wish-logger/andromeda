import { Client } from '../../client/Client';
import { Presence } from '../../structures/Presence';

export class PresenceCacheManager {
    private client: Client;
    private cache: Map<bigint, Presence>;

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<bigint, Presence>();
    }

    public set(presence: Presence): void {
        this.cache.set(presence.user.id, presence);
    }

    public get(userId: bigint): Presence | undefined {
        return this.cache.get(userId);
    }

    public delete(userId: bigint): boolean {
        return this.cache.delete(userId);
    }
} 