import { Client } from '../client/Client';
import { AuditLogEvent } from '../types/AuditLog';
import { User } from './User';

/**
 * Represents the options for an audit log entry, specific to its action type.
 */
export interface AuditLogOptions {
    delete_member_days?: string; // MEMBER_PRUNE, MEMBER_KICK, MEMBER_BAN_ADD
    members_removed?: string; // MEMBER_PRUNE
    channel_id?: string; // CHANNEL_OVERWRITE_*, MESSAGE_DELETE, MESSAGE_BULK_DELETE, MESSAGE_PIN, MESSAGE_UNPIN, THREAD_*, MEMBER_MOVE, STAGE_INSTANCE_*, AUTO_MODERATION_*
    message_id?: string; // MESSAGE_DELETE, MESSAGE_BULK_DELETE, MESSAGE_PIN, MESSAGE_UNPIN
    count?: string; // MESSAGE_DELETE, MESSAGE_BULK_DELETE, MEMBER_DISCONNECT, MEMBER_MOVE, AUTO_MODERATION_*
    id?: string; // CHANNEL_OVERWRITE_*, INVITE_*, INTEGRATION_*
    type?: string; // CHANNEL_OVERWRITE_*, WEBHOOK_*, EMOJI_*, INVITE_*, INTEGRATION_*
    role_name?: string; // CHANNEL_OVERWRITE_CREATE
    application_id?: string; // APPLICATION_COMMAND_PERMISSION_UPDATE, BOT_ADD
    auto_moderation_rule_name?: string; // AUTO_MODERATION_*
    auto_moderation_rule_trigger_type?: string; // AUTO_MODERATION_*
    entity_type?: string; // GUILD_SCHEDULED_EVENT_*
    integration_type?: string; // INTEGRATION_*, MEMBER_KICK, MEMBER_ROLE_UPDATE
    trigger_type?: string; // AUTO_MODERATION_*
    location?: string; // GUILD_SCHEDULED_EVENT_*
}

export interface CommandPermissionChangeValue {
    id: string;
    type: number;
    permission: boolean;
}

export interface RoleChangeArrayItem {
    id: string;
    name: string;
}

/**
 * Represents a single change in an audit log entry.
 */
export interface AuditLogChange {
    key: string;
    old_value?: any;
    new_value?: any;
}

export class AuditLogEntry {
    public id: bigint;
    public userId: bigint | null;
    public targetId: bigint | null;
    public actionType: AuditLogEvent;
    public changes?: AuditLogChange[];
    public options?: AuditLogOptions;
    public reason?: string;
    public guildId?: bigint;

    private client: Client;

