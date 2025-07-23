import { User } from "../structures/User";

export interface SoundboardSoundData {
    name: string;
    sound_id: bigint;
    volume: number;
    emoji_id?: bigint | null;
    emoji_name?: string | null;
    guild_id?: bigint;
    available: boolean;
    user?: User;
}