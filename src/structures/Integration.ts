import { Client } from '../client/Client';
import { User } from './User';
import { Application } from './Application';

export class Integration {
    public id: bigint;
    public name: string;
    public type: string;
    public enabled: boolean;
    public syncing: boolean;
    public roleId?: bigint;
    public enableEmoticons?: boolean;
    public expireBehavior?: number;
    public expireGracePeriod?: number;
    public user?: User;
    public account: { id: string; name: string; };
    public syncedAt: Date;
    public subscriberCount?: number;
    public revoked?: boolean;
    public application?: Application;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.name = data.name;
        this.type = data.type;
        this.enabled = data.enabled;
        this.syncing = data.syncing;
        this.roleId = data.role_id ? BigInt(data.role_id) : undefined;
        this.enableEmoticons = data.enable_emoticons;
        this.expireBehavior = data.expire_behavior;
        this.expireGracePeriod = data.expire_grace_period;
        this.user = data.user ? new User(this.client, data.user) : undefined;
        this.account = data.account;
        this.syncedAt = new Date(data.synced_at);
        this.subscriberCount = data.subscriber_count;
        this.revoked = data.revoked;
        this.application = data.application ? new Application(this.client, data.application) : undefined;
    }

    /**
     * Returns a serializable object representation of the integration.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            name: this.name,
            type: this.type,
            enabled: this.enabled,
            syncing: this.syncing,
            roleId: this.roleId?.toString(),
            enableEmoticons: this.enableEmoticons,
            expireBehavior: this.expireBehavior,
            expireGracePeriod: this.expireGracePeriod,
            user: this.user?.toJSON(),
            account: this.account,
            syncedAt: this.syncedAt.toISOString(),
            subscriberCount: this.subscriberCount,
            revoked: this.revoked,
            application: this.application?.toJSON(),
        };
    }

    /**
     * Returns a formatted string representation of the integration.
     * @returns {string}
     */
    public inspect(): string {
        return `Integration { id: '${this.id}', name: '${this.name}', type: '${this.type}' }`;
    }
}