    constructor(client: Client, data: any, guildId?: bigint) {
        this.client = client;
        this.id = BigInt(data.id);
        this.userId = data.user_id ? BigInt(data.user_id) : null;
        this.targetId = data.target_id ? BigInt(data.target_id) : null;
        this.actionType = data.action_type;
        this.reason = data.reason;
        this.guildId = guildId;

        if (data.changes) {
            this.changes = data.changes.map((change: any) => ({
                key: change.key,
                old_value: change.old_value,
                new_value: change.new_value,
            }));
        }

        if (data.options) {
            this.options = {};

            switch (this.actionType) {
                case AuditLogEvent.GUILD_UPDATE:
                    break;
                case AuditLogEvent.CHANNEL_CREATE:
                case AuditLogEvent.CHANNEL_UPDATE:
                case AuditLogEvent.CHANNEL_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    break;
                case AuditLogEvent.CHANNEL_OVERWRITE_CREATE:
                case AuditLogEvent.CHANNEL_OVERWRITE_UPDATE:
                case AuditLogEvent.CHANNEL_OVERWRITE_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    this.options.id = data.options.id;
                    this.options.type = data.options.type;
                    this.options.role_name = data.options.role_name;
                    break;
                case AuditLogEvent.MEMBER_KICK:
                case AuditLogEvent.MEMBER_PRUNE:
                    this.options.delete_member_days = data.options.delete_member_days;
                    this.options.members_removed = data.options.members_removed;
                    break;
                case AuditLogEvent.MEMBER_BAN_ADD:
                case AuditLogEvent.MEMBER_BAN_REMOVE:
                    break;
                case AuditLogEvent.MEMBER_UPDATE:
                case AuditLogEvent.MEMBER_ROLE_UPDATE:
                case AuditLogEvent.MEMBER_MOVE:
                case AuditLogEvent.MEMBER_DISCONNECT:
                case AuditLogEvent.BOT_ADD:
                    this.options.channel_id = data.options.channel_id;
                    this.options.application_id = data.options.application_id;
                    this.options.count = data.options.count;
                    this.options.integration_type = data.options.integration_type;
                    break;
                case AuditLogEvent.ROLE_CREATE:
                case AuditLogEvent.ROLE_UPDATE:
                case AuditLogEvent.ROLE_DELETE:
                    break;
                case AuditLogEvent.INVITE_CREATE:
                case AuditLogEvent.INVITE_UPDATE:
                case AuditLogEvent.INVITE_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    this.options.id = data.options.id;
                    this.options.type = data.options.type;
                    break;
                case AuditLogEvent.WEBHOOK_CREATE:
                case AuditLogEvent.WEBHOOK_UPDATE:
                case AuditLogEvent.WEBHOOK_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    break;
                case AuditLogEvent.EMOJI_CREATE:
                case AuditLogEvent.EMOJI_UPDATE:
                case AuditLogEvent.EMOJI_DELETE:
                    break;
                case AuditLogEvent.MESSAGE_DELETE:
                case AuditLogEvent.MESSAGE_BULK_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    this.options.message_id = data.options.message_id;
                    this.options.count = data.options.count;
                    break;
                case AuditLogEvent.MESSAGE_PIN:
                case AuditLogEvent.MESSAGE_UNPIN:
                    this.options.channel_id = data.options.channel_id;
                    this.options.message_id = data.options.message_id;
                    break;
                case AuditLogEvent.INTEGRATION_CREATE:
                case AuditLogEvent.INTEGRATION_UPDATE:
                case AuditLogEvent.INTEGRATION_DELETE:
                    this.options.id = data.options.id;
                    this.options.type = data.options.type;
                    break;
                case AuditLogEvent.STAGE_INSTANCE_CREATE:
                case AuditLogEvent.STAGE_INSTANCE_UPDATE:
                case AuditLogEvent.STAGE_INSTANCE_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    break;
                case AuditLogEvent.STICKER_CREATE:
                case AuditLogEvent.STICKER_UPDATE:
                case AuditLogEvent.STICKER_DELETE:
                    break;
                case AuditLogEvent.GUILD_SCHEDULED_EVENT_CREATE:
                case AuditLogEvent.GUILD_SCHEDULED_EVENT_UPDATE:
                case AuditLogEvent.GUILD_SCHEDULED_EVENT_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    this.options.entity_type = data.options.entity_type;
                    this.options.location = data.options.location;
                    break;
                case AuditLogEvent.THREAD_CREATE:
                case AuditLogEvent.THREAD_UPDATE:
                case AuditLogEvent.THREAD_DELETE:
                    this.options.channel_id = data.options.channel_id;
                    break;
                case AuditLogEvent.APPLICATION_COMMAND_PERMISSION_UPDATE:
                    this.options.application_id = data.options.application_id;
                    break;
                case AuditLogEvent.AUTO_MODERATION_RULE_CREATE:
                case AuditLogEvent.AUTO_MODERATION_RULE_UPDATE:
                case AuditLogEvent.AUTO_MODERATION_RULE_DELETE:
                case AuditLogEvent.AUTO_MODERATION_BLOCK_MESSAGE:
                case AuditLogEvent.AUTO_MODERATION_FLAG_TO_CHANNEL:
                case AuditLogEvent.AUTO_MODERATION_USER_COMMUNICATION_DISABLED:
                case AuditLogEvent.AUTO_MODERATION_SETTINGS_UPDATE:
                    this.options.auto_moderation_rule_name = data.options.auto_moderation_rule_name;
                    this.options.auto_moderation_rule_trigger_type = data.options.auto_moderation_rule_trigger_type;
                    this.options.channel_id = data.options.channel_id;
                    this.options.count = data.options.count;
                    this.options.trigger_type = data.options.trigger_type;
                    break;
                case AuditLogEvent.SOUNDBOARD_SOUND_CREATE:
                case AuditLogEvent.SOUNDBOARD_SOUND_UPDATE:
                case AuditLogEvent.SOUNDBOARD_SOUND_DELETE:
                case AuditLogEvent.CREATOR_MONETIZATION_REQUEST_CREATED:
                case AuditLogEvent.CREATOR_MONETIZATION_TERMS_ACCEPTED:
                case AuditLogEvent.ONBOARDING_PROMPT_CREATE:
                case AuditLogEvent.ONBOARDING_PROMPT_UPDATE:
                case AuditLogEvent.ONBOARDING_PROMPT_DELETE:
                case AuditLogEvent.ONBOARDING_CREATE:
                case AuditLogEvent.ONBOARDING_UPDATE:
                case AuditLogEvent.HOME_SETTINGS_CREATE:
                case AuditLogEvent.HOME_SETTINGS_UPDATE:
                    this.options = data.options;
                    break;
                default:
                    this.options = data.options; // Fallback to raw options if type is unknown or not specifically mapped
                    break;
            }
        }
    }

