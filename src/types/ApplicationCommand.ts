/**
 * Represents an application command (slash command).
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
