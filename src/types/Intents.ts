/**
 * Represents the bitfield of Gateway Intents.
 */
export enum GatewayIntentBits {
    GUILDS = 1 << 0,
    GUILD_MEMBERS = 1 << 1,
    GUILD_BANS = 1 << 2,
    GUILD_EMOJIS_AND_STICKERS = 1 << 3,
    GUILD_INTEGRATIONS = 1 << 4,
    GUILD_WEBHOOKS = 1 << 5,
    GUILD_INVITES = 1 << 6,
    GUILD_VOICE_STATES = 1 << 7,
    GUILD_PRESENCES = 1 << 8,
    GUILD_MESSAGES = 1 << 9,
    GUILD_MESSAGE_REACTIONS = 1 << 10,
    GUILD_MESSAGE_TYPING = 1 << 11,
    DIRECT_MESSAGES = 1 << 12,
    DIRECT_MESSAGE_REACTIONS = 1 << 13,
    DIRECT_MESSAGE_TYPING = 1 << 14,
    MESSAGE_CONTENT = 1 << 15,
    GUILD_SCHEDULED_EVENTS = 1 << 16,
    AUTO_MODERATION_CONFIGURATION = 1 << 20,
    AUTO_MODERATION_EXECUTION = 1 << 21,
}

/**
 * Type for client options when creating a new Client instance.
 */
export interface ClientOptions {
    intents?: number | GatewayIntentBits[];
    clusterId?: number; // (0-indexed)
    totalClusters?: number;
}