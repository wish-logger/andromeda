import { GatewayManager } from '../gateway/GatewayManager';
import { EventEmitter } from 'events';
import { PresenceData, ActivityType } from '../types/Presence';
import { User } from '../structures/User';
import { RestManager } from '../rest/RestManager';
import { InteractionManager } from '../managers/InteractionManager';
import { ApplicationCommand, ApplicationCommandData } from '../types/ApplicationCommand';
import { ModuleManager } from '../managers/ModuleManager';

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
     * Manages the loading and unloading of modules.
     * @type {ModuleManager}
     */
    public modules: ModuleManager;
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
        this.modules = new ModuleManager(this);
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
     * If `ActivityType.CUSTOM` is used and `state` is not provided, `name` will be used as `state`.
     * @param {Partial<PresenceData>} data The presence data to set.
     */
    public setPresence(data: Partial<PresenceData>): void {
        // Deep copy to avoid modifying the original object
        const presenceData = JSON.parse(JSON.stringify(data));

        if (presenceData.activities && Array.isArray(presenceData.activities)) {
            presenceData.activities = presenceData.activities.map((activity: any) => {
                if (activity.type === ActivityType.CUSTOM && !activity.state && activity.name) {
                    return { ...activity, state: activity.name };
                }
                return activity;
            });
        }
        this.gateway.updatePresence(presenceData);
    }

    /**
     * Registers a global application command.
     * @param {ApplicationCommandData} command The command data.
     * @returns {Promise<any>} The registered command data.
     */
    public async registerGlobalCommand(command: ApplicationCommandData): Promise<ApplicationCommand> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        return this.rest.request('POST', `/applications/${this.user.id}/commands`, command);
    }

    /**
     * Registers a guild-specific application command.
     * @param {string} guildId The ID of the guild.
     * @param {ApplicationCommandData} command The command data.
     * @returns {Promise<ApplicationCommand>} The registered command data.
     */
    public async registerGuildCommand(guildId: string, command: ApplicationCommandData): Promise<ApplicationCommand> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        return this.rest.request('POST', `/applications/${this.user.id}/guilds/${guildId}/commands`, command);
    }

    /**
     * Fetches all global application commands.
     * @returns {Promise<ApplicationCommand[]>} An array of global command data.
     */
    public async fetchGlobalCommands(): Promise<ApplicationCommand[]> {
        if (!this.user) {
            throw new Error('Client user not available. Log in first.');
        }
        return this.rest.request('GET', `/applications/${this.user.id}/commands`);
    }

    /**
     * Fetches all guild-specific application commands.
     * @param {string} guildId The ID of the guild.
     * @returns {Promise<ApplicationCommand[]>} An array of guild command data.
     */
    public async fetchGuildCommands(guildId: string): Promise<ApplicationCommand[]> {
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