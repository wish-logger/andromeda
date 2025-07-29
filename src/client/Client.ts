import { GatewayManager } from '../gateway/GatewayManager';
import { EventEmitter } from 'events';
import { PresenceData, ActivityType } from '../types/Presence';
import { User } from '../structures/User';
import { RestManager } from '../rest/RestManager';
import { InteractionManager } from '../managers/InteractionManager';
import { ApplicationCommand, ApplicationCommandData } from '../types/ApplicationCommand';
import { ModuleManager } from '../managers/ModuleManager';
import { GuildManager } from '../managers/GuildManager';
import { MessageCacheManager } from '../managers/Cache/MessageCacheManager';
import { GuildCacheManager } from '../managers/Cache/GuildCacheManager';
import { ChannelCacheManager } from '../managers/Cache/ChannelCacheManager';
import { UserCacheManager } from '../managers/Cache/UserCacheManager';
import { PresenceCacheManager } from '../managers/Cache/PresenceCacheManager';
import { VoiceStateCacheManager } from '../managers/Cache/VoiceStateCacheManager';
import { MemberCacheManager } from '../managers/Cache/MemberCacheManager';
import { IntegrationCacheManager } from '../managers/Cache/IntegrationCacheManager';
import { ClientOptions, GatewayIntentBits } from '../types/Intents';
import {
    APPLICATION_COMMANDS,
    GUILD_APPLICATION_COMMANDS,
    APPLICATION_COMMAND,
    GUILD_APPLICATION_COMMAND,
    CURRENT_USER,
    CHANNEL,
    WEBHOOK,
    STICKER,
    GUILD_SCHEDULED_EVENT,
    CHANNEL_MESSAGE,
    GUILD_ROLE,
    USER_ENDPOINT,
} from '../rest/Endpoints';
import { GUILD_EMOJIS, GUILD_EMOJI } from '../rest/Endpoints';
import { GUILD_AUTO_MODERATION_RULES, GUILD_AUTO_MODERATION_RULE } from '../rest/Endpoints';
import { Emoji } from '../structures/Emoji';
import { AutoModerationRule } from '../structures/AutoModerationRule';

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
     * Manages Discord guilds.
     * @type {GuildManager}
     */
    public guilds: GuildManager;

    /**
     * Manages the message cache.
     * @type {MessageCacheManager}
     */
    public messages: MessageCacheManager;

    /**
     * Manages the guild cache.
     * @type {GuildCacheManager}
     */
    public guildCache: GuildCacheManager;

    /**
     * Manages the channel cache.
     * @type {ChannelCacheManager}
     */
    public channelCache: ChannelCacheManager;

    /**
     * Manages the user cache.
     * @type {UserCacheManager}
     */
    public userCache: UserCacheManager;
    /**
     * Manages cached presence data.
     * @type {PresenceCacheManager}
     */
    public presenceCache: PresenceCacheManager;
    /**
     * Manages cached voice state data.
     * @type {VoiceStateCacheManager}
     */
    public voiceStateCache: VoiceStateCacheManager;
    /**
     * Manages cached member data.
     * @type {MemberCacheManager}
     */
    public memberCache: MemberCacheManager;
    /**
     * Manages cached integration data.
     * @type {IntegrationCacheManager}
     */
    public integrationCache: IntegrationCacheManager;

    /**
     * Creates a new instance of the Discord client.
     * @param {ClientOptions} [options] Options for the client.
     */
    constructor(options?: ClientOptions) {
        super();
        this.intents = this.$calculateIntents(options?.intents);
        this.clusterId = options?.clusterId ?? 0;
        this.totalClusters = options?.totalClusters ?? 1;
        this.gateway = new GatewayManager(this);
        this.rest = new RestManager(this);
        this.interactions = new InteractionManager(this);
        this.modules = new ModuleManager(this);
        this.guilds = new GuildManager(this);
        this.messages = new MessageCacheManager(this);
        this.guildCache = new GuildCacheManager(this);
        this.channelCache = new ChannelCacheManager(this);
        this.userCache = new UserCacheManager(this);
        this.presenceCache = new PresenceCacheManager(this);
        this.voiceStateCache = new VoiceStateCacheManager(this);
        this.memberCache = new MemberCacheManager(this);
        this.integrationCache = new IntegrationCacheManager(this);
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
            await this.$fetchCurrentUser();
        }
        return this.rest.request('POST', APPLICATION_COMMANDS(this.user.id.toString()), command);
    }

    /**
     * Registers a guild-specific application command.
     * @param {bigint} guildId The ID of the guild.
     * @param {ApplicationCommandData} command The command data.
     * @returns {Promise<ApplicationCommand>} The registered command data.
     */
    public async registerGuildCommand(guildId: bigint, command: ApplicationCommandData): Promise<ApplicationCommand> {
        if (!this.user) {
            await this.$fetchCurrentUser();
        }
        return this.rest.request('POST', GUILD_APPLICATION_COMMANDS(this.user.id.toString(), guildId.toString()), command);
    }

    /**
     * Fetches all global application commands.
     * @returns {Promise<ApplicationCommand[]>} An array of global command data.
     */
    public async fetchGlobalCommands(): Promise<ApplicationCommand[]> {
        if (!this.user) {
            await this.$fetchCurrentUser();
        }
        return this.rest.request('GET', APPLICATION_COMMANDS(this.user.id.toString()));
    }

    /**
     * Fetches all guild-specific application commands.
     * @param {bigint} guildId The ID of the guild.
     * @returns {Promise<ApplicationCommand[]>} An array of guild command data.
     */
    public async fetchGuildCommands(guildId: bigint): Promise<ApplicationCommand[]> {
        if (!this.user) {
            await this.$fetchCurrentUser();
        }
        return this.rest.request('GET', GUILD_APPLICATION_COMMANDS(this.user.id.toString(), guildId.toString()));
    }

    /**
     * Deletes a global application command.
     * @param {bigint} commandId The ID of the command to delete.
     * @returns {Promise<void>}
     */
    public async deleteGlobalCommand(commandId: bigint): Promise<void> {
        if (!this.user) {
            await this.$fetchCurrentUser();
        }
        await this.rest.request('DELETE', APPLICATION_COMMAND(this.user.id.toString(), commandId.toString()));
    }

    /**
     * Deletes a guild-specific application command.
     * @param {bigint} guildId The ID of the guild.
     * @param {bigint} commandId The ID of the command to delete.
     * @returns {Promise<void>}
     */
    public async deleteGuildCommand(guildId: bigint, commandId: bigint): Promise<void> {
        if (!this.user) {
            await this.$fetchCurrentUser();
        }
        await this.rest.request('DELETE', GUILD_APPLICATION_COMMAND(this.user.id.toString(), guildId.toString(), commandId.toString()));
    }

    /**
     * Fetches the current user (the bot itself) and caches it.
     * @private
     */
    private async $fetchCurrentUser(): Promise<void> {
        if (this.user) {
            return;
        }
        const userData = await this.rest.request('GET', CURRENT_USER());
        this.user = new User(this, userData);
        this.userCache.set(this.user);
    }

    /**
     * Fetches a channel by its ID, prioritizing the cache.
     * @param {bigint} channelId The ID of the channel to fetch.
     * @returns {Promise<Channel | null>} The Channel object, or null if not found.
     */
    public async fetchChannel(channelId: bigint): Promise<any | null> {
        let channel = this.channelCache.get(channelId);
        if (channel) {
            return channel;
        }

        try {
            const channelData = await this.rest.request('GET', CHANNEL(channelId.toString()));
            channel = new (await import('../structures/Channel')).Channel(this, channelData);
            this.channelCache.set(channel);
            return channel;
        } catch (error) {
            console.error(`Failed to fetch channel ${channelId}:`, error);
            return null;
        }
    }

    /**
     * Fetches a user by its ID, prioritizing the cache.
     * @param {bigint} userId The ID of the user to fetch.
     * @returns {Promise<User | null>} The User object, or null if not found.
     */
    public async fetchUser(userId: bigint): Promise<User | null> {
        let user = this.userCache.get(userId);
        if (user) {
            return user;
        }

        try {
            const userData = await this.rest.request('GET', USER_ENDPOINT(userId.toString()));
            user = new User(this, userData);
            this.userCache.set(user);
            return user;
        } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
            return null;
        }
    }

    /**
     * Fetches a webhook by its ID.
     * @param {bigint} webhookId The ID of the webhook to fetch.
     * @returns {Promise<Webhook | null>} The Webhook object, or null if not found.
     */
    public async fetchWebhook(webhookId: bigint): Promise<any | null> {
        try {
            const webhookData = await this.rest.request('GET', WEBHOOK(webhookId.toString()));
            const WebhookClass = (await import('../structures/Webhook')).Webhook;
            const webhook = new WebhookClass(this, webhookData);
            return webhook;
        } catch (error) {
            console.error(`Failed to fetch webhook ${webhookId}:`, error);
            return null;
        }
    }

    /**
     * Fetches a sticker by its ID.
     * @param {bigint} stickerId The ID of the sticker to fetch.
     * @returns {Promise<Sticker | null>} The Sticker object, or null if not found.
     */
    public async fetchSticker(stickerId: bigint): Promise<any | null> {
        try {
            const stickerData = await this.rest.request('GET', STICKER(stickerId.toString()));
            const StickerClass = (await import('../structures/Sticker')).Sticker;
            const sticker = new StickerClass(this, stickerData);
            return sticker;
        } catch (error) {
            console.error(`Failed to fetch sticker ${stickerId}:`, error);
            return null;
        }
    }

    /**
     * Fetches a guild scheduled event by its ID.
     * @param {bigint} guildId The ID of the guild the event belongs to.
     * @param {bigint} eventId The ID of the event to fetch.
     * @returns {Promise<GuildScheduledEvent | null>} The GuildScheduledEvent object, or null if not found.
     */
    public async fetchGuildScheduledEvent(guildId: bigint, eventId: bigint): Promise<any | null> {
        try {
            const eventData = await this.rest.request('GET', GUILD_SCHEDULED_EVENT(guildId.toString(), eventId.toString()));
            const GuildScheduledEventClass = (await import('../structures/GuildScheduledEvent')).GuildScheduledEvent;
            const event = new GuildScheduledEventClass(this, eventData);
            return event;
        } catch (error) {
            console.error(`Failed to fetch guild scheduled event ${eventId}:`, error);
            return null;
        }
    }

    /**
     * Fetches an application command by its ID.
     * @param {bigint} applicationId The ID of the application.
     * @param {bigint} commandId The ID of the command to fetch.
     * @returns {Promise<ApplicationCommandData | null>} The ApplicationCommand data, or null if not found.
     */
    public async fetchApplicationCommand(applicationId: bigint, commandId: bigint): Promise<any | null> {
        try {
            const commandData = await this.rest.request('GET', APPLICATION_COMMAND(applicationId.toString(), commandId.toString()));
            return commandData;
        } catch (error) {
            console.error(`Failed to fetch application command ${commandId}:`, error);
            return null;
        }
    }

    /**
     * Fetches a message by its channel ID and message ID.
     * @param {bigint} channelId The ID of the channel the message belongs to.
     * @param {bigint} messageId The ID of the message to fetch.
     * @returns {Promise<Message | null>} The Message object, or null if not found.
     */
    public async fetchMessage(channelId: bigint, messageId: bigint): Promise<any | null> {
        try {
            const messageData = await this.rest.request('GET', CHANNEL_MESSAGE(channelId.toString(), messageId.toString()));
            const MessageClass = (await import('../structures/Message')).Message;
            const message = new MessageClass(this, messageData);
            return message;
        } catch (error) {
            console.error(`Failed to fetch message ${messageId}:`, error);
            return null;
        }
    }

    /**
     * Fetches a role by its ID from a specific guild, prioritizing the guild's cache.
     * @param {bigint} guildId The ID of the guild the role belongs to.
     * @param {bigint} roleId The ID of the role to fetch.
     * @returns {Promise<Role | null>} The Role object, or null if not found.
     */
    public async fetchRole(guildId: bigint, roleId: bigint): Promise<any | null> {

        const guild = this.guildCache.get(guildId);
        if (guild) {
            const role = guild.roles.get(roleId);
            if (role) return role;
        }

        try {
            const roleData = await this.rest.request('GET', GUILD_ROLE(guildId.toString(), roleId.toString()));
            const RoleClass = (await import('../structures/Role')).Role;
            const role = new RoleClass(this, roleData, guildId.toString());

            if (guild) {
                guild.roles.set(role.id, role);
            }
            return role;
        } catch (error) {
            console.error(`Failed to fetch role ${roleId} from guild ${guildId}:`, error);
            return null;
        }
    }

    /**
     * Fetches all emojis for a given guild.
     * @param {bigint} guildId The ID of the guild.
     * @returns {Promise<Emoji[]>} An array of Emoji objects.
     */
    public async fetchGuildEmojis(guildId: bigint): Promise<Emoji[]> {
        try {
            const emojiData = await this.rest.request('GET', GUILD_EMOJIS(guildId.toString()));
            const EmojiClass = (await import('../structures/Emoji')).Emoji;
            return emojiData.map((e: any) => new EmojiClass(this, e));
        } catch (error) {
            console.error(`Failed to fetch emojis for guild ${guildId}:`, error);
            return [];
        }
    }

    /**
     * Fetches a specific emoji from a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {bigint} emojiId The ID of the emoji to fetch.
     * @returns {Promise<Emoji | null>} The Emoji object, or null if not found.
     */
    public async fetchGuildEmoji(guildId: bigint, emojiId: bigint): Promise<Emoji | null> {
        try {
            const emojiData = await this.rest.request('GET', GUILD_EMOJI(guildId.toString(), emojiId.toString()));
            const EmojiClass = (await import('../structures/Emoji')).Emoji;
            return new EmojiClass(this, emojiData);
        } catch (error) {
            console.error(`Failed to fetch emoji ${emojiId} from guild ${guildId}:`, error);
            return null;
        }
    }

    /**
     * Creates a new emoji in a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {object} options The emoji creation options. Requires `name` and `image` (base64 encoded Data URI).
     * @param {string} [options.name] The name of the emoji.
     * @param {string} [options.image] The 128x128 image for the emoji, encoded as a Data URI.
     * @param {bigint[]} [options.roles] Role IDs allowed to use this emoji.
     * @param {string} [reason] The reason for creating the emoji.
     * @returns {Promise<Emoji>} The created Emoji object.
     */
    public async createGuildEmoji(guildId: bigint, options: { name: string; image: string; roles?: bigint[]; }, reason?: string): Promise<Emoji> {
        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        const payload = {
            name: options.name,
            image: options.image,
            roles: options.roles?.map(id => id.toString()),
        };

        try {
            const emojiData = await this.rest.request('POST', GUILD_EMOJIS(guildId.toString()), payload, headers);
            const EmojiClass = (await import('../structures/Emoji')).Emoji;
            return new EmojiClass(this, emojiData);
        } catch (error) {
            console.error(`Failed to create emoji in guild ${guildId}:`, error);
            throw error;
        }
    }

    /**
     * Edits an existing emoji in a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {bigint} emojiId The ID of the emoji to edit.
     * @param {object} options The emoji edit options. Can include `name`, `roles`.
     * @param {string} [options.name] The new name of the emoji.
     * @param {bigint[]} [options.roles] New role IDs allowed to use this emoji.
     * @param {string} [reason] The reason for editing the emoji.
     * @returns {Promise<Emoji>} The edited Emoji object.
     */
    public async editGuildEmoji(guildId: bigint, emojiId: bigint, options: { name?: string; roles?: bigint[]; }, reason?: string): Promise<Emoji> {
        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.roles) payload.roles = options.roles.map(id => id.toString());

        try {
            const emojiData = await this.rest.request('PATCH', GUILD_EMOJI(guildId.toString(), emojiId.toString()), payload, headers);
            const EmojiClass = (await import('../structures/Emoji')).Emoji;
            return new EmojiClass(this, emojiData);
        } catch (error) {
            console.error(`Failed to edit emoji ${emojiId} in guild ${guildId}:`, error);
            throw error;
        }
    }

    /**
     * Deletes an emoji from a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {bigint} emojiId The ID of the emoji to delete.
     * @param {string} [reason] The reason for deleting the emoji.
     * @returns {Promise<void>}
     */
    public async deleteGuildEmoji(guildId: bigint, emojiId: bigint, reason?: string): Promise<void> {
        const headers: any = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        try {
            await this.rest.request('DELETE', GUILD_EMOJI(guildId.toString(), emojiId.toString()), undefined, headers);
        } catch (error) {
            console.error(`Failed to delete emoji ${emojiId} from guild ${guildId}:`, error);
            throw error;
        }
    }

    /**
     * Fetches all auto moderation rules for a given guild.
     * @param {bigint} guildId The ID of the guild.
     * @returns {Promise<AutoModerationRule[]>} An array of AutoModerationRule objects.
     */
    public async fetchGuildAutoModerationRules(guildId: bigint): Promise<AutoModerationRule[]> {
        try {
            const rulesData = await this.rest.request('GET', GUILD_AUTO_MODERATION_RULES(guildId.toString()));
            const AutoModerationRuleClass = (await import('../structures/AutoModerationRule')).AutoModerationRule;
            return rulesData.map((r: any) => new AutoModerationRuleClass(this, r));
        } catch (error) {
            console.error(`Failed to fetch auto moderation rules for guild ${guildId}:`, error);
            return [];
        }
    }

    /**
     * Fetches a specific auto moderation rule from a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {bigint} ruleId The ID of the rule to fetch.
     * @returns {Promise<AutoModerationRule | null>} The AutoModerationRule object, or null if not found.
     */
    public async fetchGuildAutoModerationRule(guildId: bigint, ruleId: bigint): Promise<AutoModerationRule | null> {
        try {
            const ruleData = await this.rest.request('GET', GUILD_AUTO_MODERATION_RULE(guildId.toString(), ruleId.toString()));
            const AutoModerationRuleClass = (await import('../structures/AutoModerationRule')).AutoModerationRule;
            return new AutoModerationRuleClass(this, ruleData);
        } catch (error) {
            console.error(`Failed to fetch auto moderation rule ${ruleId} from guild ${guildId}:`, error);
            return null;
        }
    }

    /**
     * Creates a new auto moderation rule in a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {object} options The rule creation options.
     * @param {string} options.name The name of the rule.
     * @param {number} options.eventType The event type for the rule (AutoModerationEventType).
     * @param {number} options.triggerType The trigger type for the rule (AutoModerationTriggerType).
     * @param {object} [options.triggerMetadata] Additional data used to determine whether a rule should be triggered.
     * @param {object[]} options.actions Actions which will execute whenever a rule is triggered.
     * @param {boolean} [options.enabled=true] Whether the rule is enabled.
     * @param {bigint[]} [options.exemptRoles] The IDs of roles that are exempt from the rule.
     * @param {bigint[]} [options.exemptChannels] The IDs of channels that are exempt from the rule.
     * @param {string} [reason] The reason for creating the rule.
     * @returns {Promise<AutoModerationRule>} The created AutoModerationRule object.
     */
    public async createGuildAutoModerationRule(guildId: bigint, options: { name: string; eventType: number; triggerType: number; triggerMetadata?: any; actions: any[]; enabled?: boolean; exemptRoles?: bigint[]; exemptChannels?: bigint[]; }, reason?: string): Promise<AutoModerationRule> {
        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        const payload = {
            name: options.name,
            event_type: options.eventType,
            trigger_type: options.triggerType,
            trigger_metadata: options.triggerMetadata,
            actions: options.actions,
            enabled: options.enabled ?? true,
            exempt_roles: options.exemptRoles?.map(id => id.toString()),
            exempt_channels: options.exemptChannels?.map(id => id.toString()),
        };

        try {
            const ruleData = await this.rest.request('POST', GUILD_AUTO_MODERATION_RULES(guildId.toString()), payload, headers);
            const AutoModerationRuleClass = (await import('../structures/AutoModerationRule')).AutoModerationRule;
            return new AutoModerationRuleClass(this, ruleData);
        } catch (error) {
            console.error(`Failed to create auto moderation rule in guild ${guildId}:`, error);
            throw error;
        }
    }

    /**
     * Edits an existing auto moderation rule in a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {bigint} ruleId The ID of the rule to edit.
     * @param {object} options The rule edit options. Can include `name`, `eventType`, `triggerType`, `triggerMetadata`, `actions`, `enabled`, `exemptRoles`, `exemptChannels`.
     * @param {string} [reason] The reason for editing the rule.
     * @returns {Promise<AutoModerationRule>} The edited AutoModerationRule object.
     */
    public async editGuildAutoModerationRule(guildId: bigint, ruleId: bigint, options: { name?: string; eventType?: number; triggerType?: number; triggerMetadata?: any; actions?: any[]; enabled?: boolean; exemptRoles?: bigint[]; exemptChannels?: bigint[]; }, reason?: string): Promise<AutoModerationRule> {
        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        const payload: any = {};
        if (options.name) payload.name = options.name;
        if (options.eventType) payload.event_type = options.eventType;
        if (options.triggerType) payload.trigger_type = options.triggerType;
        if (options.triggerMetadata) payload.trigger_metadata = options.triggerMetadata;
        if (options.actions) payload.actions = options.actions;
        if (typeof options.enabled === 'boolean') payload.enabled = options.enabled;
        if (options.exemptRoles) payload.exempt_roles = options.exemptRoles.map(id => id.toString());
        if (options.exemptChannels) payload.exempt_channels = options.exemptChannels.map(id => id.toString());

        try {
            const ruleData = await this.rest.request('PATCH', GUILD_AUTO_MODERATION_RULE(guildId.toString(), ruleId.toString()), payload, headers);
            const AutoModerationRuleClass = (await import('../structures/AutoModerationRule')).AutoModerationRule;
            return new AutoModerationRuleClass(this, ruleData);
        } catch (error) {
            console.error(`Failed to edit auto moderation rule ${ruleId} in guild ${guildId}:`, error);
            throw error;
        }
    }

    /**
     * Deletes an auto moderation rule from a guild.
     * @param {bigint} guildId The ID of the guild.
     * @param {bigint} ruleId The ID of the rule to delete.
     * @param {string} [reason] The reason for deleting the rule.
     * @returns {Promise<void>}
     */
    public async deleteGuildAutoModerationRule(guildId: bigint, ruleId: bigint, reason?: string): Promise<void> {
        const headers: any = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        try {
            await this.rest.request('DELETE', GUILD_AUTO_MODERATION_RULE(guildId.toString(), ruleId.toString()), undefined, headers);
        } catch (error) {
            console.error(`Failed to delete auto moderation rule ${ruleId} from guild ${guildId}:`, error);
            throw error;
        }
    }
}