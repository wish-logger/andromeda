import { Client } from '../client/Client';
import { ChannelType } from '../types/Channel';
import { CHANNEL_BULK_DELETE, CHANNEL_MESSAGES } from '../rest/Endpoints';
import { Message } from '../structures/Message';

export class Channel {
    public id: string;
    public type: ChannelType;
    public guildId?: string;
    public position?: number;
    public name?: string;
    public topic?: string | null;
    public nsfw?: boolean;
    public lastMessageId?: string | null;
    public bitrate?: number;
    public userLimit?: number;
    public rateLimitPerUser?: number;
    public parentId?: string | null;
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
        this.id = data.id;
        this.type = data.type;
        this.guildId = data.guild_id;
        this.position = data.position;
        this.name = data.name;
        this.topic = data.topic;
        this.nsfw = data.nsfw;
        this.lastMessageId = data.last_message_id;
        this.bitrate = data.bitrate;
        this.userLimit = data.user_limit;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.parentId = data.parent_id;
        this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp) : null;
        this.rtcRegion = data.rtc_region;
        this.videoQualityMode = data.video_quality_mode;
        this.messageCount = data.message_count; 
        this.memberCount = data.member_count; 
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.permissions = data.permissions;
        this.publicFlags = data.flags;
        this.totalMessageSent = data.total_message_sent;
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
        const messagesData = await this.client.rest.request('GET', `${CHANNEL_MESSAGES(this.id)}?limit=${limit}`);
        return messagesData.map((msg: any) => new Message(this.client, msg));
    }

    /**
     * Deletes multiple messages in a single request.
     * @param messageIds The IDs of the messages to delete. Max 100, Min 2. Must be less than 14 days old.
     * @param reason The reason for deleting the messages, for the audit log.
     * @returns A Promise that resolves when the messages are deleted.
     */
    public async bulkDelete(messageIds: string[], reason?: string): Promise<void> {
        if (messageIds.length < 2 || messageIds.length > 100) {
            throw new Error('You can only bulk delete between 2 and 100 messages.');
        }

        // Basic check for message age. Discord only allows bulk deletion of messages up to 14 days old
        // This is a client-side check, the API will still enforce i
        const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
        const tooOldMessages = messageIds.filter(id => {
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

        await this.client.rest.request('POST', CHANNEL_BULK_DELETE(this.id), { messages: messageIds }, headers);
    }
}

export { ChannelType };