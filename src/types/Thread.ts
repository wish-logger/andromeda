import { Member } from "../structures/Member";

export interface ThreadMetadata {
    archived: boolean;
    autoArchiveDuration: number;
    archiveTimestamp: Date;
    locked: boolean;
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