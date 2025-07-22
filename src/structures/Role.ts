import { Client } from '../client/Client';
import { PermissionFlagsBits } from '../types/Permissions';
import { RoleTags } from '../types/Role';

export class Role {
    public id: string;
    public name: string;
    public color: number;
    public hoist: boolean;
    public icon?: string | null;
    public unicodeEmoji?: string | null;
    public position: number;
    public permissions: bigint;
    public managed: boolean;
    public mentionable: boolean;
    public tags?: RoleTags;
    public guildId: string;

    private client: Client;

    constructor(client: Client, data: any, guildId: string) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.color = data.color;
        this.hoist = data.hoist;
        this.icon = data.icon;
        this.unicodeEmoji = data.unicode_emoji;
        this.position = data.position;
        this.permissions = BigInt(data.permissions);
        this.managed = data.managed;
        this.mentionable = data.mentionable;
        this.tags = data.tags;
        this.guildId = guildId;
    }

    /**
     * Returns a mention string for the role.
     * @returns {string}
     */
    public toString(): string {
        return `<@&${this.id}>`;
    }

    /**
     * Checks if the role has a specific permission.
     * @param {bigint} permission The permission flag to check.
     * @returns {boolean}
     */
    public hasPermission(permission: bigint): boolean {
        return (this.permissions & permission) === permission;
    }

    /**
     * Checks if the role has any of the specified permissions.
     * @param {bigint[]} permissions An array of permission flags to check.
     * @returns {boolean}
     */
    public hasAnyPermission(permissions: bigint[]): boolean {
        return permissions.some(p => this.hasPermission(p));
    }

    /**
     * Checks if the role has all of the specified permissions.
     * @param {bigint[]} permissions An array of permission flags to check.
     * @returns {boolean}
     */
    public hasAllPermissions(permissions: bigint[]): boolean {
        return permissions.every(p => this.hasPermission(p));
    }

    // TODO: Add methods for role management (edit, delete, etc.)
} 