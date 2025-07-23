import { Client } from '../client/Client';
import { User } from './User';
import { Webhook } from './Webhook';
import { GuildScheduledEvent } from './GuildScheduledEvent';
import { Integration } from './Integration';
import { Channel } from './Channel';
import { Thread } from './Thread';
import { Application } from './Application';
import { AuditLogEntry } from './AuditLogEntry';
import { AutoModerationRule } from './AutoModerationRule';

/**
 * Represents the audit log.
 */
export class AuditLog {
    public guildScheduledEvents?: GuildScheduledEvent[];
    public integrations?: Integration[];
    public channels?: Channel[];
    public webhooks?: Webhook[];
    public users: User[];
    public threads?: Thread[];
    public applicationCommands?: Application[];
    public auditLogEntries: AuditLogEntry[];
    public autoModerationRules?: AutoModerationRule[];
    public guildId: bigint;

    private client: Client;

    constructor(client: Client, data: any, guildId: bigint) {
        this.client = client;
        this.guildId = guildId;
        this.guildScheduledEvents = data.guild_scheduled_events ? data.guild_scheduled_events.map((e: any) => new GuildScheduledEvent(this.client, e)) : undefined;
        this.integrations = data.integrations ? data.integrations.map((i: any) => new Integration(this.client, i)) : undefined;
        this.channels = data.channels ? data.channels.map((c: any) => new Channel(this.client, c)) : undefined;
        this.webhooks = data.webhooks ? data.webhooks.map((w: any) => new Webhook(this.client, w)) : [];
        this.users = data.users ? data.users.map((u: any) => new User(this.client, u)) : [];
        this.threads = data.threads ? data.threads.map((t: any) => new Thread(this.client, t)) : undefined;
        this.applicationCommands = data.application_commands ? data.application_commands.map((ac: any) => new Application(this.client, ac)) : undefined;
        this.auditLogEntries = data.audit_log_entries ? data.audit_log_entries.map((entry: any) => new AuditLogEntry(this.client, entry, this.guildId)) : [];
        this.autoModerationRules = data.auto_moderation_rules ? data.auto_moderation_rules.map((rule: any) => new AutoModerationRule(this.client, rule)) : undefined;
    }

    /**
     * Returns a serializable object representation of the audit log.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            guildScheduledEvents: this.guildScheduledEvents?.map(e => e.toJSON()),
            integrations: this.integrations?.map(i => i.toJSON()),
            channels: this.channels?.map(c => c.toJSON()),
            webhooks: this.webhooks?.map(webhook => webhook.toJSON()),
            users: this.users.map(user => user.toJSON()),
            threads: this.threads?.map(t => t.toJSON()),
            applicationCommands: this.applicationCommands?.map(app => app.toJSON()),
            auditLogEntries: this.auditLogEntries.map(entry => entry.toJSON()),
            autoModerationRules: this.autoModerationRules?.map(rule => rule.toJSON()),
            guildId: this.guildId.toString(),
        };
    }

    /**
     * Returns a formatted string representation of the audit log.
     * @returns {string}
     */
    public inspect(): string {
        return `AuditLog { users: ${this.users.length}, entries: ${this.auditLogEntries.length}, guildId: ${this.guildId}, autoModerationRules: ${this.autoModerationRules?.length ?? 'N/A'} }`;
    }
}