    /**
     * Returns the user or application that performed this action.
     * @returns {Promise<User | null>}
     */
    public get executor(): Promise<User | null> {
        if (!this.userId) {
            return Promise.resolve(null);
        }
        return this.client.fetchUser(this.userId);
    }

    /**
     * Returns the target entity of this action.
     * The type of the target depends on the actionType.
     * @returns {Promise<Channel | User | Role | Webhook | Sticker | GuildScheduledEvent | Application | Message | null>}
     */
    public get target(): Promise<any | null> {
        if (!this.targetId) {
            return Promise.resolve(null);
        }

        switch (this.actionType) {
            case AuditLogEvent.CHANNEL_CREATE:
            case AuditLogEvent.CHANNEL_UPDATE:
            case AuditLogEvent.CHANNEL_DELETE:
            case AuditLogEvent.CHANNEL_OVERWRITE_CREATE:
            case AuditLogEvent.CHANNEL_OVERWRITE_UPDATE:
            case AuditLogEvent.CHANNEL_OVERWRITE_DELETE:
            case AuditLogEvent.THREAD_CREATE:
            case AuditLogEvent.THREAD_UPDATE:
            case AuditLogEvent.THREAD_DELETE:
            case AuditLogEvent.STAGE_INSTANCE_CREATE:
            case AuditLogEvent.STAGE_INSTANCE_UPDATE:
            case AuditLogEvent.STAGE_INSTANCE_DELETE:
                return this.client.fetchChannel(this.targetId);

            case AuditLogEvent.MEMBER_KICK:
            case AuditLogEvent.MEMBER_PRUNE:
            case AuditLogEvent.MEMBER_BAN_ADD:
            case AuditLogEvent.MEMBER_BAN_REMOVE:
            case AuditLogEvent.MEMBER_UPDATE:
            case AuditLogEvent.MEMBER_ROLE_UPDATE:
            case AuditLogEvent.MEMBER_MOVE:
            case AuditLogEvent.MEMBER_DISCONNECT:
            case AuditLogEvent.BOT_ADD:
                return this.client.fetchUser(this.targetId);

            case AuditLogEvent.ROLE_CREATE:
            case AuditLogEvent.ROLE_UPDATE:
            case AuditLogEvent.ROLE_DELETE:
                if (!this.guildId) return Promise.resolve(null);
                return this.client.fetchRole(this.guildId, this.targetId);

            case AuditLogEvent.WEBHOOK_CREATE:
            case AuditLogEvent.WEBHOOK_UPDATE:
            case AuditLogEvent.WEBHOOK_DELETE:
                return this.client.fetchWebhook(this.targetId);

            case AuditLogEvent.STICKER_CREATE:
            case AuditLogEvent.STICKER_UPDATE:
            case AuditLogEvent.STICKER_DELETE:
                return this.client.fetchSticker(this.targetId);

            case AuditLogEvent.GUILD_SCHEDULED_EVENT_CREATE:
            case AuditLogEvent.GUILD_SCHEDULED_EVENT_UPDATE:
            case AuditLogEvent.GUILD_SCHEDULED_EVENT_DELETE:
                if (!this.guildId) return Promise.resolve(null);
                return this.client.fetchGuildScheduledEvent(this.guildId, this.targetId);
            
            case AuditLogEvent.APPLICATION_COMMAND_PERMISSION_UPDATE:
                // Assuming we can derive application ID for this case, otherwise might return null
                // For now, we'll return the raw command data as fetchApplicationCommand returns data not class
                if (this.options?.application_id) {
                    return this.client.fetchApplicationCommand(BigInt(this.options.application_id), this.targetId);
                }
                return Promise.resolve(null);

            case AuditLogEvent.MESSAGE_DELETE:
            case AuditLogEvent.MESSAGE_BULK_DELETE:

                return this.client.fetchChannel(this.targetId);

            case AuditLogEvent.MESSAGE_PIN:
            case AuditLogEvent.MESSAGE_UNPIN:
                if (this.options?.channel_id) {
                    return this.client.fetchMessage(BigInt(this.options.channel_id), this.targetId);
                }
                return Promise.resolve(null);

            default:
                return Promise.resolve(null);
        }
    }

    /**
     * Returns a serializable object representation of the audit log entry.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            userId: this.userId?.toString() || null,
            targetId: this.targetId?.toString() || null,
            actionType: this.actionType,
            changes: this.changes,
            options: this.options,
            reason: this.reason,
        };
    }

    /**
     * Returns a formatted string representation of the audit log entry.
     * @returns {string}
     */
    public inspect(): string {
        return `AuditLogEntry { id: '${this.id}', actionType: ${this.actionType} }`;
    }
}