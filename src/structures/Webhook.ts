import { Client } from '../client/Client';
import { User } from './User';
import { PartialChannel } from './Guild';
import { PartialGuild } from '../types/Guild';
import { WebhookType, WebhookData } from '../types/Webhook';

export class Webhook {
    public id: bigint;
    public type: WebhookType;
    public guildId: bigint | null;
    public channelId: bigint | null;
    public user?: User;
    public name: string | null;
    public avatar: string | null;
    public token?: string;
    public applicationId?: bigint;
    public sourceGuild?: PartialGuild;
    public sourceChannel?: PartialChannel;
    public url?: string;

    private client: Client;

    constructor(client: Client, data: WebhookData) {
        this.client = client;
        this.id = BigInt(data.id);
        this.type = data.type;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : null;
        this.channelId = data.channel_id ? BigInt(data.channel_id) : null;
        this.user = data.user ? new User(this.client, data.user) : undefined;
        this.name = data.name ?? null;
        this.avatar = data.avatar ?? null;
        this.token = data.token;
        this.applicationId = data.application_id ? BigInt(data.application_id) : undefined;
        this.sourceGuild = data.source_guild ? {
            id: BigInt(data.source_guild.id),
            name: data.source_guild.name,
            icon: data.source_guild.icon,
            splash: data.source_guild.splash,
            banner: data.source_guild.banner,
            approximateMemberCount: data.source_guild.approximateMemberCount,
            approximatePresenceCount: data.source_guild.approximatePresenceCount,
            vanityUrlCode: data.source_guild.vanityUrlCode,
            description: data.source_guild.description,
            features: data.source_guild.features,
            verificationLevel: data.source_guild.verificationLevel,
            nsfwLevel: data.source_guild.nsfwLevel,
            premiumTier: data.source_guild.premiumTier,
        } : undefined;
        this.sourceChannel = data.source_channel ? {
            id: BigInt(data.source_channel.id),
            name: data.source_channel.name,
        } : undefined;
        this.url = data.url;
    }

    /**
     * Returns the URL of the webhook's avatar.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public avatarURL(format: string = 'png', size: number = 128): string | null {
        if (!this.avatar) return null;
        return `https://cdn.discordapp.com/avatars/${this.id.toString()}/${this.avatar}.${format}?size=${size}`;
    }

    public toJSON() {
        return {
            id: this.id.toString(),
            type: this.type,
            guild_id: this.guildId?.toString() || null,
            channel_id: this.channelId?.toString() || null,
            user: this.user?.toJSON(),
            name: this.name,
            avatar: this.avatar,
            token: this.token,
            application_id: this.applicationId?.toString(),
            source_guild: this.sourceGuild ? {
                id: this.sourceGuild.id.toString(),
                name: this.sourceGuild.name,
                icon: this.sourceGuild.icon,
                splash: this.sourceGuild.splash,
                banner: this.sourceGuild.banner,
                approximate_member_count: this.sourceGuild.approximateMemberCount,
                approximate_presence_count: this.sourceGuild.approximatePresenceCount,
                vanity_url_code: this.sourceGuild.vanityUrlCode,
                description: this.sourceGuild.description,
                features: this.sourceGuild.features,
                verification_level: this.sourceGuild.verificationLevel,
                nsfw_level: this.sourceGuild.nsfwLevel,
                premium_tier: this.sourceGuild.premiumTier,
            } : undefined,
            source_channel: this.sourceChannel ? {
                id: this.sourceChannel.id.toString(),
                name: this.sourceChannel.name,
            } : undefined,
            url: this.url,
        };
    }
}