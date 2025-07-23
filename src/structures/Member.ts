import { Client } from '../client/Client';
import { User } from './User';

/**
 * Represents a member of a guild on Discord.
 */
export class Member {
    /**
     * The client instance.
     * @type {Client}
     */
    public client: Client;

    /**
     * The user this guild member represents.
     * @type {User}
     */
    public user: User;

    /**
     * The member's guild nickname.
     * @type {string | null}
     */
    public nick: string | null;

    /**
     * The member's guild avatar hash.
     * @type {string | null}
     */
    public avatar: string | null;

    /**
     * Array of role IDs.
     * @type {string[]}
     */
    public roles: string[];

    /**
     * When the user joined the guild.
     * @type {Date}
     */
    public joinedAt: Date;

    /**
     * When the user started boosting the guild.
     * @type {Date | null}
     */
    public premiumSince: Date | null;

    /**
     * Whether the user is deafened in voice channels.
     * @type {boolean}
     */
    public deaf: boolean;

    /**
     * Whether the user is muted in voice channels.
     * @type {boolean}
     */
    public mute: boolean;

    /**
     * Guild member flags (bitfield).
     * @type {number}
     */
    public flags: number;

    /**
     * Whether the user has not yet passed the guild's Membership Screening requirements.
     * @type {boolean}
     */
    public pending: boolean;

    /**
     * Total permissions of the member in the guild, including overwrites.
     * @type {string | null}
     */
    public permissions: string | null;

    /**
     * When the user's timeout will expire and the user will be able to communicate in the guild again.
     * @type {Date | null}
     */
    public communicationDisabledUntil: Date | null;

    /**
     * The guild ID this member belongs to.
     * @type {string}
     */
    public guildId: bigint;

    /**
     * Creates a new Member instance.
     * @param {Client} client The client instance.
     * @param {any} data The raw member data from Discord.
     * @param {string} guildId The guild ID this member belongs to.
     */
    constructor(client: Client, data: any, guildId: string) {
        this.client = client;
        this.user = new User(client, data.user);
        this.nick = data.nick ?? null;
        this.avatar = data.avatar ?? null;
        this.roles = data.roles ?? [];
        this.joinedAt = new Date(data.joined_at);
        this.premiumSince = data.premium_since ? new Date(data.premium_since) : null;
        this.deaf = data.deaf ?? false;
        this.mute = data.mute ?? false;
        this.flags = data.flags ?? 0;
        this.pending = data.pending ?? false;
        this.permissions = data.permissions ?? null;
        this.communicationDisabledUntil = data.communication_disabled_until ? new Date(data.communication_disabled_until) : null;
        this.guildId = BigInt(guildId);

        let user = client.userCache.get(BigInt(data.user.id));
        if (!user) {
            user = new User(client, data.user);
            client.userCache.set(user);
        }
        this.user = user;
    }

    /**
     * The member's display name (nickname if set, otherwise global name or username).
     * @type {string}
     */
    public get displayName(): string {
        return this.nick || this.user.globalName || this.user.username;
    }

    /**
     * Whether this member is the guild owner.
     * @type {boolean}
     */
    public get isOwner(): boolean {
        // This would need guild data to check if user.id === guild.ownerId
        // For now, return false as we don't have guild context
        return false;
    }

    /**
     * Whether this member is currently timed out.
     * @type {boolean}
     */
    public get isCommunicationDisabled(): boolean {
        return this.communicationDisabledUntil ? this.communicationDisabledUntil > new Date() : false;
    }

    /**
     * Whether this member is boosting the guild.
     * @type {boolean}
     */
    public get premiumSubscriber(): boolean {
        return this.premiumSince !== null;
    }

    /**
     * Whether this member is manageable by the client user.
     * @type {boolean}
     */
    public get manageable(): boolean {
        // This would need more complex permission checking
        // For now, basic check - can't manage yourself or guild owner
        return this.user.id !== this.client.user?.id && !this.isOwner;
    }

    /**
     * Whether this member is kickable by the client user.
     * @type {boolean}
     */
    public get kickable(): boolean {
        return this.manageable && !this.isOwner;
    }

    /**
     * Whether this member is bannable by the client user.
     * @type {boolean}
     */
    public get bannable(): boolean {
        return this.manageable && !this.isOwner;
    }

    /**
     * Whether this member is moderatable (can be timed out) by the client user.
     * @type {boolean}
     */
    public get moderatable(): boolean {
        return this.manageable && !this.isOwner;
    }

