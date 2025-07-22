import { Client } from '../client/Client';
import { Channel, ChannelType } from './Channel';
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

    constructor(client: Client, data: any) {
        super(client, data);

        this.messageCount = data.message_count;
        this.memberCount = data.member_count;
        this.threadMetadata = data.thread_metadata ? { archived: data.thread_metadata.archived, auto_archive_duration: data.thread_metadata.auto_archive_duration, archive_timestamp: new Date(data.thread_metadata.archive_timestamp), locked: data.thread_metadata.locked, invitable: data.thread_metadata.invitable } : undefined;
        this.member = data.member ? { id: data.member.id, user_id: data.member.user_id, join_timestamp: new Date(data.member.join_timestamp), flags: data.member.flags } : undefined;
        this.defaultAutoArchiveDuration = data.default_auto_archive_duration;
        this.permissions = data.permissions;
        this.flags = data.flags;
        this.totalMessageSent = data.total_message_sent;
    }
}

/**
 * Represents the metadata for a Discord thread channel.
 */
export interface ThreadMetadata {
    archived: boolean;
    auto_archive_duration: number;
    archive_timestamp: Date;
    locked: boolean;
    invitable?: boolean;
    create_timestamp?: Date;
}

/**
 * Represents a Discord thread member.
 */
export interface ThreadMember {
    id?: string;
    user_id?: string;
    join_timestamp: Date;
    flags: number;
    member?: Member;
}