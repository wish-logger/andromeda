import { User } from '../structures/User';

/**
 * Represents the presence data for a Discord user or bot.
 */
export interface PresenceData {
    /**
     * An array of activities the user is currently doing.
     */
    activities: ActivityObject[];
    /**
     * The user's new status.
     * Can be 'online', 'dnd' (Do Not Disturb), 'idle', 'invisible', or 'offline'.
     */
    status: 'online' | 'dnd' | 'idle' | 'invisible' | 'offline';
    /**
     * Unix timestamp (in milliseconds) of when the client went idle, or null if not idle.
     */
    since: number | null;
    /**
     * Whether the client is AFK.
     */
    afk: boolean;
    /**
     * User structure
     */
    user: User;
}

/**
 * Represents an activity object within a presence update.
 */
export interface ActivityObject {
    name: string;
    type: ActivityType;
    url?: string | null;
    created_at?: number;
    timestamps?: { start?: number; end?: number };
    application_id?: string;
    details?: string | null;
    state?: string | null;
    emoji?: { name: string; id?: string; animated?: boolean } | null;
    party?: { id?: string; size?: [number, number] };
    assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string };
    secrets?: { join?: string; match?: string; spectate?: string };
    instance?: boolean;
    flags?: number;
}

/**
 * Enum for activity types.
 */
export enum ActivityType {
    PLAYING = 0,
    STREAMING = 1,
    LISTENING = 2,
    WATCHING = 3,
    CUSTOM = 4,
    COMPETING = 5,
}

/**
 * Enum for presence update status.
 */
export enum PresenceUpdateStatus {
    Online = 'online',
    DoNotDisturb = 'dnd',
    Idle = 'idle',
    Invisible = 'invisible',
    Offline = 'offline',
}