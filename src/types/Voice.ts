import { Member } from "../structures/Member";

export interface VoiceStateData {
    guild_id?: bigint;
    channel_id: bigint | null;
    user_id: bigint;
    member?: Member;
    session_id: string;
    deaf: boolean;
    mute: boolean;
    self_deaf: boolean;
    self_mute: boolean;
    self_stream?: boolean;
    self_video: boolean;
    suppress: boolean;
    request_to_speak_timestamp?: string | null;
}

export interface VoiceRegionData {
    id: string;
    name: string;
    optimal: boolean;
    deprecated: boolean;
    custom: boolean;
}