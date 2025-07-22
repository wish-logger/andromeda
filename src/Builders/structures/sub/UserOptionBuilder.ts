import { ApplicationCommandOptionType, ApplicationCommandOption } from '../../../types/ApplicationCommand';

/**
 * Represents a builder for a user slash command option.
 */
export class UserOptionBuilder {
    private _name: string | undefined;
    private _description: string | undefined;
    private _required: boolean | undefined;

    /**
     * Sets the name of this option.
     * @param {string} name The name (1-32 characters).
     * @returns {this} The UserOptionBuilder instance.
     */
    public setName(name: string): this {
        this._name = name;
        return this;
    }

    /**
     * Sets the description of this option.
     * @param {string} description The description (1-100 characters).
     * @returns {this} The UserOptionBuilder instance.
     */
    public setDescription(description: string): this {
        this._description = description;
        return this;
    }

    /**
     * Sets whether this option is required.
     * @param {boolean} required True if required, false otherwise.
     * @returns {this} The UserOptionBuilder instance.
     */
    public setRequired(required: boolean): this {
        this._required = required;
        return this;
    }

    /**
     * Converts this builder to a JSON object suitable for an ApplicationCommandOption.
     * @returns {ApplicationCommandOption} The option data in JSON format.
     * @throws {Error} If name or description are not set.
     */
    public toJSON(): ApplicationCommandOption {
        if (typeof this._name === 'undefined' || typeof this._description === 'undefined') {
            throw new Error('User option name and description must be set before converting to JSON.');
        }

        return {
            type: ApplicationCommandOptionType.USER,
            name: this._name,
            description: this._description,
            required: this._required,
        };
    }
} 