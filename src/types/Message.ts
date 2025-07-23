/**
 * Bitfield of message flags.
 */
export enum MessageFlags {
    /**
     * This message has been published to a Discord Channel following a Cross Post.
     */
    CROSSPOSTED = 1 << 0,
    /**
     * This message originated from a Message containing a Cross Post.
     */
    IS_CROSSPOST = 1 << 1,
    /**
     * Do not include any embeds when serializing this message.
     */
    SUPPRESS_EMBEDS = 1 << 2,
    /**
     * The source message for this crossposted message did not have any embeds.
     */
    SOURCE_MESSAGE_DELETED = 1 << 3,
    /**
     * This message came from the urgent message system.
     */
    URGENT = 1 << 4,
    /**
     * This message has an associated thread, with the same id as the message
     */
    HAS_THREAD = 1 << 5,
    /**
     * This message is only visible to the user who invoked the interaction.
     */
    EPHEMERAL = 1 << 6,
    /**
     * This message is an interaction response and will not trigger a webhook or bot.
     */
    LOADING = 1 << 7,
    /**
     * This message is a reply to a message that was deleted.
     */
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,

    /**
     * This message will not trigger push notifications.
     */
    SUPPRESS_NOTIFICATIONS = 1 << 12,
    
    /**
     * This message is a voice message.
     */
    IS_VOICE_MESSAGE = 1 << 13,

    /**
     * This message has a snapshot (via Message Forwarding)
     */
    HAS_SNAPSHOT = 1 << 14,

    /**
     * This message contains Components V2.
     */
    IS_COMPONENTS_V2 = 1 << 15,
}

/**
 * Message types enum
 */
export enum MessageType {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_PINNED_MESSAGE = 6,
    USER_JOIN = 7,
    GUILD_BOOST = 8,
    GUILD_BOOST_TIER_1 = 9,
    GUILD_BOOST_TIER_2 = 10,
    GUILD_BOOST_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    REPLY = 19,
    CHAT_INPUT_COMMAND = 20,
    THREAD_STARTER_MESSAGE = 21,
    GUILD_INVITE_REMINDER = 22,
    CONTEXT_MENU_COMMAND = 23,
    AUTO_MODERATION_ACTION = 24,
    ROLE_SUBSCRIPTION_PURCHASE = 25,
    INTERACTION_PREMIUM_UPSELL = 26,
    STAGE_START = 27,
    STAGE_END = 28,
    STAGE_SPEAKER = 29,
    STAGE_TOPIC = 31,
    GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
    GUILD_INCIDENT_ALERT_MODE_ENABLED = 36,
    GUILD_INCIDENT_ALERT_MODE_DISABLED = 37,
    GUILD_INCIDENT_REPORT_RAID = 38,
    GUILD_INCIDENT_REPORT_FALSE_ALARM = 39,
    PURCHASE_NOTIFICATION = 44,
    POLL_RESULT = 46,
}