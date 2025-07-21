import { ApplicationCommandData, ApplicationCommand } from './ApplicationCommand';
import { Interaction } from '../structures/Interaction';

/**
 * Represents a slash command definition within a Module.
 * This is the structure you will use to define commands in your modules.
 */
export interface SlashCommandDefinition extends ApplicationCommandData {
    /**
     * The function to execute when this slash command is invoked.
     * @param {Interaction} interaction The interaction object.
     * @returns {Promise<void> | void}
     */
    execute: (interaction: Interaction) => Promise<void> | void;
}

/**
 * Represents a slash command that has been registered with Discord.
 * This includes the 'id' assigned by Discord.
 */
export interface RegisteredSlashCommand extends ApplicationCommand {
    /**
     * The function to execute when this slash command is invoked.
     * @param {Interaction} interaction The interaction object.
     * @returns {Promise<void> | void}
     */
    execute: (interaction: Interaction) => Promise<void> | void;
}