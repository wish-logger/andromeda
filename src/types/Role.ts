/**
 * Represents the tags a role has.
 */
export interface RoleTags {
    bot_id?: string;
    integration_id?: string;
    premium_subscriber?: null;
}

export interface RoleCreateOptions {
    name?: string;
    permissions?: bigint;
    color?: number;
    hoist?: boolean;
    icon?: string | null;
    unicodeEmoji?: string | null;
    mentionable?: boolean;
    reason?: string;
}