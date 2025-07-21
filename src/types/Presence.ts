/**
 * Represents the presence data for a Discord user or bot.
 */
export interface PresenceData {
    /**
     * An array of activities the user is currently doing.
     */
    activities: {
        /**
         * The name of the activity.
         */
        name: string;
        /**
         * The type of the activity (e.g., 0 for Playing, 1 for Streaming, 4 for Custom Status).
         */
        type: ActivityType;
        /**
         * The state of the activity (e.g., for Custom Status).
         */
        state?: string;
    }[];
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
