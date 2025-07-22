import { ComponentType } from '../../types/Component';

/**
 * Enum for button styles.
 */
export enum ButtonStyle {
    PRIMARY = 1,
    SECONDARY = 2,
    SUCCESS = 3,
    DANGER = 4,
    LINK = 5,
}

/**
 * A builder for Discord Button Components.
 * Buttons can be used as section accessories or within Action Rows in Components V2.
 */
export class ButtonBuilder {
    private _style: ButtonStyle = ButtonStyle.PRIMARY;
    private _label?: string;
    private _emoji?: { id?: string; name?: string; animated?: boolean };
    private _customId?: string;
    private _url?: string;
    private _disabled: boolean = false;

    /**
     * Sets the style of the button.
     * @param style The button style.
     * @returns The ButtonBuilder instance.
     */
    public setStyle(style: ButtonStyle): this {
        this._style = style;
        return this;
    }

    /**
     * Sets the label of the button.
     * @param label The button label.
     * @returns The ButtonBuilder instance.
     */
    public setLabel(label: string): this {
        this._label = label;
        return this;
    }

    /**
     * Sets the emoji for the button.
     * @param emoji The emoji object.
     * @returns The ButtonBuilder instance.
     */
    public setEmoji(emoji: { id?: string; name?: string; animated?: boolean }): this {
        this._emoji = emoji;
        return this;
    }

    /**
     * Sets the custom ID for the button.
     * Required for non-link buttons to identify interactions.
     * @param customId The custom ID.
     * @returns The ButtonBuilder instance.
     */
    public setCustomId(customId: string): this {
        this._customId = customId;
        return this;
    }

    /**
     * Sets the URL for a link button.
     * Only applicable for ButtonStyle.LINK.
     * @param url The URL.
     * @returns The ButtonBuilder instance.
     */
    public setURL(url: string): this {
        this._url = url;
        return this;
    }

    /**
     * Sets whether the button is disabled.
     * @param disabled Whether the button is disabled. Defaults to `false`.
     * @returns The ButtonBuilder instance.
     */
    public setDisabled(disabled: boolean): this {
        this._disabled = disabled;
        return this;
    }

    /**
     * Converts the ButtonBuilder to a JSON-ready object.
     * @returns The button component object.
     */
    public toJSON(): any {
        if (this._style === ButtonStyle.LINK && !this._url) {
            throw new Error('Link buttons must have a URL.');
        }
        if (this._style !== ButtonStyle.LINK && !this._customId) {
            throw new Error('Non-link buttons must have a custom ID.');
        }

        return {
            type: ComponentType.Button,
            style: this._style,
            label: this._label,
            emoji: this._emoji,
            custom_id: this._customId,
            url: this._url,
            disabled: this._disabled,
        };
    }
}