import { ApplicationCommandOptionType } from './ApplicationCommand';

/**
 * Represents a Discord interaction.
 */
export interface Interaction {
    id: string;
    application_id: string;
    type: InteractionType;
    data?: InteractionData;
    guild_id?: string;
    channel_id?: string;
    member?: any; // TODO: Create Member structure
    user?: any; // TODO: Create User structure
    token: string;
    version: number;
    message?: any; // TODO: Create Message structure
}

/**
 * Enum for interaction types.
 */
export enum InteractionType {
    PING = 1,
    APPLICATION_COMMAND = 2,
    MESSAGE_COMPONENT = 3,
    APPLICATION_COMMAND_AUTOCOMPLETE = 4,
    MODAL_SUBMIT = 5,
}

/**
 * Represents the data associated with an interaction.
 */
export interface InteractionData {
    id: string;
    name: string;
    type: ApplicationCommandOptionType;
    resolved?: any; // TODO: Define resolved data structure
    options?: InteractionDataOption[];
    custom_id?: string; // For message components
    component_type?: number; // For message components
    values?: string[]; // For select menus
}

/**
 * Represents an option within interaction data.
 */
export interface InteractionDataOption {
    name: string;
    type: ApplicationCommandOptionType;
    value?: any;
    options?: InteractionDataOption[];
}
