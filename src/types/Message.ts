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
     * This message contains Components V2.
     */
    IS_COMPONENTS_V2 = 1 << 14,
}
