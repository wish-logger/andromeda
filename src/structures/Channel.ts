import { Client } from '../client/Client';
import { ChannelType } from '../types/Channel';
import { CHANNEL_BULK_DELETE, CHANNEL_MESSAGES } from '../rest/Endpoints';
import { Message } from '../structures/Message';

export class Channel {
    public id: bigint;
    public type: ChannelType;
    public guildId?: bigint;
    public position?: number;
    public name?: string;
    public topic?: string | null;
    public nsfw?: boolean;
    public lastMessageId?: bigint | null;
    public bitrate?: number;
    public userLimit?: number;
    public rateLimitPerUser?: number;
    public parentId?: bigint | null;
    public lastPinTimestamp?: Date | null;
    public rtcRegion?: string | null;
    public videoQualityMode?: number;
    // messageCount and memberCount can exist on non-thread channels (forum posts)
    public messageCount?: number; 
    public memberCount?: number; 
    public defaultAutoArchiveDuration?: number;
    public permissions?: string;
    public publicFlags?: number;
    public totalMessageSent?: number;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.type = data.type;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : undefined;
        this.position = data.position;
        this.name = data.name;
        this.topic = data.topic;
        this.nsfw = data.nsfw;
        this.lastMessageId = data.last_message_id ? BigInt(data.last_message_id) : null;
        this.bitrate = data.bitrate;
        this.userLimit = data.user_limit;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.parentId = data.parent_id ? BigInt(data.parent_id) : null;
        this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp) : null;
        this.rtcRegion = data.rtc_region;
        this.videoQualityMode = data.video_quality_mode;
        this.messageCount = data.message_count; 
        this.memberCount = data.member_count; 
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.permissions = data.permissions;
        this.publicFlags = data.flags;
        this.totalMessageSent = data.total_message_sent;

        this.client.channelCache.set(this);
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