import { Client } from '../client/Client';
import { Member } from './Member';
import { VoiceStateData } from '../types/Voice';

export class VoiceState {
    public guildId?: bigint;
    public channelId: bigint | null;
    public userId: bigint;
    public member?: Member;
    public sessionId: string;
    public deaf: boolean;
    public mute: boolean;
    public selfDeaf: boolean;
    public selfMute: boolean;
    public selfStream?: boolean;
    public selfVideo: boolean;
    public suppress: boolean;
    public requestToSpeakTimestamp?: Date | null;

    private client: Client;

    constructor(client: Client, data: VoiceStateData) {
        this.client = client;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : undefined;
        this.channelId = data.channel_id ? BigInt(data.channel_id) : null;
        this.userId = BigInt(data.user_id);
        this.sessionId = data.session_id;
        this.deaf = data.deaf;
        this.mute = data.mute;
        this.selfDeaf = data.self_deaf;
        this.selfMute = data.self_mute;
        this.selfStream = data.self_stream;
        this.selfVideo = data.self_video;
        this.suppress = data.suppress;
        this.requestToSpeakTimestamp = data.request_to_speak_timestamp ? new Date(data.request_to_speak_timestamp) : null;
        
        if (data.member && this.guildId) {
            this.member = new Member(client, data.member, this.guildId.toString());
        }
    }

    public toJSON() {
        return {
            guild_id: this.guildId?.toString(),
            channel_id: this.channelId?.toString() || null,
            user_id: this.userId.toString(),
            member: this.member?.toJSON(),
            session_id: this.sessionId,
            deaf: this.deaf,
            mute: this.mute,
            self_deaf: this.selfDeaf,
            self_mute: this.selfMute,
            self_stream: this.selfStream,
            self_video: this.selfVideo,
            suppress: this.suppress,
            request_to_speak_timestamp: this.requestToSpeakTimestamp?.toISOString() || null,
        };
    }
}