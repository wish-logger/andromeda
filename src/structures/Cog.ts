import { Client } from '../client/Client';

/**
 * The base class for all cogs (modules) in the bot.
 * Cogs are used to organize commands, event listeners, and other bot functionalities.
 */
export abstract class Cog {
    /**
     * The client instance associated with this cog.
     * @type {Client}
     */
    protected client: Client;

    /**
     * Creates an instance of a Cog.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * This method is called when the cog is loaded.
     * Override this method to perform setup tasks, such as registering commands or event listeners.
     * @returns {void | Promise<void>}
     */
    public onLoad?(): void | Promise<void>;

    /**
     * This method is called when the cog is unloaded.
     * Override this method to perform cleanup tasks, such as unregistering commands or event listeners.
     * @returns {void | Promise<void>}
     */
    public onUnload?(): void | Promise<void>;
}