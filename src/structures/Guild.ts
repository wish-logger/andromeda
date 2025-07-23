import { Client } from '../client/Client';
import { Channel } from './Channel';
import { User } from './User';
import { Member } from './Member';
import { Role } from './Role';
import { Emoji } from './Emoji';
import { Sticker } from './Sticker';

export class Guild {
    public id: bigint;
    public name: string;
    public icon: string | null;
    public splash: string | null;
    public discoverySplash?: string | null;
    public homeHeader?: string | null;
    public ownerId: bigint;
    public afkChannelId: bigint | null;
    public afkTimeout: number;
    public verificationLevel: number;
    public defaultMessageNotifications: number;
    public explicitContentFilter: number;
    public roles: Map<bigint, Role>;
    public emojis: Map<bigint, Emoji>;
    public features: string[];
    public mfaLevel: number;
    public applicationId: bigint | null;
    public systemChannelId: bigint | null;
    public systemChannelFlags: number;
    public widgetEnabled?: boolean;
    public widgetChannelId?: bigint | null;
    public maxPresences?: number | null;
    public maxMembers?: number;
    public maxStageVideoChannelUsers?: number;
    public maxVideoChannelUsers?: number;
    public vanityUrlCode: string | null;
    public description: string | null;
    public banner: string | null;
    public nsfw: boolean;
    public nsfwLevel: number;
    public premiumTier: number;
    public premiumSubscriptionCount?: number;
    public preferredLocale: string;
    public rulesChannelId?: bigint | null;
    public safetyAlertsChannelId?: bigint | null;
    public publicUpdatesChannelId: bigint | null;
    public hubType?: number | null;
    public premiumProgressBarEnabled: boolean;
    public latestOnboardingQuestionId?: bigint | null;
    public memberCount?: number;
    public stickers: Sticker[];
    public incidentsData: any | null;
    public inventorySettings: any | null;
    public embedEnabled?: boolean;
    public embedChannelId?: bigint | null;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.name = data.name;
        this.icon = data.icon;
        this.splash = data.splash;
        this.discoverySplash = data.discovery_splash;
        this.homeHeader = data.home_header;
        this.ownerId = BigInt(data.owner_id);
        this.afkChannelId = data.afk_channel_id ? BigInt(data.afk_channel_id) : null;
        this.afkTimeout = data.afk_timeout;
        this.verificationLevel = data.verification_level;
        this.defaultMessageNotifications = data.default_message_notifications;
        this.explicitContentFilter = data.explicit_content_filter;
        this.roles = new Map();
        for (const roleData of data.roles) {
            const role = new Role(this.client, roleData, this.id.toString());
            this.roles.set(role.id, role);
        }
        this.emojis = new Map();
        for (const emojiData of data.emojis) {
            const emoji = new Emoji(this.client, emojiData);
            this.emojis.set(emoji.id!, emoji);
        }
        this.features = data.features;
        this.mfaLevel = data.mfa_level;
        this.applicationId = data.application_id ? BigInt(data.application_id) : null;
        this.systemChannelId = data.system_channel_id ? BigInt(data.system_channel_id) : null;
        this.systemChannelFlags = data.system_channel_flags;
        this.widgetEnabled = data.widget_enabled;
        this.widgetChannelId = data.widget_channel_id ? BigInt(data.widget_channel_id) : null;
        this.maxPresences = data.max_presences;
        this.maxMembers = data.max_members;
        this.maxStageVideoChannelUsers = data.max_stage_video_channel_users;
        this.maxVideoChannelUsers = data.max_video_channel_users;
        this.vanityUrlCode = data.vanity_url_code;
        this.description = data.description;
        this.banner = data.banner;
        this.nsfw = data.nsfw;
        this.nsfwLevel = data.nsfw_level;
        this.premiumTier = data.premium_tier;
        this.premiumSubscriptionCount = data.premium_subscription_count;
        this.preferredLocale = data.preferred_locale;
        this.rulesChannelId = data.rules_channel_id ? BigInt(data.rules_channel_id) : null;
        this.safetyAlertsChannelId = data.safety_alerts_channel_id ? BigInt(data.safety_alerts_channel_id) : null;
        this.publicUpdatesChannelId = data.public_updates_channel_id ? BigInt(data.public_updates_channel_id) : null;
        this.hubType = data.hub_type;
        this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
        this.latestOnboardingQuestionId = data.latest_onboarding_question_id ? BigInt(data.latest_onboarding_question_id) : null;
        this.memberCount = data.approximate_member_count;
        this.stickers = data.stickers ? data.stickers.map((s: any) => new Sticker(this.client, s)) : [];
        this.incidentsData = data.incidents_data;
        this.inventorySettings = data.inventory_settings;
        this.embedEnabled = data.embed_enabled;
        this.embedChannelId = data.embed_channel_id ? BigInt(data.embed_channel_id) : null;
    }

    /**
     * Fetches a channel from the guild.
     * @param {string} channelId The ID of the channel to fetch.
     * @returns {Promise<Channel | null>} The channel object, or null if not found.
     */
    public async channels(): Promise<Channel[]> {
        const data = await this.client.rest.request('GET', `/guilds/${this.id.toString()}/channels`);
        return data.map((channelData: any) => new Channel(this.client, channelData));
    }

    /**
     * Fetches a member from the guild.
     * @param {string} memberId The ID of the member to fetch.
     * @returns {Promise<Member | null>} The member object, or null if not found.
     */
    public async members(): Promise<Member[]> {
        const data = await this.client.rest.request('GET', `/guilds/${this.id.toString()}/members?limit=1000`);
        return data.map((memberData: any) => new Member(this.client, memberData, this.id.toString()));
    }

    /**
     * Fetches a single member from the guild.
     * @param {bigint} memberId The ID of the member to fetch.
     * @returns {Promise<Member | null>} The member object, or null if not found.
     */
    public async member(memberId: bigint): Promise<Member | null> {
        try {
            const data = await this.client.rest.request('GET', `/guilds/${this.id.toString()}/members/${memberId.toString()}`);
            return new Member(this.client, data, this.id.toString());
        } catch (error) {
            console.error(`Failed to fetch member ${memberId} from guild ${this.id}:`, error);
            return null;
        }
    }

    /**
     * Fetches all roles in the guild.
     * @returns {Map<string, Role>}
     */
    public get rolesCache(): Map<bigint, Role> {
        return this.roles;
    }

    /**
     * Fetches a role by its ID.
     * @param {string} roleId The ID of the role to fetch.
     * @returns {Role | undefined}
     */
    public role(roleId: bigint): Role | undefined {
        return this.roles.get(roleId);
    }

    /**
     * Creates a new role in the guild.
     * @param {object} options The options for the new role.
     * @returns {Promise<Role>}
     */
    public async createRole(options: any, reason?: string): Promise<Role> {
        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        const data = await this.client.rest.request('POST', `/guilds/${this.id.toString()}/roles`, options, headers);
        const newRole = new Role(this.client, data, this.id.toString());
        this.roles.set(newRole.id, newRole);
        return newRole;
    }

    /**
     * Returns the URL of the guild's icon.
     * @param {string} [format='png'] The format of the icon (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=1024] The size of the icon (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public iconURL(format: string = 'png', size: number = 1024): string | null {
        if (!this.icon) return null;
        return `https://cdn.discordapp.com/icons/${this.id.toString()}/${this.icon}.${format}?size=${size}`;
    }

    /**
     * Returns the URL of the guild's splash image.
     * @param {string} [format='png'] The format of the splash (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=1024] The size of the splash (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public splashURL(format: string = 'png', size: number = 1024): string | null {
        if (!this.splash) return null;
        return `https://cdn.discordapp.com/splashes/${this.id.toString()}/${this.splash}.${format}?size=${size}`;
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
            splash: this.splash,
            discoverySplash: this.discoverySplash,
            homeHeader: this.homeHeader,
            ownerId: this.ownerId.toString(),
            afkChannelId: this.afkChannelId?.toString() || null,
            afkTimeout: this.afkTimeout,
            verificationLevel: this.verificationLevel,
            defaultMessageNotifications: this.defaultMessageNotifications,
            explicitContentFilter: this.explicitContentFilter,
            roles: Array.from(this.roles.values()).map(role => role.toJSON()),
            emojis: Array.from(this.emojis.values()).map(emoji => emoji.toJSON()),
            features: this.features,
            mfaLevel: this.mfaLevel,
            applicationId: this.applicationId?.toString() || null,
            systemChannelId: this.systemChannelId?.toString() || null,
            systemChannelFlags: this.systemChannelFlags,
            widgetEnabled: this.widgetEnabled,
            widgetChannelId: this.widgetChannelId?.toString() || null,
            maxPresences: this.maxPresences,
            maxMembers: this.maxMembers,
            maxStageVideoChannelUsers: this.maxStageVideoChannelUsers,
            maxVideoChannelUsers: this.maxVideoChannelUsers,
            vanityUrlCode: this.vanityUrlCode,
            description: this.description,
            banner: this.banner,
            nsfw: this.nsfw,
            nsfwLevel: this.nsfwLevel,
            premiumTier: this.premiumTier,
            premiumSubscriptionCount: this.premiumSubscriptionCount,
            preferredLocale: this.preferredLocale,
            rulesChannelId: this.rulesChannelId?.toString() || null,
            safetyAlertsChannelId: this.safetyAlertsChannelId?.toString() || null,
            publicUpdatesChannelId: this.publicUpdatesChannelId?.toString() || null,
            hubType: this.hubType,
            premiumProgressBarEnabled: this.premiumProgressBarEnabled,
            latestOnboardingQuestionId: this.latestOnboardingQuestionId?.toString() || null,
            memberCount: this.memberCount,
            stickers: this.stickers.map(sticker => sticker.toJSON()),
            incidentsData: this.incidentsData,
            inventorySettings: this.inventorySettings,
            embedEnabled: this.embedEnabled,
            embedChannelId: this.embedChannelId?.toString() || null,
        };
    }

    /**
     * Returns a formatted string representation of the guild.
     * @returns {string}
     */
    public inspect(): string {
        return `Guild { id: '${this.id}', name: '${this.name}' }`;
    }
}