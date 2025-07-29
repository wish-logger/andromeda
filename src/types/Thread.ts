import { Member } from "../structures/Member";

export interface ThreadMetadata {
    archived?: boolean;
    autoArchiveDuration?: number;
    archiveTimestamp?: Date;
    locked?: boolean;
    invitable?: boolean;
    createTimestamp?: Date;
}

export interface ThreadMember {
    id?: bigint;
    userId?: bigint;
    joinTimestamp: Date;
    flags: number;
    member?: Member; 
}

export interface PartialThread {
    id: bigint;
    guild_id?: bigint; 
    parent_id: bigint;
    owner_id: bigint;
    name: string;
    type: number;
    last_message_id?: bigint | null;
    rate_limit_per_user?: number;
    thread_metadata?: ThreadMetadata;
    member?: ThreadMember;
}