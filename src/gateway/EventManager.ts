import { Client } from '../client/Client';
import { User } from '../structures/User';
import { Guild } from '../structures/Guild';
import { Message } from '../structures/Message';
import { Channel } from '../structures/Channel';
import { Member } from '../structures/Member';
import { VoiceState } from '../structures/VoiceState';
import { Presence } from '../structures/Presence';
import { StageInstance } from '../structures/StageInstance';
import { GuildScheduledEvent } from '../structures/GuildScheduledEvent';
import { AuditLogEntry } from '../structures/AuditLogEntry';
import { Sticker } from '../structures/Sticker';
import { Interaction } from '../structures/Interaction';
import { Integration } from '../structures/Integration';

/**
 * Manages the processing and emission of Discord Gateway events.
 */
export class EventManager {
    private client: Client;

    /**
     * Creates an instance of EventManager.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;
    }

    private $toCamelCase(str: string): string {
        return str.toLowerCase().replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    }

    /**
     * Handles a Discord Gateway Dispatch payload (opcode 0) and emits the corresponding client event.
     * @param {any} payload The dispatch payload received from the Gateway.
     */
    public handle(payload: any): void {
        const { t, d, s } = payload; // t: event name, d: event data, s: sequence

        const eventName = this.$toCamelCase(t);

        switch (t) {
            case 'READY': {
                let user = this.client.userCache.get(BigInt(d.user.id));
                if (!user) {
                    user = new User(this.client, d.user);
                    this.client.userCache.set(user);
                }
                this.client.user = user;
                this.client.emit(eventName, d);
                break;
            }
            case 'MESSAGE_CREATE': {
                const message = new Message(this.client, d);
                this.client.messages.set(message);
                this.client.emit(eventName, message);
                break;
            }
            case 'MESSAGE_UPDATE': {
                const oldMessage = this.client.messages.get(BigInt(d.id));
                const newMessage = new Message(this.client, d);
                this.client.messages.set(newMessage);
                this.client.emit(eventName, oldMessage, newMessage);
                break;
            }
            case 'MESSAGE_DELETE': {
                const messageId = BigInt(d.id);
                const cachedMessage = this.client.messages.get(messageId);
                this.client.messages.delete(messageId);
                this.client.emit(eventName, cachedMessage || d);
                break;
            }
            case 'GUILD_CREATE': {
                const guild = new Guild(this.client, d);
                this.client.guildCache.set(guild);
                this.client.emit(eventName, guild);
                break;
            }
            case 'GUILD_UPDATE': {
                const oldGuild = this.client.guildCache.get(BigInt(d.id));
                const newGuild = new Guild(this.client, d);
                this.client.guildCache.set(newGuild);
                this.client.emit(eventName, oldGuild, newGuild);
                break;
            }
            case 'GUILD_DELETE': {
                const guildId = BigInt(d.id);
                const cachedGuild = this.client.guildCache.get(guildId);
                this.client.guildCache.delete(guildId);
                this.client.emit(eventName, cachedGuild || d);
                break;
            }
            case 'GUILD_MEMBER_ADD': {
                const member = new Member(this.client, d, d.guild_id);
                this.client.memberCache.set(member);
                this.client.emit(eventName, member);
                break;
            }
            case 'GUILD_MEMBER_UPDATE': {
                const oldMember = this.client.memberCache.get(BigInt(d.guild_id), BigInt(d.user.id));
                const newMember = new Member(this.client, d, d.guild_id);
                this.client.memberCache.set(newMember);
                this.client.emit(eventName, oldMember, newMember);
                break;
            }
            case 'GUILD_MEMBER_REMOVE': {
                if (d.guild_id && d.user && d.user.id) {
                    const cachedMember = this.client.memberCache.get(BigInt(d.guild_id), BigInt(d.user.id));
                    this.client.memberCache.delete(BigInt(d.guild_id), BigInt(d.user.id));
                    this.client.emit(eventName, cachedMember || d.user, BigInt(d.guild_id));
                } else {
                    this.client.emit(eventName, d.user, BigInt(d.guild_id));
                }
                break;
            }
            case 'CHANNEL_CREATE': {
                const channel = new Channel(this.client, d);
                this.client.channelCache.set(channel);
                this.client.emit(eventName, channel);
                break;
            }
            case 'CHANNEL_UPDATE': {
                const oldChannel = this.client.channelCache.get(BigInt(d.id));
                const newChannel = new Channel(this.client, d);
                this.client.channelCache.set(newChannel);
                this.client.emit(eventName, oldChannel, newChannel);
                break;
            }
            case 'CHANNEL_DELETE': {
                const channelId = BigInt(d.id);
                const cachedChannel = this.client.channelCache.get(channelId);
                this.client.channelCache.delete(channelId);
                this.client.emit(eventName, cachedChannel || d);
                break;
            }
            case 'VOICE_STATE_UPDATE': {
                const voiceState = new VoiceState(this.client, d);
                if (voiceState.channelId === null) {
                    // User left a voice channel
                    if (voiceState.guildId && voiceState.userId) {
                        this.client.voiceStateCache.delete(voiceState.guildId, voiceState.userId);
                    }
                } else {
                    // User joined or moved to a voice channel
                    this.client.voiceStateCache.set(voiceState);
                }
                this.client.emit(eventName, voiceState);
                break;
            }
            case 'PRESENCE_UPDATE': {
                const presence = new Presence(this.client, d);
                this.client.presenceCache.set(presence);
                this.client.emit(eventName, presence);
                break;
            }
            case 'GUILD_BAN_ADD': {
                const user = new User(this.client, d.user);
                this.client.emit(eventName, user, BigInt(d.guild_id));
                break;
            }
            case 'GUILD_BAN_REMOVE': {
                const user = new User(this.client, d.user);
                this.client.emit(eventName, user, BigInt(d.guild_id));
                break;
            }
            case 'GUILD_EMOJIS_UPDATE': {
                const guildId = BigInt(d.guild_id);
                const emojis = d.emojis;
                this.client.emit(eventName, guildId, emojis);
                break;
            }
            case 'GUILD_INTEGRATIONS_UPDATE': {
                const guildId = BigInt(d.guild_id);
                this.client.emit(eventName, guildId);
                break;
            }
            case 'GUILD_ROLE_CREATE': {
                const guildId = BigInt(d.guild_id);
                const role = d.role;
                this.client.emit(eventName, guildId, role);
                break;
            }
            case 'GUILD_ROLE_DELETE': {
                const guildId = BigInt(d.guild_id);
                const roleId = BigInt(d.role_id);
                this.client.emit(eventName, guildId, roleId);
                break;
            }
            case 'GUILD_ROLE_UPDATE': {
                const guildId = BigInt(d.guild_id);
                const role = d.role; 
                this.client.emit(eventName, guildId, role);
                break;
            }
            case 'INVITE_CREATE': {
                const invite = d;
                this.client.emit(eventName, invite);
                break;
            }
            case 'INVITE_DELETE': {
                const channelId = BigInt(d.channel_id);
                const guildId = d.guild_id ? BigInt(d.guild_id) : null;
                const code = d.code;
                this.client.emit(eventName, channelId, guildId, code);
                break;
            }
            case 'MESSAGE_REACTION_ADD': {
                const userId = BigInt(d.user_id);
                const messageId = BigInt(d.message_id);
                const channelId = BigInt(d.channel_id);
                const emoji = d.emoji;
                this.client.emit(eventName, userId, messageId, channelId, emoji);
                break;
            }
            case 'MESSAGE_REACTION_REMOVE': {
                const userId = BigInt(d.user_id);
                const messageId = BigInt(d.message_id);
                const channelId = BigInt(d.channel_id);
                const emoji = d.emoji;
                this.client.emit(eventName, userId, messageId, channelId, emoji);
                break;
            }
            case 'MESSAGE_REACTION_REMOVE_ALL': {
                const messageId = BigInt(d.message_id);
                const channelId = BigInt(d.channel_id);
                this.client.emit(eventName, messageId, channelId);
                break;
            }
            case 'MESSAGE_REACTION_REMOVE_EMOJI': {
                const messageId = BigInt(d.message_id);
                const channelId = BigInt(d.channel_id);
                const emoji = d.emoji;
                this.client.emit(eventName, messageId, channelId, emoji);
                break;
            }
            case 'TYPING_START': {
                const userId = BigInt(d.user_id);
                const channelId = BigInt(d.channel_id);
                const timestamp = d.timestamp;
                this.client.emit(eventName, userId, channelId, timestamp);
                break;
            }
            case 'WEBHOOKS_UPDATE': {
                const guildId = BigInt(d.guild_id);
                const channelId = BigInt(d.channel_id);
                this.client.emit(eventName, guildId, channelId);
                break;
            }
            case 'THREAD_CREATE': {
                const thread = new Channel(this.client, d);
                this.client.channelCache.set(thread);
                this.client.emit(eventName, thread);
                break;
            }
            case 'THREAD_UPDATE': {
                const oldThread = this.client.channelCache.get(BigInt(d.id));
                const newThread = new Channel(this.client, d);
                this.client.channelCache.set(newThread);
                this.client.emit(eventName, oldThread, newThread);
                break;
            }
            case 'THREAD_DELETE': {
                const threadId = BigInt(d.id);
                const cachedThread = this.client.channelCache.get(threadId);
                this.client.channelCache.delete(threadId);
                this.client.emit(eventName, cachedThread || d);
                break;
            }
            case 'THREAD_LIST_SYNC': {
                // This event provides a snapshot of active threads in a guild or channel.
                // d.guild_id, d.channel_ids, d.threads, d.members
                this.client.emit(eventName, d);
                break;
            }
            case 'THREAD_MEMBER_UPDATE': {
                // d.id (thread_id), d.user_id, d.flags
                this.client.emit(eventName, d);
                break;
            }
            case 'THREAD_MEMBERS_UPDATE': {
                // d.id (thread_id), d.guild_id, d.added_members, d.removed_member_ids
                this.client.emit(eventName, d);
                break;
            }
            case 'STAGE_INSTANCE_CREATE': {
                const stageInstance = new StageInstance(this.client, d);
                this.client.emit(eventName, stageInstance);
                break;
            }
            case 'STAGE_INSTANCE_UPDATE': {
                const stageInstance = new StageInstance(this.client, d);
                this.client.emit(eventName, stageInstance);
                break;
            }
            case 'STAGE_INSTANCE_DELETE': {
                const stageInstance = new StageInstance(this.client, d);
                this.client.emit(eventName, stageInstance);
                break;
            }
            case 'GUILD_AUDIT_LOG_ENTRY_CREATE': {
                const auditLogEntry = new AuditLogEntry(this.client, d, BigInt(d.guild_id));
                this.client.emit(eventName, auditLogEntry);
                break;
            }
            case 'GUILD_STICKERS_UPDATE': {
                const guildId = BigInt(d.guild_id);
                const stickers = d.stickers.map((s: any) => new Sticker(this.client, s));
                this.client.emit(eventName, guildId, stickers);
                break;
            }
            case 'INTEGRATION_CREATE': {
                const integration = new Integration(this.client, d);
                this.client.integrationCache.set(integration);
                this.client.emit(eventName, integration);
                break;
            }
            case 'INTEGRATION_UPDATE': {
                const oldIntegration = this.client.integrationCache.get(BigInt(d.id));
                const newIntegration = new Integration(this.client, d);
                this.client.integrationCache.set(newIntegration);
                this.client.emit(eventName, oldIntegration, newIntegration);
                break;
            }
            case 'INTEGRATION_DELETE': {
                if (d.id) {
                    const cachedIntegration = this.client.integrationCache.get(BigInt(d.id));
                    this.client.integrationCache.delete(BigInt(d.id));
                    this.client.emit(eventName, cachedIntegration || BigInt(d.id), BigInt(d.guild_id));
                } else {
                    this.client.emit(eventName, BigInt(d.id), BigInt(d.guild_id));
                }
                break;
            }
            case 'GUILD_SCHEDULED_EVENT_CREATE': {
                const scheduledEvent = new GuildScheduledEvent(this.client, d);
                this.client.emit(eventName, scheduledEvent);
                break;
            }
            case 'GUILD_SCHEDULED_EVENT_UPDATE': {
                const scheduledEvent = new GuildScheduledEvent(this.client, d);
                this.client.emit(eventName, scheduledEvent);
                break;
            }
            case 'GUILD_SCHEDULED_EVENT_DELETE': {
                const scheduledEvent = new GuildScheduledEvent(this.client, d);
                this.client.emit(eventName, scheduledEvent);
                break;
            }
            case 'GUILD_SCHEDULED_EVENT_USER_ADD': {
                const guildScheduledEventId = BigInt(d.guild_scheduled_event_id);
                const userId = BigInt(d.user_id);
                const guildId = BigInt(d.guild_id);
                this.client.emit(eventName, guildScheduledEventId, userId, guildId);
                break;
            }
            case 'GUILD_SCHEDULED_EVENT_USER_REMOVE': {
                const guildScheduledEventId = BigInt(d.guild_scheduled_event_id);
                const userId = BigInt(d.user_id);
                const guildId = BigInt(d.guild_id);
                this.client.emit(eventName, guildScheduledEventId, userId, guildId);
                break;
            }
            case 'INTERACTION_CREATE': {
                const interaction = new Interaction(this.client, d);
                this.client.emit(eventName, interaction);
                break;
            }
            default:
                this.client.emit(eventName, d);
                break;
        }
    }
}