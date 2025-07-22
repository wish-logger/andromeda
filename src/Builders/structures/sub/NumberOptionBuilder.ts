import { ApplicationCommandOptionType, ApplicationCommandOption, ApplicationCommandOptionChoice } from '../../../types/ApplicationCommand';

/**
 * Represents a builder for a number (float/double) slash command option.
 */
export class NumberOptionBuilder {
    private _name: string | undefined;
    private _description: string | undefined;
    private _required: boolean | undefined;
    private _choices: ApplicationCommandOptionChoice[] | undefined;
    private _minValue: number | undefined;
    private _maxValue: number | undefined;

    /**
     * Sets the name of this option.
     * @param {string} name The name (1-32 characters).
     * @returns {this} The NumberOptionBuilder instance.
     */
    public setName(name: string): this {
        this._name = name;
        return this;
    }

    /**
     * Sets the description of this option.
     * @param {string} description The description (1-100 characters).
     * @returns {this} The NumberOptionBuilder instance.
     */
    public setDescription(description: string): this {
        this._description = description;
        return this;
    }

    /**
     * Sets whether this option is required.
     * @param {boolean} required True if required, false otherwise.
     * @returns {this} The NumberOptionBuilder instance.
     */
    public setRequired(required: boolean): this {
        this._required = required;
        return this;
    }

    /**
     * Adds a choice for this option.
     * @param {string} name The display name of the choice.
     * @param {number} value The number (float) value of the choice.
     * @returns {this} The NumberOptionBuilder instance.
     */
    public addChoice(name: string, value: number): this {
        if (!this._choices) {
            this._choices = [];
        }
        this._choices.push({ name, value });
        return this;
    }

    /**
     * Adds multiple choices for this option.
     * @param {ApplicationCommandOptionChoice[]} choices An array of choices.
     * @returns {this} The NumberOptionBuilder instance.
     */
    public addChoices(choices: ApplicationCommandOptionChoice[]): this {
        if (!this._choices) {
            this._choices = [];
        }
        this._choices.push(...choices);
        return this;
    }

    /**
     * Sets the minimum value permitted for this option.
     * @param {number} value The minimum value.
     * @returns {this} The NumberOptionBuilder instance.
     */
    public setMinValue(value: number): this {
        this._minValue = value;
        return this;
    }

    /**
     * Sets the maximum value permitted for this option.
     * @param {number} value The maximum value.
     * @returns {this} The NumberOptionBuilder instance.
     */
    public setMaxValue(value: number): this {
        this._maxValue = value;
        return this;
    }

    /**
     * Converts this builder to a JSON object suitable for an ApplicationCommandOption.
     * @returns {ApplicationCommandOption} The option data in JSON format.
     * @throws {Error} If name or description are not set.
     */
    public toJSON(): ApplicationCommandOption {
        if (typeof this._name === 'undefined' || typeof this._description === 'undefined') {
            throw new Error('Number option name and description must be set before converting to JSON.');
        }

        return {
            type: ApplicationCommandOptionType.NUMBER,
            name: this._name,
            description: this._description,
            required: this._required,
            choices: this._choices,
            min_value: this._minValue,
            max_value: this._maxValue,
        };
    }
} 