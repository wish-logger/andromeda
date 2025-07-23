import { Client } from '../client/Client';

export class PermissionOverwrite {
    public id: bigint;
    public type: number;
    public allow: bigint;
    public deny: bigint;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.type = data.type;
        this.allow = BigInt(data.allow);
        this.deny = BigInt(data.deny);
    }

    /**
     * Returns a serializable object representation of the permission overwrite.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            type: this.type,
            allow: this.allow.toString(),
            deny: this.deny.toString(),
        };
    }

    /**
     * Checks if a specific permission is allowed.
     * @param {bigint} permission The permission flag to check.
     * @returns {boolean}
     */
    public allows(permission: bigint): boolean {
        return (this.allow & permission) === permission;
    }

    /**
     * Checks if a specific permission is denied.
     * @param {bigint} permission The permission flag to check.
     * @returns {boolean}
     */
    public denies(permission: bigint): boolean {
        return (this.deny & permission) === permission;
    }

    /**
     * Returns a formatted string representation of the permission overwrite.
     * @returns {string}
     */
    public inspect(): string {
        return `PermissionOverwrite { id: '${this.id}', type: ${this.type}, allow: ${this.allow}, deny: ${this.deny} }`;
    }
}