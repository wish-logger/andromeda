import { GatewayManager } from '../gateway/GatewayManager';
import { EventEmitter } from 'events';
import { PresenceData, ActivityType } from '../types/Presence';
import { User } from '../structures/User';
import { RestManager } from '../rest/RestManager';
import { InteractionManager } from '../managers/InteractionManager';
import { ApplicationCommand, ApplicationCommandData } from '../types/ApplicationCommand';
import { ModuleManager } from '../managers/ModuleManager';
import { ClientOptions, GatewayIntentBits } from '../types/Intents';

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
     * The intents bitfield for the client.
     * @type {number}
     */
    public intents: number;
    /**
     * The ID of this cluster.
     * @type {number}
     */
    public clusterId: number;
    /**
     * The total number of clusters.
     * @type {number}
     */
    public totalClusters: number;

    // Static types
    public static readonly GUILDS = 1 << 0;
    public static readonly GUILD_MEMBERS = 1 << 1;
    public static readonly GUILD_BANS = 1 << 2;
    public static readonly GUILD_EMOJIS_AND_STICKERS = 1 << 3;
    public static readonly GUILD_INTEGRATIONS = 1 << 4;
    public static readonly GUILD_WEBHOOKS = 1 << 5;
    public static readonly GUILD_INVITES = 1 << 6;
    public static readonly GUILD_VOICE_STATES = 1 << 7;
    public static readonly GUILD_PRESENCES = 1 << 8;
    public static readonly GUILD_MESSAGES = 1 << 9;
    public static readonly GUILD_MESSAGE_REACTIONS = 1 << 10;
    public static readonly GUILD_MESSAGE_TYPING = 1 << 11;
    public static readonly DIRECT_MESSAGES = 1 << 12;
    public static readonly DIRECT_MESSAGE_REACTIONS = 1 << 13;
    public static readonly DIRECT_MESSAGE_TYPING = 1 << 14;
    public static readonly MESSAGE_CONTENT = 1 << 15;
    public static readonly GUILD_SCHEDULED_EVENTS = 1 << 16;
    public static readonly AUTO_MODERATION_CONFIGURATION = 1 << 20;
    public static readonly AUTO_MODERATION_EXECUTION = 1 << 21;

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
     * @param {ClientOptions} [options] Options for the client.
     */
    constructor(options?: ClientOptions) {
        super();
        this.intents = this.$calculateIntents(options?.intents);
        this.clusterId = options?.clusterId ?? 0; // Default to 0
        this.totalClusters = options?.totalClusters ?? 1; // Default to 1 (no clustering)
        this.gateway = new GatewayManager(this);
        this.rest = new RestManager(this);
        this.interactions = new InteractionManager(this);
        this.modules = new ModuleManager(this);
    }

    /**
     * Calculates the intents bitfield from an array of intent bits.
     * @param {GatewayIntentBits[]} intentsArray An array of GatewayIntentBits.
     * @returns {number} The calculated intents bitfield.
     * @private
     */
    private $calculateIntents(intentsInput?: number | GatewayIntentBits[]): number {
        // If intentsInput is a number (bitfield), use it directly
        if (typeof intentsInput === 'number') {
            return intentsInput;
        }
        // If intentsInput is an array of GatewayIntentBits, reduce it to a bitfield
        if (Array.isArray(intentsInput)) {
            return intentsInput.reduce((acc, intent) => acc | intent, 0);
        }
        // Fallback for cases where it might be undefined or other unexpected type
        return 0;
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

        // if the afk prop is undefined set it to null in post
        if (typeof presenceData.since === 'undefined') {
            if (presenceData.afk === false || typeof presenceData.afk === 'undefined') {
                presenceData.since = null;
            }
        }

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