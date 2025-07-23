import { Client } from '../client/Client';
import { Channel} from './Channel';
import { Member } from './Member';

/**
 * Represents a Discord thread channel.
 */
export class Thread extends Channel {
    public messageCount?: number;
    public memberCount?: number;
    public threadMetadata?: ThreadMetadata;
    public member?: ThreadMember;
    public defaultAutoArchiveDuration?: number;
    public permissions?: string;
    public flags?: number;
    public totalMessageSent?: number;
    public parentId: bigint;
    public ownerId: bigint;
    public lastMessageId: bigint | null;
    public lastPinTimestamp: Date | null;
    public rateLimitPerUser?: number;
    public rtcRegion?: string;

    constructor(client: Client, data: any) {
        super(client, data);

        this.messageCount = data.message_count;
        this.memberCount = data.member_count;
        this.threadMetadata = data.thread_metadata ? { archived: data.thread_metadata.archived, autoArchiveDuration: data.thread_metadata.auto_archive_duration, archiveTimestamp: new Date(data.thread_metadata.archive_timestamp), locked: data.thread_metadata.locked, invitable: data.thread_metadata.invitable, createTimestamp: data.thread_metadata.create_timestamp ? new Date(data.thread_metadata.create_timestamp) : undefined } : undefined;
        this.member = data.member ? { id: BigInt(data.member.id), userId: BigInt(data.member.user_id), joinTimestamp: new Date(data.member.join_timestamp), flags: data.member.flags, member: data.member.member && data.guild_id ? new Member(this.client, data.member.member, data.guild_id.toString()) : undefined } : undefined;
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.permissions = data.permissions;
        this.flags = data.flags;
        this.totalMessageSent = data.total_message_sent;
        this.parentId = BigInt(data.parent_id);
        this.ownerId = BigInt(data.owner_id);
        this.lastMessageId = data.last_message_id ? BigInt(data.last_message_id) : null;
        this.lastPinTimestamp = data.last_pin_timestamp ? new Date(data.last_pin_timestamp) : null;
        this.rateLimitPerUser = data.rate_limit_per_user;
        this.rtcRegion = data.rtc_region;
    }
}

/**
 * Represents the metadata for a Discord thread channel.
 */
export interface ThreadMetadata {
    archived: boolean;
    autoArchiveDuration: number;
    archiveTimestamp: Date;
    locked: boolean;
    invitable?: boolean;
    createTimestamp?: Date;
}

/**
 * Represents a Discord thread member.
 */
export interface ThreadMember {
    id?: bigint;
    userId?: bigint;
    joinTimestamp: Date;
    flags: number;
    member?: Member;
}