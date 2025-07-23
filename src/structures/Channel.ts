import { Client } from '../client/Client';
import { User } from './User';
import { Member } from './Member';
import { Guild } from './Guild';
import { PermissionOverwrite } from './PermissionOverwrite';
import { ChannelType } from '../types/Channel';
import { CHANNEL_MESSAGES, CHANNEL_BULK_DELETE } from '../rest/Endpoints';
import { Message } from './Message';
import { ThreadMetadata, ThreadMember } from '../types/Thread';

export enum VideoQualityMode {
    AUTO = 1,
    FULL = 2,
}

export enum SortOrderType {
    LATEST_ACTIVITY = 0,
    CREATION_DATE = 1,
}

export enum ForumLayoutType {
    NOT_SET = 0,
    LIST_VIEW = 1,
    GALLERY_VIEW = 2,
}

export interface DefaultReaction {
    emojiId?: bigint | null;
    emojiName?: string | null;
}

export interface ForumTag {
    id: bigint;
    name: string;
    moderated: boolean;
    emojiId?: bigint | null;
    emojiName?: string | null;
}

export class Channel {
    public id: bigint;
    public type: ChannelType;
    public guildId?: bigint;
    public position?: number;
    public permissionOverwrites?: PermissionOverwrite[];
    public name?: string | null;
    public topic?: string | null;
    public nsfw?: boolean;
    public lastMessageId?: bigint | null;
    public bitrate?: number;
    public userLimit?: number;
    public rateLimitPerUser?: number;
    public recipients?: User[];
    public icon?: string | null;
    public ownerId?: bigint;
    public applicationId?: bigint;
    public managed?: boolean;
    public parentId?: bigint | null;
    public lastPinTimestamp?: Date | null;
    public rtcRegion?: string | null;
    public videoQualityMode?: VideoQualityMode;
    public messageCount?: number;
    public memberCount?: number;
    public threadMetadata?: ThreadMetadata;
    public member?: ThreadMember;
    public defaultAutoArchiveDuration?: number;
    public permissions?: string;
    public flags?: number;
    public totalMessageSent?: number;
    public availableTags?: ForumTag[];
    public appliedTags?: bigint[];
    public defaultReactionEmoji?: DefaultReaction | null;
    public defaultThreadRateLimitPerUser?: number;
    public defaultSortOrder?: SortOrderType | null;
    public defaultForumLayout?: ForumLayoutType;

