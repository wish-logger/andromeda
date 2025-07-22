import { ApplicationCommandOptionType, ApplicationCommandOption } from '../../../types/ApplicationCommand';
import { ChannelType } from '../../../structures/Channel';

/**
 * Represents a builder for a channel slash command option.
 */
export class ChannelOptionBuilder {
    private _name: string | undefined;
    private _description: string | undefined;
    private _required: boolean | undefined;
    private _channelTypes: ChannelType[] | undefined;

    /**
     * Sets the name of this option.
     * @param {string} name The name (1-32 characters).
     * @returns {this} The ChannelOptionBuilder instance.
     */
    public setName(name: string): this {
        this._name = name;
        return this;
    }

    /**
     * Sets the description of this option.
     * @param {string} description The description (1-100 characters).
     * @returns {this} The ChannelOptionBuilder instance.
     */
    public setDescription(description: string): this {
        this._description = description;
        return this;
    }

    /**
     * Sets whether this option is required.
     * @param {boolean} required True if required, false otherwise.
     * @returns {this} The ChannelOptionBuilder instance.
     */
    public setRequired(required: boolean): this {
        this._required = required;
        return this;
    }

    /**
     * Adds allowed channel types for this option.
     * @param {...ChannelType[]} types The channel types to allow.
     * @returns {this} The ChannelOptionBuilder instance.
     */
    public addChannelTypes(...types: ChannelType[]): this {
        if (!this._channelTypes) {
            this._channelTypes = [];
        }
        this._channelTypes.push(...types);
        return this;
    }

    /**
     * Converts this builder to a JSON object suitable for an ApplicationCommandOption.
     * @returns {ApplicationCommandOption} The option data in JSON format.
     * @throws {Error} If name or description are not set.
     */
    public toJSON(): ApplicationCommandOption {
        if (typeof this._name === 'undefined' || typeof this._description === 'undefined') {
            throw new Error('Channel option name and description must be set before converting to JSON.');
        }

        return {
            type: ApplicationCommandOptionType.CHANNEL,
            name: this._name,
            description: this._description,
            required: this._required,
            channel_types: this._channelTypes,
        };
    }
} 