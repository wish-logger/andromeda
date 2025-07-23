import { Client } from '../client/Client';

/**
 * Characterizes the type of content which can trigger the rule.
 */
export enum AutoModerationTriggerType {
    KEYWORD = 1,
    SPAM = 3,
    KEYWORD_PRESET = 4,
    MENTION_SPAM = 5,
    MEMBER_PROFILE = 6,
}

/**
 * Internally pre-defined wordsets which will be searched for in content.
 */
export enum KeywordPresetType {
    PROFANITY = 1,
    SEXUAL_CONTENT = 2,
    SLURS = 3,
}

/**
 * Indicates in what event context a rule should be checked.
 */
export enum AutoModerationEventType {
    MESSAGE_SEND = 1,
    MEMBER_UPDATE = 2,
}

/**
 * The type of action.
 */
export enum AutoModerationActionType {
    BLOCK_MESSAGE = 1,
    SEND_ALERT_MESSAGE = 2,
    TIMEOUT = 3,
    BLOCK_MEMBER_INTERACTION = 4,
}

/**
 * Additional data used to determine whether a rule should be triggered.
 */
export interface AutoModerationTriggerMetadata {
    keywordFilter?: string[];
    regexPatterns?: string[];
    presets?: KeywordPresetType[];
    allowList?: string[];
    mentionTotalLimit?: number;
    mentionRaidProtectionEnabled?: boolean;
}

/**
 * Additional data used when an action is executed.
 */
export interface AutoModerationActionMetadata {
    channelId?: bigint;
    durationSeconds?: number;
    customMessage?: string;
}

/**
 * An action which will execute whenever a rule is triggered.
 */
export interface AutoModerationAction {
    type: AutoModerationActionType;
    metadata?: AutoModerationActionMetadata;
}

/**
 * Represents an Auto Moderation Rule.
 */
export class AutoModerationRule {
    public id: bigint;
    public guildId: bigint;
    public name: string;
    public creatorId: bigint;
    public eventType: AutoModerationEventType;
    public triggerType: AutoModerationTriggerType;
    public triggerMetadata?: AutoModerationTriggerMetadata;
    public actions: AutoModerationAction[];
    public enabled: boolean;
    public exemptRoles: bigint[];
    public exemptChannels: bigint[];

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.guildId = BigInt(data.guild_id);
        this.name = data.name;
        this.creatorId = BigInt(data.creator_id);
        this.eventType = data.event_type;
        this.triggerType = data.trigger_type;
        this.triggerMetadata = data.trigger_metadata ? {
            keywordFilter: data.trigger_metadata.keyword_filter,
            regexPatterns: data.trigger_metadata.regex_patterns,
            presets: data.trigger_metadata.presets,
            allowList: data.trigger_metadata.allow_list,
            mentionTotalLimit: data.trigger_metadata.mention_total_limit,
            mentionRaidProtectionEnabled: data.trigger_metadata.mention_raid_protection_enabled,
        } : undefined;
        this.actions = data.actions.map((action: any) => ({
            type: action.type,
            metadata: action.metadata ? {
                channelId: action.metadata.channel_id ? BigInt(action.metadata.channel_id) : undefined,
                durationSeconds: action.metadata.duration_seconds,
                customMessage: action.metadata.custom_message,
            } : undefined,
        }));
        this.enabled = data.enabled;
        this.exemptRoles = data.exempt_roles.map((id: string) => BigInt(id));
        this.exemptChannels = data.exempt_channels.map((id: string) => BigInt(id));
    }

    /**
     * Returns a serializable object representation of the auto moderation rule.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            guildId: this.guildId.toString(),
            name: this.name,
            creatorId: this.creatorId.toString(),
            eventType: this.eventType,
            triggerType: this.triggerType,
            triggerMetadata: this.triggerMetadata,
            actions: this.actions.map(action => ({
                type: action.type,
                metadata: action.metadata ? {
                    channel_id: action.metadata.channelId?.toString(),
                    duration_seconds: action.metadata.durationSeconds,
                    custom_message: action.metadata.customMessage,
                } : undefined,
            })),
            enabled: this.enabled,
            exemptRoles: this.exemptRoles.map(id => id.toString()),
            exemptChannels: this.exemptChannels.map(id => id.toString()),
        };
    }

    /**
     * Returns a formatted string representation of the auto moderation rule.
     * @returns {string}
     */
    public inspect(): string {
        return `AutoModerationRule { id: '${this.id}', name: '${this.name}', type: ${this.triggerType}, enabled: ${this.enabled} }`;
    }
}