import { Client } from '../client/Client';

/**
 * Represents a user on Discord.
 */
export class User {
    /**
     * The user's ID.
     * @type {bigint}
     */
    public id: bigint;
    
    /**
     * The user's username.
     * @type {string}
     */
    public username: string;
    
    /**
     * The user's 4-digit Discord tag (only for bots).
     * @type {string}
     */
    public discriminator: string;
    
    /**
     * The user's display name (global display name).
     * @type {string | null}
     */
    public globalName: string | null;
    
    /**
     * The user's avatar hash.
     * @type {string | null}
     */
    public avatar: string | null;
    
    /**
     * The user's banner hash.
     * @type {string | null}
     */
    public banner: string | null;
    
    /**
     * The user's banner color (hex color code).
     * @type {number | null}
     */
    public accentColor: number | null;
    
    /**
     * Whether the user is a bot.
     * @type {boolean}
     */
    public bot: boolean;
    
    /**
     * Whether the user is a system user (part of the urgent message system).
     * @type {boolean}
     */
    public system: boolean;
    
    /**
     * Whether the user has two factor authentication enabled.
     * @type {boolean | null}
     */
    public mfaEnabled: boolean | null;
    
    /**
     * The user's chosen language option.
     * @type {string | null}
     */
    public locale: string | null;
    
    /**
     * Whether the email on this account has been verified.
     * @type {boolean | null}
     */
    public verified: boolean | null;
    
    /**
     * The user's email (only available with email OAuth2 scope).
     * @type {string | null}
     */
    public email: string | null;
    
    /**
     * The flags on a user's account (bitfield).
     * @type {number | null}
     */
    public flags: number | null;
    
    /**
     * The type of Nitro subscription on a user's account.
     * @type {number | null}
     */
    public premiumType: number | null;
    
    /**
     * The public flags on a user's account (bitfield).
     * @type {number | null}
     */
    public publicFlags: number | null;
    
    /**
     * The user's avatar decoration hash.
     * @type {string | null}
     */
    public avatarDecoration: string | null;

    /**
     * The date and time the user account was created.
     * @type {Date}
     */
    public createdAt: Date;

    /**
     *  User's collectibles
     * @type {object | null}
     */
    public collectibles: object | null;

    /**
     *  User's primary guild
     * @type {object | null}
     */
    public primaryGuild: object | null;

    private client: Client;

    /**
     * Creates a new User instance.
     * @param {Client} client The client instance.
     * @param {any} data The raw user data from Discord.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.username = data.username;
        this.discriminator = data.discriminator ?? '';
        this.globalName = data.global_name ?? null;
        this.avatar = data.avatar ?? null;
        this.banner = data.banner ?? null;
        this.accentColor = data.accent_color ?? null;
        this.bot = data.bot ?? false;
        this.system = data.system ?? false;
        this.mfaEnabled = data.mfa_enabled ?? null;
        this.locale = data.locale ?? null;
        this.verified = data.verified ?? null;
        this.email = data.email ?? null;
        this.flags = data.flags ?? null;
        this.premiumType = data.premium_type ?? null;
        this.publicFlags = data.public_flags ?? null;
        this.avatarDecoration = data.avatar_decoration ?? null;
        const snowflakeTimestamp = BigInt(this.id) >> 22n;
        this.createdAt = new Date(Number(snowflakeTimestamp) + 1420070400000);
        this.collectibles = data.collectibles ?? null
        this.primaryGuild = data.primary_guild ?? null
        if (this.client.userCache) {
            this.client.userCache.set(this);
        }
    }

    /**
     * The user's display name. Returns global_name if set, otherwise username.
     * @type {string}
     */
    public get displayName(): string {
        return this.globalName || this.username;
    }

    /**
     * The user's tag (e.g., `username#1234` for bots, just username for regular users).
     * @type {string}
     */
    public get tag(): string {
        return this.discriminator ? `${this.username}#${this.discriminator}` : this.username;
    }

    /**
     * Returns the URL of the user's avatar.
     * @param {Object} options Options for the avatar URL.
     * @param {string} options.format The format of the avatar (png, jpg, jpeg, webp, gif).
     * @param {number} options.size The size of the avatar (16, 32, 64, 128, 256, 512, 1024, 2048, 4096).
     * @returns {string | null} The avatar URL or null if no avatar.
     */
    public avatarURL(options: { format?: string; size?: number } = {}): string | null {
        if (!this.avatar) return null;
        
        const format = options.format || 'png';
        const size = options.size ? `?size=${options.size}` : '';
        
        return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}${size}`;
    }

    /**
     * Gets the user's banner URL.
     * @param {Object} options Options for the banner URL.
     * @param {string} options.format The format of the banner (png, jpg, jpeg, webp, gif).
     * @param {number} options.size The size of the banner (16, 32, 64, 128, 256, 512, 1024, 2048, 4096).
     * @returns {string | null} The banner URL or null if no banner.
     */
    public bannerURL(options: { format?: string; size?: number } = {}): string | null {
        if (!this.banner) return null;
        
        const format = options.format || 'png';
        const size = options.size ? `?size=${options.size}` : '';
        
        return `https://cdn.discordapp.com/banners/${this.id}/${this.banner}.${format}${size}`;
    }

    /**
     * Returns the URL of the user's avatar, or their default avatar if they don't have one.
     * @param {string} [format='png'] The format of the avatar (e.g., 'png', 'jpg', 'webp', 'gif').
     * @param {number} [size=1024] The size of the avatar (any power of 2 between 16 and 4096).
     * @returns {string}
     */
    public defaultAvatarURL(): string {
        // New system uses user ID modulo 6 for default avatars
        const index = Number(this.id >> 22n) % 6;
        return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
    }

    /**
     * Returns the URL of the user's avatar, or their default avatar if they don't have one.
     * @param {Object} options Options for the avatar URL.
     * @returns {string} The avatar URL or default avatar URL.
     */
    public displayAvatarURL(options: { format?: string; size?: number } = {}): string {
        return this.avatarURL(options) || this.defaultAvatarURL();
    }

    /**
     * Returns a mention string for the user.
     * @returns {string}
     */
    public toString(): string {
        return `<@${this.id.toString()}>`;
    }

    /**
     * Returns a serializable object representation of the user.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            username: this.username,
            discriminator: this.discriminator,
            globalName: this.globalName,
            avatar: this.avatar,
            bot: this.bot,
            system: this.system,
            mfaEnabled: this.mfaEnabled,
            banner: this.banner,
            accentColor: this.accentColor,
            locale: this.locale,
            verified: this.verified,
            email: this.email,
            flags: this.flags,
            premiumType: this.premiumType,
            publicFlags: this.publicFlags,
        };
    }

    /**
     * Returns a formatted string representation of the user.
     * @returns {string}
     */
    public inspect(): string {
        return `User { id: '${this.id}', username: '${this.username}' }`;
    }
}