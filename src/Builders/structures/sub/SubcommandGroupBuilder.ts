import { ApplicationCommandOptionType, ApplicationCommandOption } from '../../../types/ApplicationCommand';

/**
 * Represents a builder for a subcommand group within a slash command.
 */
export class SubcommandGroupBuilder {
    private _name: string | undefined;
    private _description: string | undefined;
    private _options: ApplicationCommandOption[] = []; // Subcommand groups contain subcommands

    /**
     * Sets the name of this subcommand group.
     * @param {string} name The name (1-32 characters).
     * @returns {this} The SubcommandGroupBuilder instance.
     */
    public setName(name: string): this {
        this._name = name;
        return this;
    }

    /**
     * Sets the description of this subcommand group.
     * @param {string} description The description (1-100 characters).
     * @returns {this} The SubcommandGroupBuilder instance.
     */
    public setDescription(description: string): this {
        this._description = description;
        return this;
    }

    /**
     * Adds a subcommand to this subcommand group.
     * @param {ApplicationCommandOption} subcommand The subcommand to add (must be of type SUB_COMMAND).
     * @returns {this} The SubcommandGroupBuilder instance.
     */
    public addSubcommand(subcommand: ApplicationCommandOption): this {
        if (subcommand.type !== ApplicationCommandOptionType.SUB_COMMAND) {
            throw new Error('Only subcommands can be added to a subcommand group.');
        }
        this._options.push(subcommand);
        return this;
    }

    /**
     * Adds multiple subcommands to this subcommand group.
     * @param {ApplicationCommandOption[]} subcommands An array of subcommands (must be of type SUB_COMMAND).
     * @returns {this} The SubcommandGroupBuilder instance.
     */
    public addSubcommands(subcommands: ApplicationCommandOption[]): this {
        for (const subcommand of subcommands) {
            if (subcommand.type !== ApplicationCommandOptionType.SUB_COMMAND) {
                throw new Error('Only subcommands can be added to a subcommand group.');
            }
        }
        this._options.push(...subcommands);
        return this;
    }

    /**
     * Converts this builder to a JSON object suitable for an ApplicationCommandOption.
     * @returns {ApplicationCommandOption} The subcommand group data in JSON format.
     * @throws {Error} If name or description are not set.
     */
    public toJSON(): ApplicationCommandOption {
        if (typeof this._name === 'undefined' || typeof this._description === 'undefined') {
            throw new Error('Subcommand group name and description must be set before converting to JSON.');
        }

        return {
            type: ApplicationCommandOptionType.SUB_COMMAND_GROUP,
            name: this._name,
            description: this._description,
            options: this._options.length > 0 ? this._options : undefined,
        };
    }
} 