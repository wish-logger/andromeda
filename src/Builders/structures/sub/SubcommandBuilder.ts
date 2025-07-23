import { ApplicationCommandOptionType, ApplicationCommandOption } from '../../../types/ApplicationCommand';
import { IntegerOptionBuilder } from './IntegerOptionBuilder';
import { UserOptionBuilder } from './UserOptionBuilder';
import { StringOptionBuilder } from './StringOptionBuilder';
import { BooleanOptionBuilder } from './BooleanOptionBuilder';
import { ChannelOptionBuilder } from './ChannelOptionBuilder';
import { RoleOptionBuilder } from './RoleOptionBuilder';
import { MentionableOptionBuilder } from './MentionableOptionBuilder';
import { NumberOptionBuilder } from './NumberOptionBuilder';

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
     * Adds a string option to the subcommand.
     * @param {(option: StringOptionBuilder) => StringOptionBuilder} input A function that receives a StringOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addStringOption(input: (option: StringOptionBuilder) => StringOptionBuilder): this {
        const optionBuilder = new StringOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds an integer option to the subcommand.
     * @param {(option: IntegerOptionBuilder) => IntegerOptionBuilder} input A function that receives an IntegerOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addIntegerOption(input: (option: IntegerOptionBuilder) => IntegerOptionBuilder): this {
        const optionBuilder = new IntegerOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a boolean option to the subcommand.
     * @param {(option: BooleanOptionBuilder) => BooleanOptionBuilder} input A function that receives a BooleanOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addBooleanOption(input: (option: BooleanOptionBuilder) => BooleanOptionBuilder): this {
        const optionBuilder = new BooleanOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a user option to the subcommand.
     * @param {(option: UserOptionBuilder) => UserOptionBuilder} input A function that receives a UserOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addUserOption(input: (option: UserOptionBuilder) => UserOptionBuilder): this {
        const optionBuilder = new UserOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a channel option to the subcommand.
     * @param {(option: ChannelOptionBuilder) => ChannelOptionBuilder} input A function that receives a ChannelOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addChannelOption(input: (option: ChannelOptionBuilder) => ChannelOptionBuilder): this {
        const optionBuilder = new ChannelOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a role option to the subcommand.
     * @param {(option: RoleOptionBuilder) => RoleOptionBuilder} input A function that receives a RoleOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addRoleOption(input: (option: RoleOptionBuilder) => RoleOptionBuilder): this {
        const optionBuilder = new RoleOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a mentionable option to the subcommand.
     * @param {(option: MentionableOptionBuilder) => MentionableOptionBuilder} input A function that receives a MentionableOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addMentionableOption(input: (option: MentionableOptionBuilder) => MentionableOptionBuilder): this {
        const optionBuilder = new MentionableOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a number (float) option to the subcommand.
     * @param {(option: NumberOptionBuilder) => NumberOptionBuilder} input A function that receives a NumberOptionBuilder.
     * @returns {this} The SubcommandBuilder instance.
     */
    public addNumberOption(input: (option: NumberOptionBuilder) => NumberOptionBuilder): this {
        const optionBuilder = new NumberOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
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