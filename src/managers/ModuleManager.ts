import { Client } from '../client/Client';
import { Module } from '../structures/Module';
import { ApplicationCommandData, ApplicationCommandType } from '../types/ApplicationCommand';
import { RegisteredSlashCommand } from '../types/SlashCommand';

/**
 * Manages the loading, unloading, and lifecycle of modules.
 */
export class ModuleManager {
    private client: Client;
    private modules: Map<string, Module> = new Map();
    private registeredCommands: Map<string, RegisteredSlashCommand> = new Map();

    /**
     * Creates a new ModuleManager instance.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;

        // Listen for applicationCommandCreate event to execute commands
        this.client.on('applicationCommandCreate', async (interaction) => {
            const command = this.registeredCommands.get(interaction.data.name);
            if (command && command.execute) {
                try {
                    await command.execute(interaction);
                } catch (error) {
                    console.error(`Error executing command ${command.name}:`, error);
                    // Optionally reply with an error message
                    await interaction.reply('An error occurred while executing this command.');
                }
            }
        });
    }

    /**
     * Loads a module from a given path.
     * @param {string} name The name of the module.
     * @param {string} path The absolute path to the module file.
     * @returns {Promise<Module>} The loaded module instance.
     * @throws {Error} If the module is already loaded or cannot be loaded.
     */
    public async loadModule(name: string, path: string): Promise<Module> {
        if (this.modules.has(name)) {
            throw new Error(`Module "${name}" is already loaded.`);
        }

        try {
            // Dynamically import the module class using an absolute path
            const resolvedPath = require('path').resolve(process.cwd(), path);
            const ModuleClass = (await import(resolvedPath)).default;
            const moduleInstance: Module = new ModuleClass(this.client);

            if (!(moduleInstance instanceof Module)) {
                throw new Error(`File at "${path}" does not export a valid Module class.`);
            }

            this.modules.set(name, moduleInstance);

            // Register slash commands from the module
            for (const commandDefinition of moduleInstance.slashCommands) {
                const commandToRegister = {
                    name: commandDefinition.name,
                    description: commandDefinition.description,
                    options: commandDefinition.options,
                    default_permission: commandDefinition.default_permission,
                    type: commandDefinition.type ?? ApplicationCommandType.CHAT_INPUT,
                } as ApplicationCommandData;
                const registeredCommandData = await this.client.registerGlobalCommand(commandToRegister);
                const registeredCommand: RegisteredSlashCommand = {
                    ...registeredCommandData,
                    execute: commandDefinition.execute,
                };
                this.registeredCommands.set(registeredCommand.name, registeredCommand);
            }

            if (moduleInstance.onLoad) {
                await moduleInstance.onLoad();
            }
            return moduleInstance;
        } catch (error: any) {
            console.error(`Failed to load module "${name}":`, error.message);
            throw error;
        }
    }

    /**
     * Unloads a module.
     * @param {string} name The name of the module to unload.
     * @returns {Promise<void>}
     * @throws {Error} If the module is not loaded.
     */
    public async unloadModule(name: string): Promise<void> {
        const moduleInstance = this.modules.get(name);
        if (!moduleInstance) {
            throw new Error(`Module "${name}" is not loaded.`);
        }

        // Unregister slash commands from the module
        for (const command of moduleInstance.slashCommands) {
            const registeredCommand = this.registeredCommands.get(command.name);
            if (registeredCommand && registeredCommand.id) {
                await this.client.deleteGlobalCommand(registeredCommand.id);
                this.registeredCommands.delete(command.name);
            }
        }

        if (moduleInstance.onUnload) {
            await moduleInstance.onUnload();
        }
        this.modules.delete(name);
    }

    /**
     * Gets a loaded module by its name.
     * @param {string} name The name of the module.\
     * @returns {Module | undefined} The module instance, or undefined if not found.
     */
    public getModule(name: string): Module | undefined {
        return this.modules.get(name);
    }
}
