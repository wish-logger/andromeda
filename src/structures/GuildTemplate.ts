import { Client } from '../client/Client';
import { User } from './User';
import { PartialGuild } from '../types/Guild';

/**
 * Represents a guild template within Discord.
 */
export class GuildTemplate {
    /**
     * The template code (unique ID).
     * @type {string}
     */
    public code: string;

    /**
     * The name of the template.
     * @type {string}
     */
    public name: string;

    /**
     * The description for the template.
     * @type {string | null}
     */
    public description: string | null;

    /**
     * Number of times this template has been used.
     * @type {number}
     */
    public usageCount: number;

    /**
     * The ID of the user who created the template.
     * @type {bigint}
     */
    public creatorId: bigint;

    /**
     * The user object of the creator.
     * @type {User}
     */
    public creator: User;

    /**
     * When the template was created.
     * @type {Date}
     */
    public createdAt: Date;

    /**
     * When the template was last updated.
     * @type {Date}
     */
    public updatedAt: Date;

    /**
     * The ID of the guild this template is based on.
     * @type {bigint}
     */
    public sourceGuildId: bigint;

    /**
     * The guild snapshot this template contains.
     * @type {PartialGuild}
     */
    public serializedSourceGuild: PartialGuild;

    /**
     * Whether the template has unsynced changes.
     * @type {boolean | undefined}
     */
    public isDirty?: boolean;

    private client: Client;

    /**
     * @param {Client} client The client that instantiated this guild template.
     * @param {any} data The raw data for the guild template.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.code = data.code;
        this.name = data.name;
        this.description = data.description;
        this.usageCount = data.usage_count;
        this.creatorId = BigInt(data.creator_id);
        this.creator = new User(this.client, data.creator);
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
        this.sourceGuildId = BigInt(data.source_guild_id);
        this.serializedSourceGuild = {
            id: BigInt(data.serialized_source_guild.id),
            name: data.serialized_source_guild.name,
            icon: data.serialized_source_guild.icon,
            splash: data.serialized_source_guild.splash,
            banner: data.serialized_source_guild.banner,
            approximateMemberCount: data.serialized_source_guild.approximate_member_count,
            approximatePresenceCount: data.serialized_source_guild.approximate_presence_count,
            vanityUrlCode: data.serialized_source_guild.vanity_url_code,
            description: data.serialized_source_guild.description,
            features: data.serialized_source_guild.features,
            verificationLevel: data.serialized_source_guild.verification_level,
            nsfwLevel: data.serialized_source_guild.nsfw_level,
            premiumTier: data.serialized_source_guild.premium_tier,
        };
        this.isDirty = data.is_dirty;
    }

    /**
     * Returns the URL of the template's icon, if available.
     * This uses the source guild's icon.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp', 'gif').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public iconURL(format: string = 'png', size: number = 128): string | null {
        if (!this.serializedSourceGuild.icon) return null;
        return `https://cdn.discordapp.com/icons/${this.serializedSourceGuild.id.toString()}/${this.serializedSourceGuild.icon}.${format}?size=${size}`;
    }

    /**
     * Returns a serializable object representation of the guild template.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            code: this.code,
            name: this.name,
            description: this.description,
            usage_count: this.usageCount,
            creator_id: this.creatorId.toString(),
            creator: this.creator.toJSON(),
            created_at: this.createdAt.toISOString(),
            updated_at: this.updatedAt.toISOString(),
            source_guild_id: this.sourceGuildId.toString(),
            serialized_source_guild: {
                id: this.serializedSourceGuild.id.toString(),
                name: this.serializedSourceGuild.name,
                icon: this.serializedSourceGuild.icon,
                splash: this.serializedSourceGuild.splash,
                banner: this.serializedSourceGuild.banner,
                approximate_member_count: this.serializedSourceGuild.approximateMemberCount,
                approximate_presence_count: this.serializedSourceGuild.approximatePresenceCount,
                vanity_url_code: this.serializedSourceGuild.vanityUrlCode,
                description: this.serializedSourceGuild.description,
                features: this.serializedSourceGuild.features,
                verification_level: this.serializedSourceGuild.verificationLevel,
                nsfw_level: this.serializedSourceGuild.nsfwLevel,
                premium_tier: this.serializedSourceGuild.premiumTier,
            },
            is_dirty: this.isDirty,
        };
    }

    /**
     * Returns a formatted string representation of the guild template.
     * @returns {string}
     */
    public inspect(): string {
        return `GuildTemplate { code: '${this.code}', name: '${this.name}' }`;
    }
}