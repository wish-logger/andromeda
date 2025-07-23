import { User } from '../../structures/User';
import { Client } from '../../client/Client';

export class UserCacheManager {
    private client: Client;
    private cache: Map<bigint, User>;

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<bigint, User>();
    }

    public set(user: User): void {
        this.cache.set(BigInt(user.id), user);
    }

    public get(userId: bigint): User | undefined {
        return this.cache.get(userId);
    }

    public delete(userId: bigint): void {
        this.cache.delete(userId);
    }

    public clear(): void {
        this.cache.clear();
    }

    public get size(): number {
        return this.cache.size;
    }
} 