import { Client } from '../client/Client';
import { Channel } from './Channel';
import { User } from './User';
import { Member } from './Member';
import { Role } from './Role';
import { Emoji } from './Emoji';

export class Guild {
    public id: string;
    public name: string;
    public icon: string | null;
    public splash: string | null;
    public ownerId: string;
    public afkChannelId: string | null;
    public afkTimeout: number;
    public verificationLevel: number;
    public defaultMessageNotifications: number;
    public explicitContentFilter: number;
    public roles: Map<string, Role>;
    public emojis: Map<string, Emoji>;
    public features: string[];
    public mfaLevel: number;
    public applicationId: string | null;
    public systemChannelId: string | null;
    public premiumTier: number;
    public premiumSubscriptionCount?: number;
    public preferredLocale: string;
    public publicUpdatesChannelId: string | null;
    public maxMembers?: number;
    public vanityUrlCode: string | null;
    public description: string | null;
    public banner: string | null;
    public nsfwLevel: number;
    public premiumProgressBarEnabled: boolean;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.icon = data.icon;
        this.splash = data.splash;
        this.ownerId = data.owner_id;
        this.afkChannelId = data.afk_channel_id;
        this.afkTimeout = data.afk_timeout;
        this.verificationLevel = data.verification_level;
        this.defaultMessageNotifications = data.default_message_notifications;
        this.explicitContentFilter = data.explicit_content_filter;
        this.roles = new Map();
        for (const roleData of data.roles) {
            const role = new Role(this.client, roleData, this.id);
            this.roles.set(role.id, role);
        }
        this.emojis = new Map();
        for (const emojiData of data.emojis) {
            const emoji = new Emoji(this.client, emojiData);
            this.emojis.set(emoji.id!, emoji);
        }
        this.features = data.features;
        this.mfaLevel = data.mfa_level;
        this.applicationId = data.application_id;
        this.systemChannelId = data.system_channel_id;
        this.premiumTier = data.premium_tier;
        this.premiumSubscriptionCount = data.premium_subscription_count;
        this.preferredLocale = data.preferred_locale;
        this.publicUpdatesChannelId = data.public_updates_channel_id;
        this.maxMembers = data.max_members;
        this.vanityUrlCode = data.vanity_url_code;
        this.description = data.description;
        this.banner = data.banner;
        this.nsfwLevel = data.nsfw_level;
        this.premiumProgressBarEnabled = data.premium_progress_bar_enabled;
    }

    /**
     * Fetches a channel from the guild.
     * @param {string} channelId The ID of the channel to fetch.
     * @returns {Promise<Channel | null>} The channel object, or null if not found.
     */
    public async channels(): Promise<Channel[]> {
        const data = await this.client.rest.request('GET', `/guilds/${this.id}/channels`);
        return data.map((channelData: any) => new Channel(this.client, channelData));
    }

    /**
     * Fetches a member from the guild.
     * @param {string} memberId The ID of the member to fetch.
     * @returns {Promise<Member | null>} The member object, or null if not found.
     */
    public async members(): Promise<Member[]> {
        const data = await this.client.rest.request('GET', `/guilds/${this.id}/members?limit=1000`);
        return data.map((memberData: any) => new Member(this.client, memberData, this.id));
    }

    /**
     * Fetches a single member from the guild.
     * @param {string} memberId The ID of the member to fetch.
     * @returns {Promise<Member | null>} The member object, or null if not found.
     */
    public async member(memberId: BigInt): Promise<Member | null> {
        try {
            const data = await this.client.rest.request('GET', `/guilds/${this.id}/members/${memberId.toString()}`);
            return new Member(this.client, data, this.id);
        } catch (error) {
            console.error(`Failed to fetch member ${memberId} from guild ${this.id}:`, error);
            return null;
        }
    }

    /**
     * Fetches all roles in the guild.
     * @returns {Map<string, Role>}
     */
    public get rolesCache(): Map<string, Role> {
        return this.roles;
    }

    /**
     * Fetches a role by its ID.
     * @param {string} roleId The ID of the role to fetch.
     * @returns {Role | undefined}
     */
    public role(roleId: string): Role | undefined {
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

        const data = await this.client.rest.request('POST', `/guilds/${this.id}/roles`, options, headers);
        const newRole = new Role(this.client, data, this.id);
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
        return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.${format}?size=${size}`;
    }

    /**
     * Returns the URL of the guild's splash image.
     * @param {string} [format='png'] The format of the splash (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=1024] The size of the splash (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public splashURL(format: string = 'png', size: number = 1024): string | null {
        if (!this.splash) return null;
        return `https://cdn.discordapp.com/splashes/${this.id}/${this.splash}.${format}?size=${size}`;
    }

    /**
     * Returns a serializable object representation of the guild.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id,
            name: this.name,
            icon: this.icon,
            splash: this.splash,
            ownerId: this.ownerId,
            afkChannelId: this.afkChannelId,
            afkTimeout: this.afkTimeout,
            verificationLevel: this.verificationLevel,
            defaultMessageNotifications: this.defaultMessageNotifications,
            explicitContentFilter: this.explicitContentFilter,
            roles: Array.from(this.roles.values()).map(role => role.toJSON()),
            emojis: Array.from(this.emojis.values()).map(emoji => emoji.toJSON()),
            features: this.features,
            mfaLevel: this.mfaLevel,
            applicationId: this.applicationId,
            systemChannelId: this.systemChannelId,
            premiumTier: this.premiumTier,
            premiumSubscriptionCount: this.premiumSubscriptionCount,
            preferredLocale: this.preferredLocale,
            publicUpdatesChannelId: this.publicUpdatesChannelId,
            maxMembers: this.maxMembers,
            vanityUrlCode: this.vanityUrlCode,
            description: this.description,
            banner: this.banner,
            nsfwLevel: this.nsfwLevel,
            premiumProgressBarEnabled: this.premiumProgressBarEnabled,
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