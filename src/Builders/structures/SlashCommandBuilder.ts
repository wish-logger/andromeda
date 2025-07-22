import { ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOption, ApplicationCommandData, ApplicationCommandOptionChoice } from '../../types/ApplicationCommand';
import { LocalizationMap } from '../types/Localization';
import { PermissionFlagsBits } from '../../types/Permissions';
import { Interaction } from '../../structures/Interaction';
import { IntegerOptionBuilder } from './sub/IntegerOptionBuilder';
import { UserOptionBuilder } from './sub/UserOptionBuilder';
import { StringOptionBuilder } from './sub/StringOptionBuilder';
import { BooleanOptionBuilder } from './sub/BooleanOptionBuilder';
import { ChannelOptionBuilder } from './sub/ChannelOptionBuilder';
import { RoleOptionBuilder } from './sub/RoleOptionBuilder';
import { MentionableOptionBuilder } from './sub/MentionableOptionBuilder';
import { NumberOptionBuilder } from './sub/NumberOptionBuilder';
import { SubcommandBuilder } from './sub/SubcommandBuilder';
import { SubcommandGroupBuilder } from './sub/SubcommandGroupBuilder';

/**
 * Represents a builder for a Discord Slash Command.
 */
export class SlashCommandBuilder {
    private _name: string | undefined;
    private _description: string | undefined;
    private _type: ApplicationCommandType;
    private _options: ApplicationCommandOption[] = [];
    private _defaultPermission: boolean | undefined = undefined;
    private _defaultMemberPermissions: bigint | undefined = undefined;
    private _dmPermission: boolean | undefined = undefined;
    private _nameLocalizations: LocalizationMap | undefined = undefined;
    private _descriptionLocalizations: LocalizationMap | undefined = undefined;

    /**
     * Exposes a collection of pre-defined Discord permission flags.
     * @type {typeof PermissionFlagsBits}
     */
    public static readonly Permissions = PermissionFlagsBits;

    /**
     * Creates an instance of SlashCommandBuilder.
     * @param {string} [name] The name of the slash command. Optional, can be set with setName().
     * @param {string} [description] The description of the slash command. Optional, can be set with setDescription().
     */
    constructor(name?: string, description?: string) {
        this._name = name;
        this._description = description;
        this._type = ApplicationCommandType.CHAT_INPUT;
    }

