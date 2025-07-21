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
         * The type of the activity (e.g., 0 for Playing, 1 for Streaming).
         */
        type: number;
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
