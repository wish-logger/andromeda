import { Client } from '../client/Client';
import { User } from './User';
import { Role } from './Role';
import { Emoji } from './Emoji';
import { Sticker } from './Sticker';
import { Channel } from './Channel';
import { GuildScheduledEvent } from './GuildScheduledEvent';
import { Member } from './Member';
import { RoleCreateOptions } from '../types/Role';
import { StageInstance } from './StageInstance';
import { VoiceState } from './VoiceState';
import { Presence } from './Presence';

export enum DefaultMessageNotificationLevel {
    ALL_MESSAGES = 0,
    ONLY_MENTIONS = 1,
}

export enum ExplicitContentFilterLevel {
    DISABLED = 0,
    MEMBERS_WITHOUT_ROLES = 1,
    ALL_MEMBERS = 2,
}

export enum MFALevel {
    NONE = 0,
    ELEVATED = 1,
}

export enum VerificationLevel {
    NONE = 0,
    LOW = 1,
    MEDIUM = 2,
    HIGH = 3,
    VERY_HIGH = 4,
}

export enum GuildNSFWLevel {
    DEFAULT = 0,
    EXPLICIT = 1,
    SAFE = 2,
    AGE_RESTRICTED = 3,
}

export enum PremiumTier {
    NONE = 0,
    TIER_1 = 1,
    TIER_2 = 2,
    TIER_3 = 3,
}

export enum SystemChannelFlags {
    SUPPRESS_JOIN_NOTIFICATIONS = 1 << 0,
    SUPPRESS_PREMIUM_SUBSCRIPTIONS = 1 << 1,
    SUPPRESS_GUILD_REMINDER_NOTIFICATIONS = 1 << 2,
    SUPPRESS_JOIN_NOTIFICATION_REPLIES = 1 << 3,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATIONS = 1 << 4,
    SUPPRESS_ROLE_SUBSCRIPTION_PURCHASE_NOTIFICATION_REPLIES = 1 << 5,
}

/**
 * The type of a guild hub (for EDU guilds).
 */
export enum GuildHubType {
    DEFAULT = 0,
    HIGH_SCHOOL = 1,
    COLLEGE = 2,
}

export interface GuildPreview {
    id: bigint;
    name: string;
    icon: string | null;
    splash: string | null;
    discoverySplash: string | null;
    emojis: Emoji[];
    features: string[];
    approximateMemberCount: number;
    approximatePresenceCount: number;
    description?: string | null;
    stickers: Sticker[];
}

export interface GuildWidgetSettings {
    enabled: boolean;
    channelId: bigint | null;
}

export interface GuildWidget {
    id: bigint;
    name: string;
    instantInvite?: string | null;
    channels: PartialChannel[];
    members: PartialUser[];
    presenceCount: number;
}

export interface PartialChannel {
    id: bigint;
    name: string;
}

export interface PartialUser {
    id: bigint;
    username: string;
    discriminator: string;
    avatar: string | null;
    bot?: boolean;
    system?: boolean;
    mfaEnabled?: boolean;
    banner?: string | null;
    accentColor?: number;
    locale?: string;
    verified?: boolean;
    email?: string | null;
    flags?: number;
    premiumType?: number;
    publicFlags?: number;
    presence?: any; // TODO: Presence object
}

export enum IntegrationExpireBehavior {
    REMOVE_ROLE = 0,
    KICK = 1,
}

export interface IntegrationAccount {
    id: string;
    name: string;
}

export interface IntegrationApplication {
    id: bigint;
    name: string;
    icon: string | null;
    description: string;
    bot?: User;
}

export interface Ban {
    reason: string | null;
    user: User;
}

export interface WelcomeScreenChannel {
    channelId: bigint;
    description: string;
    emojiId?: bigint | null;
    emojiName?: string | null;
}

export interface WelcomeScreen {
    description?: string | null;
    welcomeChannels: WelcomeScreenChannel[];
}

export interface IncidentsData {
    invitesDisabledUntil?: Date;
    dmsDisabledUntil?: Date;
    dmSpamDetectedAt?: Date;
    raidDetectedAt?: Date;
}

