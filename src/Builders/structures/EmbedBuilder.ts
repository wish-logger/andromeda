import { Colors } from '../types/Colors';
import { EmbedField, EmbedFooter, EmbedImage, EmbedThumbnail, EmbedAuthor } from '../types/Embed';

/**
 * A utility class for constructing Discord embeds.
 * Provides a fluent API for setting various embed properties.
 */
export class EmbedBuilder {
    /**
     * The title of the embed. Limited to 256 characters.
     * @type {string | undefined}
     */
    public title?: string;
    /**
     * The description of the embed. Limited to 4096 characters.
     * @type {string | undefined}
     */
    public description?: string;
    /**
     * The URL of the embed. Clicking the title will navigate to this URL.
     * @type {string | undefined}
     */
    public url?: string; // New property
    /**
     * The color of the embed (hexadecimal value).
     * @type {number | undefined}
     */
    public color?: number;
    /**
     * The timestamp of the embed, typically displayed in the footer.
     * Must be an ISO 8601 timestamp string.
     * @type {string | undefined}
     */
    public timestamp?: string;
    /**
     * An array of fields for the embed. Limited to 25 fields.
     * Each field has a name (256 chars) and a value (1024 chars).
     * @type {EmbedField[]}
     */
    public fields: EmbedField[] = [];
    /**
     * The footer of the embed.
     * @type {EmbedFooter | undefined}
     */
    public footer?: EmbedFooter; // New property
    /**
     * The image of the embed.
     * @type {EmbedImage | undefined}
     */
    public image?: EmbedImage; // New property
    /**
     * The thumbnail of the embed.
     * @type {EmbedThumbnail | undefined}
     */
    public thumbnail?: EmbedThumbnail; // New property
    /**
     * The author of the embed.
     * @type {EmbedAuthor | undefined}
     */
    public author?: EmbedAuthor; // New property

    /**
     * Exposes a collection of pre-defined Discord embed colors.
     * @type {typeof Colors}
     */
    public static readonly Colors = Colors;

    /**
     * Sets the title of the embed.
     * @param {string} title The title to set. Max 256 characters.
     * @returns {this}
     */
    public setTitle(title: string): this {
        this.title = title.slice(0, 256);
        return this;
    }

    /**
     * Sets the description of the embed.
     * @param {string} description The description to set. Max 4096 characters.
     * @returns {this}
     */
    public setDescription(description: string): this {
        this.description = description.slice(0, 4096);
        return this;
    }

    /**
     * Sets the URL of the embed.
     * @param {string} url The URL to set for the embed title.
     * @returns {this}
     */
    public setURL(url: string): this {
        this.url = url;
        return this;
    }

    /**
     * Sets the color of the embed.
     * @param {number} color The color to set (hexadecimal value).
     * @returns {this}
     */
    public setColor(color: number): this {
        this.color = color;
        return this;
    }

    /**
     * Sets the timestamp of the embed.
     * @param {Date | string | number} [timestamp] The timestamp to set. Can be a Date object, ISO 8601 string, or Unix timestamp (milliseconds).
     * If no argument is provided, it defaults to the current date and time.
     * @returns {this}
     */
    public setTimestamp(timestamp?: Date | string | number): this {
        if (typeof timestamp === 'undefined') {
            this.timestamp = new Date().toISOString();
        } else if (timestamp instanceof Date) {
            this.timestamp = timestamp.toISOString();
        } else if (typeof timestamp === 'number') {
            this.timestamp = new Date(timestamp).toISOString();
        } else {
            this.timestamp = timestamp;
        }
        return this;
    }

    /**
     * Adds fields to the embed.
     * Each field's `name` is limited to 256 characters, and `value` to 1024 characters.
     * A maximum of 25 fields can be added.
     * @param {...EmbedField[]} fields The fields to add.
     * @returns {this}
     * @throws {Error} If more than 25 fields are attempted to be added.
     */
    public addFields(...fields: EmbedField[]): this {
        if (this.fields.length + fields.length > 25) {
            throw new Error('Cannot add more than 25 fields to an embed.');
        }

        for (const field of fields) {
            this.fields.push({
                name: field.name.slice(0, 256),
                value: field.value.slice(0, 1024),
                inline: field.inline ?? false,
            });
        }

        return this;
    }

    /**
     * Clears all fields from the embed.
     * @returns {this}
     */
    public clearFields(): this {
        this.fields = [];
        return this;
    }

    /**
     * Removes a field at a specific index.
     * @param {number} index The index of the field to remove.
     * @returns {this}
     */
    public spliceField(index: number): this {
        this.fields.splice(index, 1);
        return this;
    }

    /**
     * Sets the footer of the embed.
     * @param {string} text The text content of the footer. Max 2048 characters.
     * @param {string} [iconUrl] URL of the footer icon. Only supports http(s) and attachments.
     * @returns {this}
     */
    public setFooter(text: string, iconUrl?: string): this {
        this.footer = {
            text: text.slice(0, 2048),
            icon_url: iconUrl,
        };
        return this;
    }

    /**
     * Sets the author of the embed.
     * @param {string} name The name of the author. Max 256 characters.
     * @param {string} [iconUrl] URL of the author icon. Only supports http(s) and attachments.
     * @param {string} [url] URL of the author. Supports http(s).
     * @returns {this}
     */
    public setAuthor(name: string, iconUrl?: string, url?: string): this {
        this.author = {
            name: name.slice(0, 256),
            icon_url: iconUrl,
            url,
        };
        return this;
    }

    /**
     * Sets the thumbnail of the embed.
     * @param {string} url URL of the thumbnail.
     * @returns {this}
     */
    public setThumbnail(url: string): this {
        this.thumbnail = { url };
        return this;
    }

    /**
     * Sets the image of the embed.
     * @param {string} url URL of the image.
     * @returns {this}
     */
    public setImage(url: string): this {
        this.image = { url };
        return this;
    }

    /**
     * Returns the plain JSON representation of the embed, ready to be sent to Discord.
     * @returns {{ title?: string; description?: string; url?: string; color?: number; timestamp?: string; fields: EmbedField[]; footer?: EmbedFooter; image?: EmbedImage; thumbnail?: EmbedThumbnail; author?: EmbedAuthor; }}
     */
    public toJSON() {
        return {
            title: this.title,
            description: this.description,
            url: this.url,
            color: this.color,
            timestamp: this.timestamp,
            fields: this.fields,
            footer: this.footer,
            author: this.author,
            thumbnail: this.thumbnail,
            image: this.image,
        };
    }
}