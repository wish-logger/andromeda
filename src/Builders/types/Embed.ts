/**
 * Represents a single field in a Discord embed.
 */
export interface EmbedField {
    /**
     * The name of the field. Limited to 256 characters.
     * @type {string}
     */
    name: string;
    /**
     * The value of the field. Limited to 1024 characters.
     * @type {string}
     */
    value: string;
    /**
     * Whether or not this field should display inline.
     * @type {boolean}
     */
    inline?: boolean;
}

/**
 * Represents the footer of a Discord embed.
 */
export interface EmbedFooter {
    /**
     * The text content of the footer. Limited to 2048 characters.
     * @type {string}
     */
    text: string;
    /**
     * URL of the footer icon. Only supports http(s) and attachments.
     * @type {string | undefined}
     */
    icon_url?: string;
}

/**
 * Represents the image of a Discord embed.
 */
export interface EmbedImage {
    /**
     * URL of the image.
     * @type {string}
     */
    url: string;
}

/**
 * Represents the thumbnail of a Discord embed.
 */
export interface EmbedThumbnail {
    /**
     * URL of the thumbnail.
     * @type {string}
     */
    url: string;
}

/**
 * Represents the author of a Discord embed.
 */
export interface EmbedAuthor {
    /**
     * The name of the author. Limited to 256 characters.
     * @type {string}
     */
    name: string;
    /**
     * URL of the author. Supports http(s).
     * @type {string | undefined}
     */
    url?: string;
    /**
     * URL of the author icon. Only supports http(s) and attachments.
     * @type {string | undefined}
     */
    icon_url?: string;
} 