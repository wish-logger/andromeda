import { ApplicationCommandOptionType, ApplicationCommandType } from './ApplicationCommand';
import { Member } from '../structures/Member'
import { User } from '../structures/User'
import { Message } from '../structures/Message'
import { Channel } from '../structures/Channel';
import { Role } from '../structures/Role';

/**
 * Represents a Discord interaction.
 */
export interface Interaction {
    id: string;
    application_id: string;
    type: InteractionType;
    data?: ApplicationCommandInteractionData;
    guild_id?: string;
    channel_id?: string;
    member?: Member;
    user: User;
    token: string;
    version: number;
    message?: Message;
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
 * Represents the data associated with an Application Command interaction.
 * This applies to CHAT_INPUT, USER, and MESSAGE command types.
 */
export interface ApplicationCommandInteractionData {
    id: string;
    name: string;
    type: ApplicationCommandType;
    resolved?: ResolvedData;
    options?: ApplicationCommandInteractionDataOption[];
    guild_id?: string;
    target_id?: string; // For USER and MESSAGE commands
}

/**
 * Represents an option within Application Command interaction data.
 */
export interface ApplicationCommandInteractionDataOption {
    name: string;
    type: ApplicationCommandOptionType;
    value?: string | number | boolean;
    focused?: boolean;
    options?: ApplicationCommandInteractionDataOption[]; // subcommands/groups
}

/**
 * Represents resolved data for an Application Command interaction.
 * Contains full objects for users, members, roles, channels, messages, etc.
 */
export interface ResolvedData {
    users?: { [id: string]: User };
    members?: { [id: string]: Omit<Member, 'user' | 'guildId' | 'client'> & { user: User } };
    roles?: { [id: string]: Role };
    channels?: { [id: string]: Channel };
    messages?: { [id: string]: Message };
    // Attachments will be added later (if needed)
}