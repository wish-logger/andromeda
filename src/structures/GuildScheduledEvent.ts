import { Client } from '../client/Client';
import { Guild } from './Guild';
import { Channel } from './Channel';
import { User } from './User';
import { Member } from './Member';

export enum GuildScheduledEventEntityType {
    STAGE_INSTANCE = 1,
    VOICE = 2,
    EXTERNAL = 3,
}

export enum GuildScheduledEventStatus {
    SCHEDULED = 1,
    ACTIVE = 2,
    COMPLETED = 3,
    CANCELED = 4,
}

/**
 * The privacy level of the guild scheduled event.
 */
export enum GuildScheduledEventPrivacyLevel {
    /**
     * The event is only visible to guild members.
     */
    GUILD_ONLY = 2,
}

export interface GuildScheduledEventEntityMetadata {
    location?: string;
}

export interface GuildScheduledEventUser {
    guildScheduledEventId: bigint;
    user: User;
    member?: Member;
}

export enum RecurrenceRuleFrequency {
    YEARLY = 0,
    MONTHLY = 1,
    WEEKLY = 2,
    DAILY = 3,
}

export enum RecurrenceRuleWeekday {
    MONDAY = 0,
    TUESDAY = 1,
    WEDNESDAY = 2,
    THURSDAY = 3,
    FRIDAY = 4,
    SATURDAY = 5,
    SUNDAY = 6,
}

export interface RecurrenceRuleNWeekday {
    n: number;
    day: RecurrenceRuleWeekday;
}

export enum RecurrenceRuleMonth {
    JANUARY = 1,
    FEBRUARY = 2,
    MARCH = 3,
    APRIL = 4,
    MAY = 5,
    JUNE = 6,
    JULY = 7,
    AUGUST = 8,
    SEPTEMBER = 9,
    OCTOBER = 10,
    NOVEMBER = 11,
    DECEMBER = 12,
}

export interface RecurrenceRule {
    start: Date;
    end?: Date;
    frequency: RecurrenceRuleFrequency;
    interval?: number;
    byWeekday?: RecurrenceRuleWeekday[];
    byNWeekday?: RecurrenceRuleNWeekday[];
    byMonth?: RecurrenceRuleMonth[];
    byMonthDay?: number[];
    byYearDay?: number[];
    count?: number;
}

export class GuildScheduledEvent {
    public id: bigint;
    public guildId: bigint;
    public channelId: bigint | null;
    public creatorId?: bigint | null;
    public name: string;
    public description?: string | null;
    public scheduledStartTime: Date;
    public scheduledEndTime: Date | null;
    public privacyLevel: GuildScheduledEventPrivacyLevel;
    public status: GuildScheduledEventStatus;
    public entityType: GuildScheduledEventEntityType;
    public entityId: bigint | null;
    public entityMetadata: GuildScheduledEventEntityMetadata | null;
    public creator?: User;
    public userCount?: number;
    public image?: string | null;
    public recurrenceRule?: RecurrenceRule;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.guildId = BigInt(data.guild_id);
        this.channelId = data.channel_id ? BigInt(data.channel_id) : null;
        this.creatorId = data.creator_id ? BigInt(data.creator_id) : null;
        this.name = data.name;
        this.description = data.description;
        this.scheduledStartTime = new Date(data.scheduled_start_time);
        this.scheduledEndTime = data.scheduled_end_time ? new Date(data.scheduled_end_time) : null;
        this.privacyLevel = data.privacy_level;
        this.status = data.status;
        this.entityType = data.entity_type;
        this.entityId = data.entity_id ? BigInt(data.entity_id) : null;
        this.entityMetadata = data.entity_metadata ? {
            location: data.entity_metadata.location,
        } : null;
        this.creator = data.creator ? new User(this.client, data.creator) : undefined;
        this.userCount = data.user_count;
        this.image = data.image;
        this.recurrenceRule = data.recurrence_rule ? {
            start: new Date(data.recurrence_rule.start),
            end: data.recurrence_rule.end ? new Date(data.recurrence_rule.end) : undefined,
            frequency: data.recurrence_rule.frequency,
            interval: data.recurrence_rule.interval,
            byWeekday: data.recurrence_rule.by_weekday,
            byNWeekday: data.recurrence_rule.by_n_weekday?.map((nwd: any) => ({
                n: nwd.n,
                day: nwd.day,
            })),
            byMonth: data.recurrence_rule.by_month,
            byMonthDay: data.recurrence_rule.by_month_day,
            byYearDay: data.recurrence_rule.by_year_day,
            count: data.recurrence_rule.count,
        } : undefined;
    }

    /**
     * Returns the guild associated with this event.
     * @returns {Promise<Guild | null>}
     */
    public async fetchGuild(): Promise<Guild | null> {
        return this.client.guilds.fetch(this.guildId);
    }

    /**
     * Returns the channel associated with this event, if applicable.
     * @returns {Promise<Channel | null>}
     */
    public async fetchChannel(): Promise<Channel | null> {
        if (!this.channelId) return null;
        return this.client.fetchChannel(this.channelId);
    }

    /**
     * Returns the creator of this event, if available.
     * @returns {Promise<User | null>}
     */
    public async fetchCreator(): Promise<User | null> {
        if (!this.creatorId) return null;
        return this.client.fetchUser(this.creatorId);
    }

    /**
     * Returns the URL of the event's cover image.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public imageURL(format: string = 'png', size: number = 128): string | null {
        if (!this.image) return null;
        return `https://cdn.discordapp.com/guild-events/${this.id.toString()}/${this.image}.${format}?size=${size}`;
    }

    /**
     * Returns a serializable object representation of the scheduled event.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            guildId: this.guildId.toString(),
            channelId: this.channelId?.toString() || null,
            creatorId: this.creatorId?.toString() || null,
            name: this.name,
            description: this.description,
            scheduledStartTime: this.scheduledStartTime.toISOString(),
            scheduledEndTime: this.scheduledEndTime?.toISOString() || null,
            privacyLevel: this.privacyLevel,
            status: this.status,
            entityType: this.entityType,
            entityId: this.entityId?.toString() || null,
            entityMetadata: this.entityMetadata,
            creator: this.creator?.toJSON(),
            userCount: this.userCount,
            image: this.image,
            recurrenceRule: this.recurrenceRule ? {
                start: this.recurrenceRule.start.toISOString(),
                end: this.recurrenceRule.end?.toISOString() || undefined,
                frequency: this.recurrenceRule.frequency,
                interval: this.recurrenceRule.interval,
                by_weekday: this.recurrenceRule.byWeekday,
                by_n_weekday: this.recurrenceRule.byNWeekday?.map(nwd => ({
                    n: nwd.n,
                    day: nwd.day,
                })),
                by_month: this.recurrenceRule.byMonth,
                by_month_day: this.recurrenceRule.byMonthDay,
                by_year_day: this.recurrenceRule.byYearDay,
                count: this.recurrenceRule.count,
            } : undefined,
        };
    }

    /**
     * Returns a formatted string representation of the scheduled event.
     * @returns {string}
     */
    public inspect(): string {
        return `GuildScheduledEvent { id: '${this.id}', name: '${this.name}', status: ${this.status} }`;
    }
}