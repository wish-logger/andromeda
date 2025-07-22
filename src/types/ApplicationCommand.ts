import { LocalizationMap } from '../Builders/types/Localization';

/**
 * Represents an application command (slash command) data for registration.
 * This interface is used when sending command data to Discord.
 */
export interface ApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    default_permission?: boolean;
    default_member_permissions?: string;
    dm_permission?: boolean;
    name_localizations?: LocalizationMap;
    description_localizations?: LocalizationMap;
    type?: ApplicationCommandType;
}

/**
 * Represents an application command (slash command) as returned by Discord.
 * This interface includes the 'id' assigned by Discord.
 */
export interface ApplicationCommand {
    id: string;
    application_id: string;
    guild_id?: string;
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    default_permission?: boolean;
    version: string;
    type: ApplicationCommandType;
}

/**
 * Represents an option for an application command.
 */
export interface ApplicationCommandOption {
    type: ApplicationCommandOptionType;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOptionChoice[];
    options?: ApplicationCommandOption[];
}

/**
 * Represents a choice for an application command option.
 */
export interface ApplicationCommandOptionChoice {
    name: string;
    value: string | number;
}

/**
 * Enum for application command types.
 */
export enum ApplicationCommandType {
    CHAT_INPUT = 1, // Slash commands
    USER = 2,       // User context menus
    MESSAGE = 3,    // Message context menus
}

/**
 * Enum for application command option types.
 */
export enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
}