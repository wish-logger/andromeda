import { Client } from '../client/Client';

/**
 * The base class for all modules in the bot.
 * Modules are used to organize commands, event listeners, and other bot functionalities.
 */
export abstract class Module {
    /**
     * The client instance associated with this module.
     * @type {Client}
     */
    protected client: Client;

    /**
     * Creates an instance of a Module.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
    }

    /**
     * Registers an event listener for a client event.
     * @param {string} eventName The name of the event to listen for.
     * @param {Function} listener The function to call when the event is emitted.
     */
    protected addListener(eventName: string, listener: (...args: any[]) => void): void {
        this.client.on(eventName, listener);
    }

    /**
     * This method is called when the module is loaded.
     * Override this method to perform setup tasks, such as registering commands or event listeners.
     * @returns {void | Promise<void>}
     */
    public onLoad?(): void | Promise<void>;

    /**
     * This method is called when the module is unloaded.
     * Override this method to perform cleanup tasks, suchas unregistering commands or event listeners.
     * @returns {void | Promise<void>}
     */
    public onUnload?(): void | Promise<void>;
}
