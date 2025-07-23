import { Client } from '../../../src/client/Client';
import { Webhook } from '../../../src/structures/Webhook';
import { User } from '../../../src/structures/User';
import { WebhookType } from '../../../src/types/Webhook';

describe('Webhook', () => {
    let client: Client;
    let webhookData: any;

    beforeEach(() => {
        client = new Client({});
        webhookData = {
            id: '123456789012345678',
            type: WebhookType.INCOMING,
            guild_id: '987654321098765432',
            channel_id: '112233445566778899',
            user: {
                id: '223344556677889900',
                username: 'webhookuser',
                discriminator: '0000',
            },
            name: 'Test Webhook',
            avatar: 'abcdef1234567890abcdef1234567890',
            token: 'some_secret_token',
            application_id: '334455667788990011',
            source_guild: {
                id: '111222333444555666',
                name: 'Source Guild',
                icon: null,
                splash: null,
                banner: null,
                approximate_member_count: 100,
                approximate_presence_count: 50,
                vanity_url_code: null,
                description: null,
                features: [],
                verification_level: 0,
                nsfw_level: 0,
                premium_tier: 0,
            },
            source_channel: {
                id: '222333444555666777',
                name: 'source-channel',
            },
            url: 'https://discord.com/api/webhooks/1234/token',
        };
    });

    it('should correctly instantiate a Webhook object', () => {
        const webhook = new Webhook(client, webhookData);

        expect(webhook.id).toBe(BigInt(webhookData.id));
        expect(webhook.type).toBe(webhookData.type);
        expect(webhook.guildId).toBe(BigInt(webhookData.guild_id));
        expect(webhook.channelId).toBe(BigInt(webhookData.channel_id));
        expect(webhook.user).toBeInstanceOf(User);
        expect(webhook.user?.id).toBe(BigInt(webhookData.user.id));
        expect(webhook.name).toBe(webhookData.name);
        expect(webhook.avatar).toBe(webhookData.avatar);
        expect(webhook.token).toBe(webhookData.token);
        expect(webhook.applicationId).toBe(BigInt(webhookData.application_id));
        expect(webhook.sourceGuild).toBeDefined();
        expect(webhook.sourceGuild?.id).toBe(BigInt(webhookData.source_guild.id));
        expect(webhook.sourceChannel).toBeDefined();
        expect(webhook.sourceChannel?.id).toBe(BigInt(webhookData.source_channel.id));
        expect(webhook.url).toBe(webhookData.url);
    });

    it('should return correct avatar URL', () => {
        const webhook = new Webhook(client, webhookData);
        expect(webhook.avatarURL()).toBe(`https://cdn.discordapp.com/avatars/${webhookData.id}/${webhookData.avatar}.png?size=128`);
        expect(webhook.avatarURL('webp', 256)).toBe(`https://cdn.discordapp.com/avatars/${webhookData.id}/${webhookData.avatar}.webp?size=256`);
    });

    it('should return correct JSON representation', () => {
        const webhook = new Webhook(client, webhookData);
        const json: any = webhook.toJSON();

        expect(json.id).toBe(webhookData.id);
        expect(json.type).toBe(webhookData.type);
        expect(json.guild_id).toBe(webhookData.guild_id);
        expect(json.channel_id).toBe(webhookData.channel_id);
        expect(json.user).toBeDefined();
        expect(json.user.id).toBe(webhookData.user.id);
        expect(json.name).toBe(webhookData.name);
        expect(json.avatar).toBe(webhookData.avatar);
        expect(json.token).toBe(webhookData.token);
        expect(json.application_id).toBe(webhookData.application_id);
        expect(json.source_guild).toBeDefined();
        expect(json.source_guild.id).toBe(webhookData.source_guild.id);
        expect(json.source_channel).toBeDefined();
        expect(json.source_channel.id).toBe(webhookData.source_channel.id);
        expect(json.url).toBe(webhookData.url);
    });

    it('should handle null/undefined properties correctly', () => {
        const minimalWebhookData = {
            id: BigInt('333444555666777888'),
            type: WebhookType.APPLICATION,
            channel_id: null,
            name: null,
            avatar: null,
            url: 'https://example.com/webhook',
        };
        const webhook = new Webhook(client, minimalWebhookData);

        expect(webhook.id).toBe(BigInt(minimalWebhookData.id));
        expect(webhook.type).toBe(minimalWebhookData.type);
        expect(webhook.guildId).toBeNull();
        expect(webhook.channelId).toBeNull();
        expect(webhook.user).toBeUndefined();
        expect(webhook.name).toBeNull();
        expect(webhook.avatar).toBeNull();
        expect(webhook.token).toBeUndefined();
        expect(webhook.applicationId).toBeUndefined();
        expect(webhook.sourceGuild).toBeUndefined();
        expect(webhook.sourceChannel).toBeUndefined();
        expect(webhook.url).toBe(minimalWebhookData.url);

        const json: any = webhook.toJSON();
        expect(json.guild_id).toBeNull();
        expect(json.channel_id).toBeNull();
        expect(json.user).toBeUndefined();
        expect(json.name).toBeNull();
        expect(json.avatar).toBeNull();
        expect(json.token).toBeUndefined();
        expect(json.application_id).toBeUndefined();
        expect(json.source_guild).toBeUndefined();
        expect(json.source_channel).toBeUndefined();
    });
});