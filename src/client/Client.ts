import { GatewayManager } from '../gateway/GatewayManager';
import { EventEmitter } from 'events';
import { PresenceData } from '../types/Presence';
import { User } from '../structures/User';
import { RestManager } from '../rest/RestManager';
import { InteractionManager } from '../managers/InteractionManager';
import { ApplicationCommandData } from '../types/ApplicationCommand';
import { CogManager } from '../managers/CogManager';

/**
 * The main client for interacting with the Discord API.
 * @extends EventEmitter
 */
export class Client extends EventEmitter {
    /**
     * The bot's authentication token.
     * @type {string | null}
     */
    public token: string | null = null;
    /**
     * Manages the WebSocket connection to the Discord Gateway.
     * @type {GatewayManager}
     */
    public gateway: GatewayManager;
    /**
     * Manages HTTP requests to the Discord API.
     * @type {RestManager}
     */
    public rest: RestManager;
    /**
     * Manages incoming Discord interactions.
     * @type {InteractionManager}
     */
    public interactions: InteractionManager;
    /**
     * Manages the loading and unloading of cogs (modules).
     * @type {CogManager}
     */
    public cogs: CogManager;
    /**
     * The user object for the logged-in bot.
     * This property is guaranteed to be set after the 'READY' event.
     * @type {User}
     */
    public user!: User;

    /**
     * Creates a new instance of the Discord client.
     */
    constructor() {
        super();
        this.gateway = new GatewayManager(this);
        this.rest = new RestManager(this);
        this.interactions = new InteractionManager(this);
        this.cogs = new CogManager(this);
    }

    /**
     * Logs the bot in to Discord.
     * @param {string} token The bot's authentication token.
     */
    public login(token: string): void {
        this.token = token;
        this.gateway.connect();
    }

    /**
     * Sets the bot's presence (status and activity).
     * To set only the status without any activity, you can pass an empty `activities` array or omit the `activities` property.
     * @param {Partial<PresenceData>} data The presence data to set.
     */
    public setPresence(data: Partial<PresenceData>): void {
        this.gateway.updatePresence(data);
    }

    /**
     * Registers a global application command.
     * @param {ApplicationCommandData} command The command data.
     * @returns {Promise<any>} The registered command data.
     */
    public async registerGlobalCommand(command: ApplicationCommandData): Promise<any> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        return this.rest.request('POST', `/applications/${this.user.id}/commands`, command);
    }

    /**
     * Registers a guild-specific application command.
     * @param {string} guildId The ID of the guild.
     * @param {ApplicationCommandData} command The command data.
     * @returns {Promise<any>} The registered command data.
     */
    public async registerGuildCommand(guildId: string, command: ApplicationCommandData): Promise<any> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        return this.rest.request('POST', `/applications/${this.user.id}/guilds/${guildId}/commands`, command);
    }

    /**
     * Fetches all global application commands.
     * @returns {Promise<any[]>} An array of global command data.
     */
    public async fetchGlobalCommands(): Promise<any[]> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        return this.rest.request('GET', `/applications/${this.user.id}/commands`);
    }

    /**
     * Fetches all guild-specific application commands.
     * @param {string} guildId The ID of the guild.
     * @returns {Promise<any[]>} An array of guild command data.
     */
    public async fetchGuildCommands(guildId: string): Promise<any[]> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        return this.rest.request('GET', `/applications/${this.user.id}/guilds/${guildId}/commands`);
    }

    /**
     * Deletes a global application command.
     * @param {string} commandId The ID of the command to delete.
     * @returns {Promise<void>}
     */
    public async deleteGlobalCommand(commandId: string): Promise<void> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        await this.rest.request('DELETE', `/applications/${this.user.id}/commands/${commandId}`);
    }

    /**
     * Deletes a guild-specific application command.
     * @param {string} guildId The ID of the guild.
     * @param {string} commandId The ID of the command to delete.
     * @returns {Promise<void>}
     */
    public async deleteGuildCommand(guildId: string, commandId: string): Promise<void> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        await this.rest.request('DELETE', `/applications/${this.user.id}/guilds/${guildId}/commands/${commandId}`);
    }
}
