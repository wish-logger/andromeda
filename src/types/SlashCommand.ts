import { ApplicationCommandData, ApplicationCommand, ApplicationCommandOption } from './ApplicationCommand';
import { Interaction } from '../structures/Interaction';

/**
 * Represents the structure of a slash command module to be loaded by the ModuleManager.
 * This allows defining command data using SlashCommandBuilder and an execute function.
 */
export interface SlashCommandDefinition {
    /**
     * The data for the slash command, typically built using SlashCommandBuilder.
     * @type {ApplicationCommandData}
     */
    data: ApplicationCommandData;
    /**
     * The function to execute when this slash command is invoked.
     * @param {Interaction} interaction The interaction object.
     * @returns {Promise<void> | void}
     */
    execute: (interaction: Interaction) => Promise<void> | void;
    /**
     * An optional function to handle component interactions (e.g., button clicks) for this command.
     * @param {Interaction} interaction The interaction object.
     * @returns {Promise<void> | void}
     */
    handleComponent?: (interaction: Interaction) => Promise<void> | void;
}

/**
 * Represents a registered slash command with its execute function.
 */
export interface RegisteredSlashCommand extends ApplicationCommand {
    /**
     * The function to execute when this slash command is invoked.
     * @param {Interaction} interaction The interaction object.
     * @returns {Promise<void> | void}
     */
    execute: (interaction: Interaction) => Promise<void> | void;
    /**
     * An optional function to handle component interactions (e.g., button clicks) for this command.
     * @param {Interaction} interaction The interaction object.
     * @returns {Promise<void> | void}
     */
    handleComponent?: (interaction: Interaction) => Promise<void> | void;
}