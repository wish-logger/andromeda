import { SoundboardSoundData } from "../types/SoundboardSound";
import { Client } from "../client/Client";
import { User } from "./User";

export class SoundboardSound {
    public client: Client;
    public name: string;
    public soundId: bigint;
    public volume: number;
    public emojiId: bigint | null;
    public emojiName: string | null;
    public guildId: bigint | null;
    public available: boolean;
    public user: User | null;

    constructor(client: Client, data: SoundboardSoundData) {
        this.client = client;
        this.name = data.name;
        this.soundId = BigInt(data.sound_id);
        this.volume = data.volume;
        this.emojiId = data.emoji_id ? BigInt(data.emoji_id) : null;
        this.emojiName = data.emoji_name ?? null;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : null;
        this.available = data.available;
        this.user = data.user ? new User(client, data.user) : null; 
    }

    public toJSON() {
        return {
            name: this.name,
            sound_id: this.soundId.toString(),
            volume: this.volume,
            emoji_id: this.emojiId?.toString() ?? null,
            emoji_name: this.emojiName,
            guild_id: this.guildId?.toString() ?? null,
            available: this.available,
            user: this.user?.toJSON() ?? null,
        };
    }
}