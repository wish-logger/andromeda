import { Client } from '../client/Client';

/**
 * Entitlement types.
 */
export enum EntitlementType {
    PURCHASE = 1,
    PREMIUM_SUBSCRIPTION = 2,
    APPLICATION_SUBSCRIPTION = 3,
    TEST_MODE_PURCHASE = 4,
    FREE_PURCHASE = 5,
    USER_GIFT = 6,
    DELEGATION = 7,
    AUTO_SUBSCRIPTION = 8,
    RECIPROCATED_BY_APPLICATION = 9,
}

/**
 * Represents a user's entitlement to an SKU.
 */
export class Entitlement {
    /**
     * ID of the entitlement.
     * @type {bigint}
     */
    public id: bigint;

    /**
     * ID of the SKU.
     * @type {bigint}
     */
    public skuId: bigint;

    /**
     * ID of the user that is granted the entitlement.
     * @type {bigint}
     */
    public userId: bigint;

    /**
     * ID of the application that owns the SKU.
     * @type {bigint}
     */
    public applicationId: bigint;

    /**
     * Type of the entitlement.
     * @type {EntitlementType}
     */
    public type: EntitlementType;

    /**
     * ID of the guild that the entitlement belongs to, if any.
     * @type {bigint | undefined}
     */
    public guildId?: bigint;

    /**
     * ID of the parent entitlement, if any.
     * @type {bigint | undefined}
     */
    public parentId?: bigint;

    /**
     * When the entitlement was granted.
     * @type {Date}
     */
    public startsAt: Date;

    /**
     * When the entitlement will expire, if it is a subscription.
     * @type {Date | undefined}
     */
    public endsAt?: Date;

    /**
     * Is the entitlement deleted.
     * @type {boolean}
     */
    public deleted: boolean;

    /**
     * Is the entitlement consumable.
     * @type {boolean}
     */
    public consumable: boolean;

    private client: Client;

    /**
     * @param {Client} client The client that instantiated this entitlement.
     * @param {any} data The raw data for the entitlement.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.skuId = BigInt(data.sku_id);
        this.userId = BigInt(data.user_id);
        this.applicationId = BigInt(data.application_id);
        this.type = data.type;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : undefined;
        this.parentId = data.parent_id ? BigInt(data.parent_id) : undefined;
        this.startsAt = new Date(data.starts_at);
        this.endsAt = data.ends_at ? new Date(data.ends_at) : undefined;
        this.deleted = data.deleted;
        this.consumable = data.consumable;
    }

    /**
     * Returns a serializable object representation of the entitlement.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            sku_id: this.skuId.toString(),
            user_id: this.userId.toString(),
            application_id: this.applicationId.toString(),
            type: this.type,
            guild_id: this.guildId?.toString(),
            parent_id: this.parentId?.toString(),
            starts_at: this.startsAt.toISOString(),
            ends_at: this.endsAt?.toISOString(),
            deleted: this.deleted,
            consumable: this.consumable,
        };
    }
}