    /**
     * Gets the member's guild avatar URL.
     * @param {Object} options Options for the avatar URL.
     * @param {string} options.format The format of the avatar (png, jpg, jpeg, webp, gif).
     * @param {number} options.size The size of the avatar (16, 32, 64, 128, 256, 512, 1024, 2048, 4096).
     * @returns {string | null} The guild avatar URL or null if no guild avatar.
     */
    public guildAvatarURL(options: { format?: string; size?: number } = {}): string | null {
        if (!this.avatar) return null;
        
        const format = options.format || 'png';
        const size = options.size ? `?size=${options.size}` : '';
        
        return `https://cdn.discordapp.com/guilds/${this.guildId.toString()}/users/${this.user.id.toString()}/avatars/${this.avatar}.${format}${size}`;
    }

    /**
     * Gets the member's display avatar URL (guild avatar if available, otherwise user avatar).
     * @param {Object} options Options for the avatar URL.
     * @returns {string} The display avatar URL.
     */
    public displayAvatarURL(options: { format?: string; size?: number } = {}): string {
        return this.guildAvatarURL(options) || this.user.displayAvatarURL(options);
    }

    /**
     * Returns the member as a mention string.
     * @returns {string} The member mention.
     */
    public toString(): string {
        return `<@${this.user.id.toString()}>`;
    }

    /**
     * Set the member's nickname.
     * @param {string | null} nick The new nickname.
     * @param {string} reason Reason for the change.
     * @returns {Promise<Member>} The updated member.
     */
    public async setNickname(nick: string | null, reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Add a role to the member.
     * @param {bigint} roleId The role ID to add.
     * @param {string} reason Reason for adding the role.
     * @returns {Promise<Member>} The updated member.
     */
    public async addRole(roleId: bigint, reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Remove a role from the member.
     * @param {bigint} roleId The role ID to remove.
     * @param {string} reason Reason for removing the role.
     * @returns {Promise<Member>} The updated member.
     */
    public async removeRole(roleId: bigint, reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Set the member's roles.
     * @param {bigint[]} roles Array of role IDs.
     * @param {string} reason Reason for the change.
     * @returns {Promise<Member>} The updated member.
     */
    public async setRoles(roles: bigint[], reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Kick the member from the guild.
     * @param {string} reason Reason for the kick.
     * @returns {Promise<Member>} The kicked member.
     */
    public async kick(reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Ban the member from the guild.
     * @param {Object} options Ban options.
     * @param {number} options.deleteMessageDays Number of days of messages to delete (0-7).
     * @param {string} options.reason Reason for the ban.
     * @returns {Promise<Member>} The banned member.
     */
    public async ban(options: { deleteMessageDays?: number; reason?: string } = {}): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Timeout the member (disable communication).
     * @param {number} timeout Timeout duration in milliseconds.
     * @param {string} reason Reason for the timeout.
     * @returns {Promise<Member>} The updated member.
     */
    public async timeout(timeout: number, reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Remove timeout from the member.
     * @param {string} reason Reason for removing timeout.
     * @returns {Promise<Member>} The updated member.
     */
    public async removeTimeout(reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Disconnect the member from voice channel.
     * @param {string} reason Reason for disconnecting.
     * @returns {Promise<Member>} The updated member.
     */
    public async disconnect(reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Move the member to a different voice channel.
     * @param {bigint} channelId The voice channel ID to move to.
     * @param {string} reason Reason for the move.
     * @returns {Promise<Member>} The updated member.
     */
    public async setVoiceChannel(channelId: bigint, reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Edit the member.
     * @param {Object} data The data to edit.
     * @param {string} reason Reason for the edit.
     * @returns {Promise<Member>} The updated member.
     */
    public async edit(data: any, reason?: string): Promise<Member> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Send a direct message to the member.
     * @param {string | any} content The message content or options.
     * @returns {Promise<any>} The sent message.
     */
    public async send(content: string | any): Promise<any> {
        // This would be implemented with API calls to create DM channel and send message
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Check if the member has a specific permission.
     * @param {bigint} permission The permission to check.
     * @returns {boolean} Whether the member has the permission.
     */
    public hasPermission(permission: bigint): boolean {
        // This would need complex permission calculation
        // For now, return false
        return false;
    }

    /**
     * Check if the member has any of the specified permissions.
     * @param {bigint[]} permissions The permissions to check.
     * @returns {boolean} Whether the member has any of the permissions.
     */
    public hasAnyPermission(permissions: bigint[]): boolean {
        return permissions.some(permission => this.hasPermission(permission));
    }

    /**
     * Check if the member has all of the specified permissions.
     * @param {bigint[]} permissions The permissions to check.
     * @returns {boolean} Whether the member has all of the permissions.
     */
    public hasAllPermissions(permissions: bigint[]): boolean {
        return permissions.every(permission => this.hasPermission(permission));
    }
}