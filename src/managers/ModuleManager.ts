import { Client } from '../client/Client';
import { SlashCommandDefinition, RegisteredSlashCommand } from '../types/SlashCommand';

/**
 * Manages the loading, unloading, and lifecycle of commands.
 */
export class ModuleManager {
    private client: Client;
    private registeredCommands: Map<string, RegisteredSlashCommand> = new Map();

    /**
     * Creates a new ModuleManager instance.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;

        this.client.on('applicationCommandCreate', async (interaction) => {
            const command = this.registeredCommands.get(interaction.data.name);
            if (command && command.execute) {
                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(`Error while executing the command ${command.name}:`, error);
                }
            }
        });
    }

    /**
     * Loads a slash command from a given path.
     * @param {string} name The name of the command.
     * @param {string} path The absolute path to the command file.
     * @returns {Promise<RegisteredSlashCommand>} The loaded and registered command.
     * @throws {Error} If the command is already loaded or cannot be loaded.
     */
    public async loadCommand(name: string, path: string): Promise<RegisteredSlashCommand> {
        if (this.registeredCommands.has(name)) {
            throw new Error(`Command "${name}" is already loaded.`);
        }

        try {
            const resolvedPath = require('path').resolve(process.cwd(), path);
            const commandModule: SlashCommandDefinition = (await import(resolvedPath));

            if (!commandModule || !commandModule.data || typeof commandModule.execute !== 'function') {
                throw new Error(`File at "${path}" does not export a valid command module with 'data' and 'execute' properties.`);
            }

            const registeredCommandData = await this.client.registerGlobalCommand(commandModule.data);
            
            const registeredCommand: RegisteredSlashCommand = {
                ...registeredCommandData,
                execute: commandModule.execute,
            };
            
            this.registeredCommands.set(registeredCommand.name, registeredCommand);

            return registeredCommand;
        } catch (error: any) {
            console.error(`Failed to load command "${name}":`, error.message);
            throw error;
        }
    }

    /**
     * Unloads a slash command.
     * @param {string} name The name of the command to unload.
     * @returns {Promise<void>}
     * @throws {Error} If the command is not loaded.
     */
    public async unloadCommand(name: string): Promise<void> {
        const registeredCommand = this.registeredCommands.get(name);
        if (!registeredCommand) {
            throw new Error(`Command "${name}" is not loaded.`);
        }

        if (registeredCommand.id) {
            await this.client.deleteGlobalCommand(registeredCommand.id);
        }

        this.registeredCommands.delete(name);
    }

    /**
     * Gets a loaded command by its name.
     * @param {string} name The name of the command.\
     * @returns {RegisteredSlashCommand | undefined} The command instance, or undefined if not found.
     */
    public getCommand(name: string): RegisteredSlashCommand | undefined {
        return this.registeredCommands.get(name);
    }
}