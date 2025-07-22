import { ApplicationCommandOptionType, ApplicationCommandOption } from '../../../types/ApplicationCommand';

/**
 * Represents a builder for a subcommand within a slash command.
 */
export class SubcommandBuilder {
    private _name: string | undefined;
    private _description: string | undefined;
    private _options: ApplicationCommandOption[] = [];

    /**
     * Sets the name of this subcommand.
     * @param {string} name The name (1-32 characters).
     * @returns {this} The SubcommandBuilder instance.
     */
    public setName(name: string): this {
        this._name = name;
        return this;
    }

    /**
     * Sets the description of this subcommand.
     * @param {string} description The description (1-100 characters).
     * @returns {this} The SubcommandBuilder instance.
     */
    public setDescription(description: string): this {
        this._description = description;
        return this;
    }

    /**
     * Adds an option to this subcommand.
     * @param {ApplicationCommandOption} option The option to add.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addOption(option: ApplicationCommandOption): this {
        this._options.push(option);
        return this;
    }

    /**
     * Adds multiple options to this subcommand.
     * @param {ApplicationCommandOption[]} options An array of options to add.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addOptions(options: ApplicationCommandOption[]): this {
        this._options.push(...options);
        return this;
    }

    /**
     * Converts this builder to a JSON object suitable for an ApplicationCommandOption.
     * @returns {ApplicationCommandOption} The subcommand data in JSON format.
     * @throws {Error} If name or description are not set.
     */
    public toJSON(): ApplicationCommandOption {
        if (typeof this._name === 'undefined' || typeof this._description === 'undefined') {
            throw new Error('Subcommand name and description must be set before converting to JSON.');
        }

        return {
            type: ApplicationCommandOptionType.SUB_COMMAND,
            name: this._name,
            description: this._description,
            options: this._options.length > 0 ? this._options : undefined,
        };
    }
} 