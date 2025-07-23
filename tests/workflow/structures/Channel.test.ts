import { Client } from '../../../src/client/Client';
import { Channel, VideoQualityMode } from '../../../src/structures/Channel';
import { ChannelType } from '../../../src/types/Channel';

describe('Channel Voice Properties', () => {
    let client: Client;

    beforeEach(() => {
        client = new Client({});
    });

    it('should have voice-related properties as undefined for text channels', () => {
        const textChannelData = {
            id: '123456789012345678',
            type: ChannelType.GUILD_TEXT,
            guild_id: '987654321098765432',
            name: 'general',
        };
        const channel = new Channel(client, textChannelData);

        expect(channel.bitrate).toBeUndefined();
        expect(channel.userLimit).toBeUndefined();
        expect(channel.rtcRegion).toBeUndefined();
        expect(channel.videoQualityMode).toBeUndefined();

        const json: any = channel.toJSON();
        expect(json.bitrate).toBeUndefined();
        expect(json.user_limit).toBeUndefined();
        expect(json.rtc_region).toBeUndefined();
        expect(json.video_quality_mode).toBeUndefined();
    });

    it('should have voice-related properties for voice channels', () => {
        const voiceChannelData = {
            id: '123456789012345678',
            type: ChannelType.GUILD_VOICE,
            guild_id: '987654321098765432',
            name: 'voice-chat',
            bitrate: 64000,
            user_limit: 10,
            rtc_region: 'us-east',
            video_quality_mode: VideoQualityMode.AUTO,
        };
        const channel = new Channel(client, voiceChannelData);

        expect(channel.bitrate).toBe(voiceChannelData.bitrate);
        expect(channel.userLimit).toBe(voiceChannelData.user_limit);
        expect(channel.rtcRegion).toBe(voiceChannelData.rtc_region);
        expect(channel.videoQualityMode).toBe(voiceChannelData.video_quality_mode);

        const json: any = channel.toJSON();
        expect(json.bitrate).toBe(voiceChannelData.bitrate);
        expect(json.user_limit).toBe(voiceChannelData.user_limit);
        expect(json.rtc_region).toBe(voiceChannelData.rtc_region);
        expect(json.video_quality_mode).toBe(voiceChannelData.video_quality_mode);
    });

    it('should handle null rtc_region correctly', () => {
        const voiceChannelDataWithNullRegion = {
            id: '123456789012345678',
            type: ChannelType.GUILD_VOICE,
            guild_id: '987654321098765432',
            name: 'voice-chat-null-region',
            bitrate: 64000,
            user_limit: 10,
            rtc_region: null,
            video_quality_mode: VideoQualityMode.AUTO,
        };
        const channel = new Channel(client, voiceChannelDataWithNullRegion);

        expect(channel.rtcRegion).toBeNull();

        const json: any = channel.toJSON();
        expect(json.rtc_region).toBeNull();
    });
});