    protected client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.type = data.type;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : undefined;
        this.position = data.position;
        this.permissionOverwrites = data.permission_overwrites ? data.permission_overwrites.map((o: any) => new PermissionOverwrite(this.client, o)) : undefined;
        this.name = data.name;
        this.topic = data.topic;
        this.nsfw = data.nsfw;
        this.lastMessageId = data.last_message_id ? BigInt(data.last_message_id) : null;
        this.bitrate = data.bitrate;
        this.userLimit = data.user_limit;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.recipients = data.recipients ? data.recipients.map((r: any) => new User(this.client, r)) : undefined;
        this.icon = data.icon;
        this.ownerId = data.owner_id ? BigInt(data.owner_id) : undefined;
        this.applicationId = data.application_id ? BigInt(data.application_id) : undefined;
        this.managed = data.managed;
        this.parentId = data.parent_id ? BigInt(data.parent_id) : null;
        this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp) : null;
        this.rtcRegion = data.rtc_region;
        this.videoQualityMode = data.video_quality_mode;
        this.messageCount = data.message_count;
        this.memberCount = data.member_count;
        this.threadMetadata = data.thread_metadata ? {
            archived: data.thread_metadata.archived,
            autoArchiveDuration: data.thread_metadata.auto_archive_duration,
            archiveTimestamp: new Date(data.thread_metadata.archive_timestamp),
            locked: data.thread_metadata.locked,
            invitable: data.thread_metadata.invitable,
            createTimestamp: data.thread_metadata.create_timestamp ? new Date(data.thread_metadata.create_timestamp) : undefined,
        } : undefined;
        this.member = data.member ? {
            id: data.member.id ? BigInt(data.member.id) : undefined,
            userId: data.member.user_id ? BigInt(data.member.user_id) : undefined,
            joinTimestamp: new Date(data.member.join_timestamp),
            flags: data.member.flags,
            member: data.member.member && this.guildId ? new Member(this.client, data.member.member, this.guildId.toString()) : undefined, // Instantiate Member with guildId
        } : undefined;
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.permissions = data.permissions;
        this.flags = data.flags;
        this.totalMessageSent = data.total_message_sent;
        this.availableTags = data.available_tags ? data.available_tags.map((tag: any) => ({
            id: BigInt(tag.id),
            name: tag.name,
            moderated: tag.moderated,
            emojiId: tag.emoji_id ? BigInt(tag.emoji_id) : null,
            emojiName: tag.emoji_name,
        })) : undefined;
        this.appliedTags = data.applied_tags ? data.applied_tags.map((id: string) => BigInt(id)) : undefined;
        this.defaultReactionEmoji = data.default_reaction_emoji ? {
            emojiId: data.default_reaction_emoji.emoji_id ? BigInt(data.default_reaction_emoji.emoji_id) : null,
            emojiName: data.default_reaction_emoji.emoji_name,
        } : null;
        this.defaultThreadRateLimitPerUser = data.default_thread_rate_limit_per_user;
        this.defaultSortOrder = data.default_sort_order;
        this.defaultForumLayout = data.default_forum_layout;
    }

    /**
     * Returns the URL of the channel's icon, if it is a Group DM.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public iconURL(format: string = 'png', size: number = 128): string | null {
        if (!this.icon || this.type !== ChannelType.GROUP_DM) return null;
        return `https://cdn.discordapp.com/channel-icons/${this.id.toString()}/${this.icon}.${format}?size=${size}`;
    }

    /**
     * Checks if the channel is a DM channel.
     * @returns {boolean}
     */
    public isDM(): boolean {
        return this.type === ChannelType.DM || this.type === ChannelType.GROUP_DM;
    }

    /**
     * Checks if the channel is a guild channel.
     * @returns {boolean}
     */
    public isGuildChannel(): boolean {
        return this.guildId !== undefined;
    }

    /**
     * Returns the parent guild of this channel, if applicable.
     * @returns {Promise<Guild | null>}
     */
    public async fetchGuild(): Promise<Guild | null> {
        if (!this.guildId) return null;
        return this.client.guilds.fetch(this.guildId);
    }

    /**
     * Returns a serializable object representation of the channel.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            type: this.type,
            guild_id: this.guildId?.toString(),
            position: this.position,
            permission_overwrites: this.permissionOverwrites?.map(o => o.toJSON()),
            name: this.name,
            topic: this.topic,
            nsfw: this.nsfw,
            last_message_id: this.lastMessageId?.toString() || null,
            bitrate: this.bitrate,
            user_limit: this.userLimit,
            rate_limit_per_user: this.rateLimitPerUser,
            recipients: this.recipients?.map(r => r.toJSON()),
            icon: this.icon,
            owner_id: this.ownerId?.toString(),
            application_id: this.applicationId?.toString(),
            managed: this.managed,
            parent_id: this.parentId?.toString() || null,
            last_pin_timestamp: this.lastPinTimestamp?.toISOString() || null,
            rtc_region: this.rtcRegion,
            video_quality_mode: this.videoQualityMode,
            message_count: this.messageCount,
            member_count: this.memberCount,
            thread_metadata: this.threadMetadata ? {
                archived: this.threadMetadata.archived,
                auto_archive_duration: this.threadMetadata.autoArchiveDuration,
                archive_timestamp: this.threadMetadata.archiveTimestamp.toISOString(),
                locked: this.threadMetadata.locked,
                invitable: this.threadMetadata.invitable,
                create_timestamp: this.threadMetadata.createTimestamp?.toISOString() || undefined,
            } : undefined,
            member: this.member ? {
                id: this.member.id?.toString(),
                user_id: this.member.userId?.toString(),
                join_timestamp: this.member.joinTimestamp.toISOString(),
                flags: this.member.flags,
                member: this.member.member ? this.member.member.toJSON() : undefined,
            } : undefined,
            default_auto_archive_duration: this.defaultAutoArchiveDuration,
            permissions: this.permissions,
            flags: this.flags,
            total_message_sent: this.totalMessageSent,
            available_tags: this.availableTags?.map(tag => ({
                id: tag.id.toString(),
                name: tag.name,
                moderated: tag.moderated,
                emoji_id: tag.emojiId?.toString() || null,
                emoji_name: tag.emojiName,
            })),
            applied_tags: this.appliedTags?.map(id => id.toString()),
            default_reaction_emoji: this.defaultReactionEmoji ? {
                emoji_id: this.defaultReactionEmoji.emojiId?.toString() || null,
                emoji_name: this.defaultReactionEmoji.emojiName,
            } : null,
            default_thread_rate_limit_per_user: this.defaultThreadRateLimitPerUser,
            default_sort_order: this.defaultSortOrder,
            default_forum_layout: this.defaultForumLayout,
        };
    }

    /**
     * Returns a formatted string representation of the channel.
     * @returns {string}
     */
    public inspect(): string {
        return `Channel { id: '${this.id}', name: '${this.name}', type: ${this.type} }`;
    }

    /**
    * Fetches messages from this channel.
    * @param limit The maximum number of messages to return. Defaults to 50. Max 100.
    * @returns A Promise that resolves with an array of Message objects.
    */
    public async fetchMessages(limit: number = 50): Promise<Message[]> {
        if (limit < 1 || limit > 100) {
            throw new Error('Message fetch limit must be between 1 and 100.');
        }
        const messagesData = await this.client.rest.request('GET', `${CHANNEL_MESSAGES(this.id.toString())}?limit=${limit}`);
        return messagesData.map((msg: any) => new Message(this.client, msg));
    }

    /**
     * Fetches a specific message from this channel.
     * @param {BigInt} messageId The ID of the message to fetch.
     * @returns {Promise<Message | null>} A Promise that resolves with the Message object, or null if not found.
     */
    public async fetchMessage(messageId: bigint): Promise<Message | null> {
        const cachedMessage = this.client.messages.get(messageId);
        if (cachedMessage) {
            return cachedMessage;
        }

        try {
            const messageData = await this.client.rest.request('GET', `${CHANNEL_MESSAGES(this.id.toString())}/${messageId.toString()}`);
            const message = new Message(this.client, messageData);
            this.client.messages.set(message);
            return message;
        } catch (error) {
            console.error(`Failed to fetch message ${messageId} from channel ${this.id}:`, error);
            return null;
        }
    }

    /**
    * Deletes multiple messages in a single request.
    * @param options Options for deletion. Can be an array of message IDs or an amount of messages to delete.
    * @param reason The reason for deleting the messages, for the audit log.
    * @returns A Promise that resolves when the messages are deleted.
    */
    public async bulkDelete(options: { messageIds?: string[], amount?: number }, reason?: string): Promise<void> {
        let messagesToDelete: string[] = [];

        if (options.amount !== undefined && options.messageIds !== undefined) {
            throw new Error('You cannot provide both \'amount\' and \'messageIds\'.');
        } else if (options.amount !== undefined) {
            if (options.amount < 1 || options.amount > 100) {
                throw new Error('Amount of messages to delete must be between 1 and 100.');
            }
            const fetchedMessages = await this.fetchMessages(options.amount);
            messagesToDelete = fetchedMessages.map(msg => msg.id);
        } else if (options.messageIds !== undefined) {
            messagesToDelete = options.messageIds;
        } else {
            throw new Error('You must provide either \'amount\' or \'messageIds\'.');
        }

        if (messagesToDelete.length < 2 || messagesToDelete.length > 100) {
            // Discord API requires 2-100 messages for bulk delete. Handle cases where less than 2 messages are selected.
            // If amount was 1, we could delete it via single message delete endpoint. For simplicity, we'll throw.
            throw new Error('You can only bulk delete between 2 and 100 messages.');
        }

        // Basic check for message age. Discord only allows bulk deletion of messages up to 14 days old
        // This is a client-side check, the API will still enforce i
        const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        const tooOldMessages = messagesToDelete.filter(id => {
            const snowflakeTimestamp = BigInt(id) >> 22n;
            return Number(snowflakeTimestamp) + 1420070400000 < fourteenDaysAgo;
        });

        if (tooOldMessages.length > 0) {
            console.warn('Some messages are older than 14 days and cannot be bulk deleted.');
        }

        const headers: { [key: string]: string } = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = reason;
        }

        await this.client.rest.request('POST', CHANNEL_BULK_DELETE(this.id.toString()), { messages: messagesToDelete }, headers);
    }
}

export { ChannelType };