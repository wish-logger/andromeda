import { Client } from '../client/Client';
import { User } from './User';
import { Channel } from './Channel';
import { PartialGuild } from '../types/Guild';
import { StageInstance } from './StageInstance';
import { GuildScheduledEvent } from './GuildScheduledEvent';

/**
 * Represents a partial application object for invite purposes.
 */
export interface PartialApplication {
    id: bigint;
    name: string;
    icon: string | null;
    description: string;
    splash?: string | null;
    coverImage?: string | null;
}

/**
 * The type of target for the invite.
 */
export enum InviteTargetType {
    STREAM = 1,
    EMBEDDED_APPLICATION = 2,
}

/**
 * Represents a Discord invite.
 */
export class Invite {
    /**
     * The invite code (unique ID).
     * @type {string}
     */
    public code: string;

    /**
     * The guild this invite is for, if any.
     * @type {PartialGuild | undefined}
     */
    public guild?: PartialGuild;

    /**
     * The channel this invite is for.
     * @type {Channel | null}
     */
    public channel: Channel | null;

    /**
     * The user who created the invite.
     * @type {User | undefined}
     */
    public inviter?: User;

    /**
     * The target user for this invite.
     * @type {User | undefined}
     */
    public targetUser?: User;

    /**
     * The type of target for the invite.
     * @type {InviteTargetType | undefined}
     */
    public targetType?: InviteTargetType;

    /**
     * The target application for this invite.
     * @type {PartialApplication | undefined}
     */
    public targetApplication?: PartialApplication;

    /**
     * Approximate count of online members, if `with_counts` is true.
     * @type {number | undefined}
     */
    public approximatePresenceCount?: number;

    /**
     * Approximate count of total members, if `with_counts` is true.
     * @type {number | undefined}
     */
    public approximateMemberCount?: number;

    /**
     * When the invite was created.
     * @type {Date | undefined}
     */
    public createdAt?: Date;

    /**
     * How long the invite is valid for (in seconds), if it is an expiring invite.
     * @type {number | undefined}
     */
    public maxUses?: number;

    /**
     * How many times the invite has been used.
     * @type {number | undefined}
     */
    public uses?: number;

    /**
     * How long the invite is valid for (in seconds).
     * @type {number | undefined}
     */
    public maxAge?: number;

    /**
     * Whether the invite is temporary (members kicked after leaving).
     * @type {boolean | undefined}
     */
    public temporary?: boolean;

    /**
     * Whether this invite is revoked.
     * @type {boolean | undefined}
     */
    public revoked?: boolean;

    /**
     * The stage instance in the guild, if applicable.
     * @type {StageInstance | undefined}
     */
    public stageInstance?: StageInstance;

    /**
     * The guild scheduled event, if applicable.
     * @type {GuildScheduledEvent | undefined}
     */
    public guildScheduledEvent?: GuildScheduledEvent;

    private client: Client;

    /**
     * @param {Client} client The client that instantiated this invite.
     * @param {any} data The raw data for the invite.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.code = data.code;
        this.guild = data.guild ? {
            id: BigInt(data.guild.id),
            name: data.guild.name,
            icon: data.guild.icon,
            splash: data.guild.splash,
            banner: data.guild.banner,
            approximateMemberCount: data.guild.approximate_member_count,
            approximatePresenceCount: data.guild.approximate_presence_count,
            vanityUrlCode: data.guild.vanity_url_code,
            description: data.guild.description,
            features: data.guild.features,
            verificationLevel: data.guild.verification_level,
            nsfwLevel: data.guild.nsfw_level,
            premiumTier: data.guild.premium_tier,
        } : undefined;
        this.channel = data.channel ? new Channel(this.client, data.channel) : null;
        this.inviter = data.inviter ? new User(this.client, data.inviter) : undefined;
        this.targetUser = data.target_user ? new User(this.client, data.target_user) : undefined;
        this.targetType = data.target_type;
        this.targetApplication = data.target_application ? {
            id: BigInt(data.target_application.id),
            name: data.target_application.name,
            icon: data.target_application.icon,
            description: data.target_application.description,
            splash: data.target_application.splash,
            coverImage: data.target_application.cover_image,
        } : undefined;
        this.approximatePresenceCount = data.approximate_presence_count;
        this.approximateMemberCount = data.approximate_member_count;
        this.createdAt = data.created_at ? new Date(data.created_at) : undefined;
        this.maxUses = data.max_uses;
        this.uses = data.uses;
        this.maxAge = data.max_age;
        this.temporary = data.temporary;
        this.revoked = data.revoked;
        this.stageInstance = data.stage_instance ? new StageInstance(this.client, data.stage_instance) : undefined;
        this.guildScheduledEvent = data.guild_scheduled_event ? new GuildScheduledEvent(this.client, data.guild_scheduled_event) : undefined;
    }

    /**
     * Returns the URL of the invite.
     * @returns {string}
     */
    public get url(): string {
        return `https://discord.gg/${this.code}`;
    }

    /**
     * Deletes the invite.
     * @param {string} [reason] The reason for deleting the invite.
     * @returns {Promise<void>}
     */
    public async delete(reason?: string): Promise<void> {
        const headers: any = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }
        await this.client.rest.request('DELETE', `/invites/${this.code}`, undefined, headers);
    }

    /**
     * Returns a serializable object representation of the invite.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            code: this.code,
            guild: this.guild ? {
                id: this.guild.id.toString(),
                name: this.guild.name,
                icon: this.guild.icon,
                splash: this.guild.splash,
                banner: this.guild.banner,
                approximate_member_count: this.guild.approximateMemberCount,
                approximate_presence_count: this.guild.approximatePresenceCount,
                vanity_url_code: this.guild.vanityUrlCode,
                description: this.guild.description,
                features: this.guild.features,
                verification_level: this.guild.verificationLevel,
                nsfw_level: this.guild.nsfwLevel,
                premium_tier: this.guild.premiumTier,
            } : undefined,
            channel: this.channel?.toJSON(),
            inviter: this.inviter?.toJSON(),
            target_user: this.targetUser?.toJSON(),
            target_type: this.targetType,
            target_application: this.targetApplication ? {
                id: this.targetApplication.id.toString(),
                name: this.targetApplication.name,
                icon: this.targetApplication.icon,
                description: this.targetApplication.description,
                splash: this.targetApplication.splash,
                cover_image: this.targetApplication.coverImage,
            } : undefined,
            approximate_presence_count: this.approximatePresenceCount,
            approximate_member_count: this.approximateMemberCount,
            created_at: this.createdAt?.toISOString(),
            max_uses: this.maxUses,
            uses: this.uses,
            max_age: this.maxAge,
            temporary: this.temporary,
            revoked: this.revoked,
            stage_instance: this.stageInstance?.toJSON(),
            guild_scheduled_event: this.guildScheduledEvent?.toJSON(),
        };
    }
}