    /**
     * Sets the name of the slash command.
     * @param {string} name The name (1-32 characters).
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setName(name: string): this {
        this._name = name;
        return this;
    }

    /**
     * Sets the description of the slash command.
     * @param {string} description The description (1-100 characters).
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setDescription(description: string): this {
        this._description = description;
        return this;
    }

    /**
     * Sets the type of the application command.
     * For slash commands, this is typically ApplicationCommandType.ChatInput.
     * @param {ApplicationCommandType} type The type of the command.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setType(type: ApplicationCommandType): this {
        this._type = type;
        return this;
    }

    /**
     * Sets the default permissions for the command.
     * @param {boolean | undefined} permission True if enabled by default, false otherwise, or undefined to omit.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setDefaultPermission(permission: boolean | undefined): this {
        this._defaultPermission = permission;
        return this;
    }

    /**
     * Sets the default member permissions for the command.
     * @param {bigint | undefined} permissions The permissions bitfield as a BigInt, or undefined to omit.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setDefaultMemberPermissions(permissions: bigint | undefined): this {
        this._defaultMemberPermissions = permissions;
        return this;
    }

    /**
     * Sets whether the command is available in DMs.
     * @param {boolean | undefined} permission True if available in DMs, false otherwise, or undefined to omit.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setDMPermission(permission: boolean | undefined): this {
        this._dmPermission = permission;
        return this;
    }

    /**
     * Sets name localizations for the command.
     * @param {LocalizationMap | undefined} localizations A map of locale to localized name.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setNameLocalizations(localizations: LocalizationMap | undefined): this {
        this._nameLocalizations = localizations;
        return this;
    }

    /**
     * Sets description localizations for the command.
     * @param {LocalizationMap | undefined} localizations A map of locale to localized description.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public setDescriptionLocalizations(localizations: LocalizationMap | undefined): this {
        this._descriptionLocalizations = localizations;
        return this;
    }

    /**
     * Adds a string option to the slash command.
     * @param {(option: StringOptionBuilder) => StringOptionBuilder} input A function that receives a StringOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addStringOption(input: (option: StringOptionBuilder) => StringOptionBuilder): this {
        const optionBuilder = new StringOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds an integer option to the slash command.
     * @param {(option: IntegerOptionBuilder) => IntegerOptionBuilder} input A function that receives an IntegerOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addIntegerOption(input: (option: IntegerOptionBuilder) => IntegerOptionBuilder): this {
        const optionBuilder = new IntegerOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a boolean option to the slash command.
     * @param {(option: BooleanOptionBuilder) => BooleanOptionBuilder} input A function that receives a BooleanOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addBooleanOption(input: (option: BooleanOptionBuilder) => BooleanOptionBuilder): this {
        const optionBuilder = new BooleanOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a user option to the slash command.
     * @param {(option: UserOptionBuilder) => UserOptionBuilder} input A function that receives a UserOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addUserOption(input: (option: UserOptionBuilder) => UserOptionBuilder): this {
        const optionBuilder = new UserOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a channel option to the slash command.
     * @param {(option: ChannelOptionBuilder) => ChannelOptionBuilder} input A function that receives a ChannelOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addChannelOption(input: (option: ChannelOptionBuilder) => ChannelOptionBuilder): this {
        const optionBuilder = new ChannelOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a role option to the slash command.
     * @param {(option: RoleOptionBuilder) => RoleOptionBuilder} input A function that receives a RoleOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addRoleOption(input: (option: RoleOptionBuilder) => RoleOptionBuilder): this {
        const optionBuilder = new RoleOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a mentionable option to the slash command.
     * @param {(option: MentionableOptionBuilder) => MentionableOptionBuilder} input A function that receives a MentionableOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addMentionableOption(input: (option: MentionableOptionBuilder) => MentionableOptionBuilder): this {
        const optionBuilder = new MentionableOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a number (float) option to the slash command.
     * @param {(option: NumberOptionBuilder) => NumberOptionBuilder} input A function that receives a NumberOptionBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addNumberOption(input: (option: NumberOptionBuilder) => NumberOptionBuilder): this {
        const optionBuilder = new NumberOptionBuilder();
        this._options.push(input(optionBuilder).toJSON());
        return this;
    }

    /**
     * Adds a subcommand to the slash command.
     * @param {(subcommand: SubcommandBuilder) => SubcommandBuilder} input A function that receives a SubcommandBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addSubcommand(input: (subcommand: SubcommandBuilder) => SubcommandBuilder): this {
        const subcommandBuilder = new SubcommandBuilder();
        this._options.push(input(subcommandBuilder).toJSON());
        return this;
    }

    /**
     * Adds a subcommand group to the slash command.
     * @param {(group: SubcommandGroupBuilder) => SubcommandGroupBuilder} input A function that receives a SubcommandGroupBuilder.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addSubcommandGroup(input: (group: SubcommandGroupBuilder) => SubcommandGroupBuilder): this {
        const groupBuilder = new SubcommandGroupBuilder();
        this._options.push(input(groupBuilder).toJSON());
        return this;
    }

    /**
     * Converts the builder to a JSON object suitable for the Discord API.
     * @returns {ApplicationCommandData} The command data in JSON format.
     * @throws {Error} If name or description are not set.
     */
    public toJSON(): ApplicationCommandData {
        if (typeof this._name === 'undefined' || typeof this._description === 'undefined') {
            throw new Error('Slash command name and description must be set before converting to JSON.');
        }

        return {
            name: this._name,
            description: this._description,
            type: this._type,
            options: this._options.length > 0 ? this._options : undefined,
            default_permission: this._defaultPermission,
            default_member_permissions: this._defaultMemberPermissions?.toString(),
            dm_permission: this._dmPermission,
            name_localizations: this._nameLocalizations,
            description_localizations: this._descriptionLocalizations,
        };
    }
}

export { Interaction };