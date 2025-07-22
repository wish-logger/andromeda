import { ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandOption, ApplicationCommandData, ApplicationCommandOptionChoice } from '../../types/ApplicationCommand';
import { LocalizationMap } from '../types/Localization';
import { PermissionFlagsBits } from '../../types/Permissions';
import { Interaction } from '../../structures/Interaction';

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
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @param {ApplicationCommandOptionChoice[]} [option.choices] A list of choices for the option.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addStringOption(option: { name: string; description: string; required?: boolean; choices?: ApplicationCommandOptionChoice[] }): this {
        this._options.push({
            type: ApplicationCommandOptionType.STRING,
            name: option.name,
            description: option.description,
            required: option.required,
            choices: option.choices,
        });
        return this;
    }

    /**
     * Adds an integer option to the slash command.
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @param {ApplicationCommandOptionChoice[]} [option.choices] A list of choices for the option.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addIntegerOption(option: { name: string; description: string; required?: boolean; choices?: ApplicationCommandOptionChoice[] }): this {
        this._options.push({
            type: ApplicationCommandOptionType.INTEGER,
            name: option.name,
            description: option.description,
            required: option.required,
            choices: option.choices,
        });
        return this;
    }

    /**
     * Adds a boolean option to the slash command.
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addBooleanOption(option: { name: string; description: string; required?: boolean }): this {
        this._options.push({
            type: ApplicationCommandOptionType.BOOLEAN,
            name: option.name,
            description: option.description,
            required: option.required,
        });
        return this;
    }

    /**
     * Adds a user option to the slash command.
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addUserOption(option: { name: string; description: string; required?: boolean }): this {
        this._options.push({
            type: ApplicationCommandOptionType.USER,
            name: option.name,
            description: option.description,
            required: option.required,
        });
        return this;
    }

    /**
     * Adds a channel option to the slash command.
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addChannelOption(option: { name: string; description: string; required?: boolean }): this {
        this._options.push({
            type: ApplicationCommandOptionType.CHANNEL,
            name: option.name,
            description: option.description,
            required: option.required,
        });
        return this;
    }

    /**
     * Adds a role option to the slash command.
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addRoleOption(option: { name: string; description: string; required?: boolean }): this {
        this._options.push({
            type: ApplicationCommandOptionType.ROLE,
            name: option.name,
            description: option.description,
            required: option.required,
        });
        return this;
    }

    /**
     * Adds a mentionable option to the slash command.
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addMentionableOption(option: { name: string; description: string; required?: boolean }): this {
        this._options.push({
            type: ApplicationCommandOptionType.MENTIONABLE,
            name: option.name,
            description: option.description,
            required: option.required,
        });
        return this;
    }

    /**
     * Adds a number (float) option to the slash command.
     * @param {object} option The option to add.
     * @param {string} option.name The name of the option.
     * @param {string} option.description The description of the option.
     * @param {boolean} [option.required] Whether the option is required. Defaults to `false`.
     * @param {ApplicationCommandOptionChoice[]} [option.choices] A list of choices for the option.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addNumberOption(option: { name: string; description: string; required?: boolean; choices?: ApplicationCommandOptionChoice[] }): this {
        this._options.push({
            type: ApplicationCommandOptionType.NUMBER,
            name: option.name,
            description: option.description,
            required: option.required,
            choices: option.choices,
        });
        return this;
    }

    /**
     * Adds a subcommand to the slash command.
     * Subcommands can have their own options.
     * @param {object} option The subcommand to add.
     * @param {string} option.name The name of the subcommand.
     * @param {string} option.description The description of the subcommand.
     * @param {ApplicationCommandOption[]} [option.options] Nested options for this subcommand.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addSubcommand(option: { name: string; description: string; options?: ApplicationCommandOption[] }): this {
        this._options.push({
            type: ApplicationCommandOptionType.SUB_COMMAND,
            name: option.name,
            description: option.description,
            options: option.options,
        });
        return this;
    }

    /**
     * Adds a subcommand group to the slash command.
     * Subcommand groups can contain subcommands, which can then have their own options.
     * @param {object} option The subcommand group to add.
     * @param {string} option.name The name of the subcommand group.
     * @param {string} option.description The description of the subcommand group.
     * @param {ApplicationCommandOption[]} [option.options] Subcommands within this group.
     * @returns {this} The SlashCommandBuilder instance.
     */
    public addSubcommandGroup(option: { name: string; description: string; options?: ApplicationCommandOption[] }): this {
        this._options.push({
            type: ApplicationCommandOptionType.SUB_COMMAND_GROUP,
            name: option.name,
            description: option.description,
            options: option.options,
        });
        return this;
    }

    /**
     * Converts the builder to a JSON object suitable for the Discord API.
     * @returns {ApplicationCommandData} The command data in JSON format.
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