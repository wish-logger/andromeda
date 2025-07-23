import { Client } from '../../../src/client/Client';
import { StageInstance, StageInstancePrivacyLevel } from '../../../src/structures/StageInstance';

describe('StageInstance', () => {
    let client: Client;
    let stageInstanceData: any;

    beforeEach(() => {
        client = new Client({});
        stageInstanceData = {
            id: '123456789012345678',
            guild_id: '987654321098765432',
            channel_id: '112233445566778899',
            topic: 'Test Stage Topic',
            privacy_level: StageInstancePrivacyLevel.GUILD_ONLY,
            discoverable_disabled: false,
            guild_scheduled_event_id: '223344556677889900',
        };
    });

    it('should correctly instantiate a StageInstance object', () => {
        const stageInstance = new StageInstance(client, stageInstanceData);

        expect(stageInstance.id).toBe(BigInt(stageInstanceData.id));
        expect(stageInstance.guildId).toBe(BigInt(stageInstanceData.guild_id));
        expect(stageInstance.channelId).toBe(BigInt(stageInstanceData.channel_id));
        expect(stageInstance.topic).toBe(stageInstanceData.topic);
        expect(stageInstance.privacyLevel).toBe(stageInstanceData.privacy_level);
        expect(stageInstance.discoverableDisabled).toBe(stageInstanceData.discoverable_disabled);
        expect(stageInstance.guildScheduledEventId).toBe(BigInt(stageInstanceData.guild_scheduled_event_id));
    });

    it('should return correct JSON representation', () => {
        const stageInstance = new StageInstance(client, stageInstanceData);
        const json: any = stageInstance.toJSON();

        expect(json.id).toBe(stageInstanceData.id);
        expect(json.guild_id).toBe(stageInstanceData.guild_id);
        expect(json.channel_id).toBe(stageInstanceData.channel_id);
        expect(json.topic).toBe(stageInstanceData.topic);
        expect(json.privacy_level).toBe(stageInstanceData.privacy_level);
        expect(json.discoverable_disabled).toBe(stageInstanceData.discoverable_disabled);
        expect(json.guild_scheduled_event_id).toBe(stageInstanceData.guild_scheduled_event_id);
    });

    it('should handle null/undefined properties correctly', () => {
        const minimalStageInstanceData = {
            id: '111222333444555666',
            guild_id: '222333444555666777',
            channel_id: '333444555666777888',
            topic: 'Minimal Topic',
            privacy_level: StageInstancePrivacyLevel.PUBLIC,
            discoverable_disabled: true,
        };
        const stageInstance = new StageInstance(client, minimalStageInstanceData);

        expect(stageInstance.id).toBe(BigInt(minimalStageInstanceData.id));
        expect(stageInstance.guildId).toBe(BigInt(minimalStageInstanceData.guild_id));
        expect(stageInstance.channelId).toBe(BigInt(minimalStageInstanceData.channel_id));
        expect(stageInstance.topic).toBe(minimalStageInstanceData.topic);
        expect(stageInstance.privacyLevel).toBe(minimalStageInstanceData.privacy_level);
        expect(stageInstance.discoverableDisabled).toBe(minimalStageInstanceData.discoverable_disabled);
        expect(stageInstance.guildScheduledEventId).toBeNull();

        const json: any = stageInstance.toJSON();
        expect(json.guild_scheduled_event_id).toBeNull();
    });
});