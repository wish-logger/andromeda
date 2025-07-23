import { Client } from '../../client/Client';
import { VoiceState } from '../../structures/VoiceState';

export class VoiceStateCacheManager {
    private client: Client;
    private cache: Map<string, VoiceState>; // Key is `${guildId}-${userId}`

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<string, VoiceState>();
    }

    private getKey(guildId: bigint, userId: bigint): string {
        return `${guildId.toString()}-${userId.toString()}`;
    }

    public set(voiceState: VoiceState): void {
        if (voiceState.guildId && voiceState.userId) {
            this.cache.set(this.getKey(voiceState.guildId, voiceState.userId), voiceState);
        }
    }

    public get(guildId: bigint, userId: bigint): VoiceState | undefined {
        return this.cache.get(this.getKey(guildId, userId));
    }

    public delete(guildId: bigint, userId: bigint): boolean {
        return this.cache.delete(this.getKey(guildId, userId));
    }
} 