import { Client } from '../client/Client';
import { Cog } from '../structures/Cog';

/**
 * Manages the loading, unloading, and lifecycle of cogs (modules).
 */
export class CogManager {
    private client: Client;
    private cogs: Map<string, Cog> = new Map();

    /**
     * Creates a new CogManager instance.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Loads a cog from a given path.
     * @param {string} name The name of the cog.
     * @param {string} path The absolute path to the cog file.
     * @returns {Promise<Cog>} The loaded cog instance.
     * @throws {Error} If the cog is already loaded or cannot be loaded.
     */
    public async loadCog(name: string, path: string): Promise<Cog> {
        if (this.cogs.has(name)) {
            throw new Error(`Cog "${name}" is already loaded.`);
        }

        try {
            // Dynamically import the cog class
            const CogClass = (await import(path)).default;
            const cogInstance: Cog = new CogClass(this.client);

            if (!(cogInstance instanceof Cog)) {
                throw new Error(`File at "${path}" does not export a valid Cog class.`);
            }

            this.cogs.set(name, cogInstance);
            if (cogInstance.onLoad) {
                await cogInstance.onLoad();
            }
            console.log(`Cog "${name}" loaded successfully.`);
            return cogInstance;
        } catch (error: any) {
            console.error(`Failed to load cog "${name}":`, error.message);
            throw error;
        }
    }

    /**
     * Unloads a cog.
     * @param {string} name The name of the cog to unload.
     * @returns {Promise<void>}
     * @throws {Error} If the cog is not loaded.
     */
    public async unloadCog(name: string): Promise<void> {
        const cogInstance = this.cogs.get(name);
        if (!cogInstance) {
            throw new Error(`Cog "${name}" is not loaded.`);
        }

        if (cogInstance.onUnload) {
            await cogInstance.onUnload();
        }
        this.cogs.delete(name);
        console.log(`Cog "${name}" unloaded successfully.`);
    }

    /**
     * Gets a loaded cog by its name.
     * @param {string} name The name of the cog.
     * @returns {Cog | undefined} The cog instance, or undefined if not found.
     */
    public getCog(name: string): Cog | undefined {
        return this.cogs.get(name);
    }
}