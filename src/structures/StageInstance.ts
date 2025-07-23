import { Client } from '../client/Client';

/**
 * Privacy level of a stage instance.
 */
export enum StageInstancePrivacyLevel {
    /**
     * The stage instance is visible publicly.
     */
    PUBLIC = 1,
    /**
     * The stage instance is visible to guild members only.
     */
    GUILD_ONLY = 2,
}

/**
 * Represents a stage instance in a guild.
 */
export class StageInstance {
    /**
     * The ID of the stage instance.
     * @type {bigint}
     */
    public id: bigint;

    /**
     * The guild ID of the stage instance.
     * @type {bigint}
     */
    public guildId: bigint;

    /**
     * The channel ID of the stage instance.
     * @type {bigint}
     */
    public channelId: bigint;

    /**
     * The topic of the stage instance.
     * @type {string}
     */
    public topic: string;

    /**
     * The privacy level of the stage instance.
     * @type {StageInstancePrivacyLevel}
     */
    public privacyLevel: StageInstancePrivacyLevel;

    /**
     * Whether the stage instance is discoverable.
     * @type {boolean}
     */
    public discoverableDisabled: boolean;
    public guildScheduledEventId: bigint | null;

    private client: Client;

    /**
     * @param {Client} client The client that instantiated this stage instance.
     * @param {any} data The raw data for the stage instance.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.guildId = BigInt(data.guild_id);
        this.channelId = BigInt(data.channel_id);
        this.topic = data.topic;
        this.privacyLevel = data.privacy_level;
        this.discoverableDisabled = data.discoverable_disabled;
        this.guildScheduledEventId = data.guild_scheduled_event_id ? BigInt(data.guild_scheduled_event_id) : null;
    }

    /**
     * Returns a serializable object representation of the stage instance.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            guild_id: this.guildId.toString(),
            channel_id: this.channelId.toString(),
            topic: this.topic,
            privacy_level: this.privacyLevel,
            discoverable_disabled: this.discoverableDisabled,
            guild_scheduled_event_id: this.guildScheduledEventId?.toString() ?? null,
        };
    }
}