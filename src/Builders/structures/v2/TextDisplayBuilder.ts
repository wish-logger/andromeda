import { ComponentV2Type, TextDisplayComponent } from '../../../../src/types/ComponentV2';

/**
 * A builder for Discord Text Display Components (Components V2).
 * Used for displaying formatted text within a container or section.
 */
export class TextDisplayBuilder {
    private _content: string;

    constructor(content: string) {
        this._content = content;
    }

    /**
     * Sets the text content of the display.
     * @param content The text content.
     * @returns The TextDisplayBuilder instance.
     */
    public setContent(content: string): this {
        this._content = content;
        return this;
    }

    /**
     * Converts the TextDisplayBuilder to a JSON-ready TextDisplayComponent object.
     * @returns The TextDisplayComponent object.
     */
    public toJSON(): TextDisplayComponent {
        return {
            type: ComponentV2Type.TEXT_DISPLAY,
            content: this._content,
        };
    }
}