import { Client } from '../../client/Client';
import { Member } from '../../structures/Member';

export class MemberCacheManager {
    private client: Client;
    private cache: Map<string, Member>; // Key is `${guildId}-${userId}`

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<string, Member>();
    }

    private getKey(guildId: bigint, userId: bigint): string {
        return `${guildId.toString()}-${userId.toString()}`;
    }

    public set(member: Member): void {
        if (member.guildId && member.user?.id) {
            this.cache.set(this.getKey(member.guildId, member.user.id), member);
        }
    }

    public get(guildId: bigint, userId: bigint): Member | undefined {
        return this.cache.get(this.getKey(guildId, userId));
    }

    public delete(guildId: bigint, userId: bigint): boolean {
        return this.cache.delete(this.getKey(guildId, userId));
    }
}