export class Guild {
    public id: bigint;
    public name: string;
    public icon: string | null;
    public iconHash?: string | null;
    public splash: string | null;
    public discoverySplash: string | null;
    public owner?: boolean;
    public ownerId: bigint;
    public permissions?: string;
    public afkChannelId: bigint | null;
    public afkTimeout: number;
    public widgetEnabled?: boolean;
    public widgetChannelId?: bigint | null;
    public verificationLevel: VerificationLevel;
    public defaultMessageNotifications: DefaultMessageNotificationLevel;
    public explicitContentFilter: ExplicitContentFilterLevel;
    public roles: Map<bigint, Role>;
    public emojis: Emoji[];
    public features: string[];
    public mfaLevel: MFALevel;
    public applicationId: bigint | null;
    public systemChannelId: bigint | null;
    public systemChannelFlags: SystemChannelFlags;
    public rulesChannelId: bigint | null;
    public maxPresences?: number | null;
    public maxMembers?: number;
    public vanityUrlCode: string | null;
    public description?: string | null;
    public banner: string | null;
    public premiumTier: PremiumTier;
    public premiumSubscriptionCount?: number;
    public preferredLocale: string;
    public publicUpdatesChannelId: bigint | null;
    public maxVideoChannelUsers?: number;
    public maxStageVideoChannelUsers?: number;
    public approximateMemberCount?: number;
    public approximatePresenceCount?: number;
    public welcomeScreen?: WelcomeScreen;
    public nsfwLevel: GuildNSFWLevel;
    public stickers?: Sticker[];
    public premiumProgressBarEnabled: boolean;
    public safetyAlertsChannelId: bigint | null;
    public incidentsData?: IncidentsData;
    public hubType?: GuildHubType;
    public channels?: Channel[];
    public threads?: Channel[];
    public voiceStates?: VoiceState[];
    public presences?: Presence[];
    public stageInstances?: StageInstance[];
    public guildScheduledEvents?: GuildScheduledEvent[];
    public members?: Member[];
    public memberCount?: number;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.name = data.name;
        this.icon = data.icon;
        this.iconHash = data.icon_hash;
        this.splash = data.splash;
        this.discoverySplash = data.discovery_splash;
        this.owner = data.owner;
        this.ownerId = BigInt(data.owner_id);
        this.permissions = data.permissions;
        this.afkChannelId = data.afk_channel_id ? BigInt(data.afk_channel_id) : null;
        this.afkTimeout = data.afk_timeout;
        this.widgetEnabled = data.widget_enabled;
        this.widgetChannelId = data.widget_channel_id ? BigInt(data.widget_channel_id) : null;
        this.verificationLevel = data.verification_level;
        this.defaultMessageNotifications = data.default_message_notifications;
        this.explicitContentFilter = data.explicit_content_filter;
        this.roles = new Map<bigint, Role>();
        if (data.roles) {
            for (const roleData of data.roles) {
                const role = new Role(this.client, roleData, this.id.toString());
                this.roles.set(role.id, role);
            }
        }
        this.emojis = data.emojis ? data.emojis.map((e: any) => new Emoji(this.client, e)) : [];
        this.features = data.features || [];
        this.mfaLevel = data.mfa_level;
        this.applicationId = data.application_id ? BigInt(data.application_id) : null;
        this.systemChannelId = data.system_channel_id ? BigInt(data.system_channel_id) : null;
        this.systemChannelFlags = data.system_channel_flags;
        this.rulesChannelId = data.rules_channel_id ? BigInt(data.rules_channel_id) : null;
        this.maxPresences = data.max_presences;
        this.maxMembers = data.max_members;
        this.vanityUrlCode = data.vanity_url_code;
        this.description = data.description;
        this.banner = data.banner;
        this.premiumTier = data.premium_tier;
        this.premiumSubscriptionCount = data.premium_subscription_count;
        this.preferredLocale = data.preferred_locale;
        this.publicUpdatesChannelId = data.public_updates_channel_id ? BigInt(data.public_updates_channel_id) : null;
        this.maxVideoChannelUsers = data.max_video_channel_users;
        this.maxStageVideoChannelUsers = data.max_stage_video_channel_users;
        this.approximateMemberCount = data.approximate_member_count;
        this.approximatePresenceCount = data.approximate_presence_count;
        this.welcomeScreen = data.welcome_screen ? {
            description: data.welcome_screen.description,
            welcomeChannels: data.welcome_screen.welcome_channels.map((wc: any) => ({
                channelId: BigInt(wc.channel_id),
                description: wc.description,
                emojiId: wc.emoji_id ? BigInt(wc.emoji_id) : null,
                emojiName: wc.emoji_name,
            })),
        } : undefined;
        this.nsfwLevel = data.nsfw_level;
        this.stickers = data.stickers ? data.stickers.map((s: any) => new Sticker(this.client, s)) : undefined;
        this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
        this.safetyAlertsChannelId = data.safety_alerts_channel_id ? BigInt(data.safety_alerts_channel_id) : null;
        this.incidentsData = data.incidents_data ? {
            invitesDisabledUntil: data.incidents_data.invites_disabled_until ? new Date(data.incidents_data.invites_disabled_until) : undefined,
            dmsDisabledUntil: data.incidents_data.dms_disabled_until ? new Date(data.incidents_data.dms_disabled_until) : undefined,
            dmSpamDetectedAt: data.incidents_data.dm_spam_detected_at ? new Date(data.incidents_data.dm_spam_detected_at) : undefined,
            raidDetectedAt: data.incidents_data.raid_detected_at ? new Date(data.incidents_data.raid_detected_at) : undefined,
        } : undefined;
        this.hubType = data.hub_type ?? undefined;
        this.channels = data.channels ? data.channels.map((c: any) => new Channel(this.client, c)) : undefined;
        this.threads = data.threads ? data.threads.map((t: any) => new Channel(this.client, t)) : undefined;
        this.voiceStates = data.voice_states ? data.voice_states.map((vs: any) => new VoiceState(this.client, vs)) : undefined;
        this.presences = data.presences ? data.presences.map((p: any) => new Presence(this.client, p)) : undefined;
        this.stageInstances = data.stage_instances ? data.stage_instances.map((si: any) => new StageInstance(this.client, si)) : undefined;
        this.guildScheduledEvents = data.guild_scheduled_events ? data.guild_scheduled_events.map((e: any) => new GuildScheduledEvent(this.client, e)) : undefined;
        this.members = data.members ? data.members.map((m: any) => new Member(this.client, m, this.id.toString())) : undefined;
        this.memberCount = data.approximate_member_count ?? undefined; // Also use memberCount istead of approximateMemberCount :skull:
    }

    /**
     * Returns the URL of the guild's icon.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp', 'gif').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public iconURL(format: string = 'png', size: number = 128): string | null {
        if (!this.icon) return null;
        return `https://cdn.discordapp.com/icons/${this.id.toString()}/${this.icon}.${format}?size=${size}`;
    }

    /**
     * Returns the URL of the guild's splash image.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public splashURL(format: string = 'png', size: number = 128): string | null {
        if (!this.splash) return null;
        return `https://cdn.discordapp.com/splashes/${this.id.toString()}/${this.splash}.${format}?size=${size}`;
    }

    /**
     * Returns the URL of the guild's discovery splash image.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public discoverySplashURL(format: string = 'png', size: number = 128): string | null {
        if (!this.discoverySplash) return null;
        return `https://cdn.discordapp.com/discovery-splashes/${this.id.toString()}/${this.discoverySplash}.${format}?size=${size}`;
    }

    /**
     * Returns the URL of the guild's banner image.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp', 'gif').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public bannerURL(format: string = 'png', size: number = 128): string | null {
        if (!this.banner) return null;
        return `https://cdn.discordapp.com/banners/${this.id.toString()}/${this.banner}.${format}?size=${size}`;
    }

    /**
     * Returns the owner of the guild.
     * @returns {Promise<User | null>}
     */
    public async fetchOwner(): Promise<User | null> {
        return this.client.fetchUser(this.ownerId);
    }

    /**
     * Creates a new role in the guild.
     * @param {RoleCreateOptions} options The options for creating the role.
     * @returns {Promise<Role>} The created role.
     */
    public async createRole(options: RoleCreateOptions): Promise<Role> {
        const payload: any = {};
        if (options.name !== undefined) payload.name = options.name;
        if (options.permissions !== undefined) payload.permissions = options.permissions.toString();
        if (options.color !== undefined) payload.color = options.color;
        if (options.hoist !== undefined) payload.hoist = options.hoist;
        if (options.icon !== undefined) payload.icon = options.icon;
        if (options.unicodeEmoji !== undefined) payload.unicode_emoji = options.unicodeEmoji;
        if (options.mentionable !== undefined) payload.mentionable = options.mentionable;

        const headers: any = { 'Content-Type': 'application/json' };
        if (options.reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(options.reason);
        }

        const response = await this.client.rest.request('POST',
            `/guilds/${this.id.toString()}/roles`,
            payload,
            headers
        );

        const newRole = new Role(this.client, response, this.id.toString());
        this.roles.set(newRole.id, newRole);
        return newRole;
    }

    /**
     * Returns a serializable object representation of the guild.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            name: this.name,
            icon: this.icon,
            iconHash: this.iconHash,
            splash: this.splash,
            discoverySplash: this.discoverySplash,
            owner: this.owner,
            ownerId: this.ownerId.toString(),
            permissions: this.permissions,
            afkChannelId: this.afkChannelId?.toString() || null,
            afkTimeout: this.afkTimeout,
            widgetEnabled: this.widgetEnabled,
            widgetChannelId: this.widgetChannelId?.toString() || null,
            verificationLevel: this.verificationLevel,
            defaultMessageNotifications: this.defaultMessageNotifications,
            explicitContentFilter: this.explicitContentFilter,
            roles: Array.from(this.roles.values()).map(r => r.toJSON()),
            emojis: this.emojis.map(e => e.toJSON()),
            features: this.features,
            mfaLevel: this.mfaLevel,
            applicationId: this.applicationId?.toString() || null,
            systemChannelId: this.systemChannelId?.toString() || null,
            systemChannelFlags: this.systemChannelFlags,
            rulesChannelId: this.rulesChannelId?.toString() || null,
            maxPresences: this.maxPresences,
            maxMembers: this.maxMembers,
            vanityUrlCode: this.vanityUrlCode,
            description: this.description,
            banner: this.banner,
            premiumTier: this.premiumTier,
            premiumSubscriptionCount: this.premiumSubscriptionCount,
            preferredLocale: this.preferredLocale,
            publicUpdatesChannelId: this.publicUpdatesChannelId?.toString() || null,
            maxVideoChannelUsers: this.maxVideoChannelUsers,
            maxStageVideoChannelUsers: this.maxStageVideoChannelUsers,
            approximateMemberCount: this.approximateMemberCount,
            approximatePresenceCount: this.approximatePresenceCount,
            welcomeScreen: this.welcomeScreen ? {
                description: this.welcomeScreen.description,
                welcome_channels: this.welcomeScreen.welcomeChannels.map(wc => ({
                    channel_id: wc.channelId.toString(),
                    description: wc.description,
                    emoji_id: wc.emojiId?.toString() || null,
                    emoji_name: wc.emojiName,
                })),
            } : undefined,
            nsfwLevel: this.nsfwLevel,
            stickers: this.stickers?.map(s => s.toJSON()),
            premiumProgressBarEnabled: this.premiumProgressBarEnabled,
            safetyAlertsChannelId: this.safetyAlertsChannelId?.toString() || null,
            incidentsData: this.incidentsData,
            hub_type: this.hubType,
            channels: this.channels?.map(c => c.toJSON()),
            threads: this.threads?.map(t => t.toJSON()),
            voice_states: this.voiceStates?.map(vs => vs.toJSON()),
            presences: this.presences?.map(p => p.toJSON()),
            stage_instances: this.stageInstances?.map(si => si.toJSON()),
            guild_scheduled_events: this.guildScheduledEvents?.map(e => e.toJSON()),
            members: this.members?.map(m => m.toJSON()),
            member_count: this.memberCount,
        };
    }

    /**
     * Returns a formatted string representation of the guild.
     * @returns {string}
     */
    public inspect(): string {
        return `Guild { id: '${this.id}', name: '${this.name}', memberCount: ${this.approximateMemberCount ?? 'N/A'} }`;
    }
}