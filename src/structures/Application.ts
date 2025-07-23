import { Client } from '../client/Client';
import { User } from './User';

export interface Team {
    icon: string | null;
    id: bigint;
    members: TeamMember[];
    name: string;
    ownerUserId: bigint;
}

export interface TeamMember {
    membershipState: number;
    permissions: string[];
    teamId: bigint;
    user: User;
}

export interface PartialGuild {
    id: bigint;
    name: string;
    icon: string | null;
    splash: string | null;
    banner: string | null;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    vanityUrlCode: string | null;
    description: string | null;
    features: string[];
    verificationLevel: number;
    nsfwLevel: number;
    premiumTier: number;
}

export interface IntegrationTypeConfig {
    oauth2InstallParams?: { scopes: string[]; permissions: string; };
}

export class Application {
    public id: bigint;
    public name: string;
    public icon: string | null;
    public description: string;
    public rpcOrigins?: string[];
    public botPublic?: boolean;
    public botRequireCodeGrant?: boolean;
    public termsOfServiceUrl?: string;
    public privacyPolicyUrl?: string;
    public owner?: User;
    public verifyKey: string;
    public guildId?: bigint;
    public primarySkuId?: bigint;
    public slug?: string;
    public coverImage?: string | null;
    public flags?: number;
    public tags?: string[];
    public installParams?: { scopes: string[]; permissions: string; };
    public customInstallUrl?: string;
    public roleConnectionsVerificationUrl?: string;
    public bot?: User;
    public team?: Team | null;
    public guild?: PartialGuild | null;
    public approximateGuildCount?: number;
    public approximateUserInstallCount?: number;
    public approximateUserAuthorizationCount?: number;
    public redirectUris?: string[];
    public interactionsEndpointUrl?: string | null;
    public eventWebhooksUrl?: string | null;
    public eventWebhooksStatus?: number;
    public eventWebhooksTypes?: string[];
    public integrationTypesConfig?: { [key: number]: IntegrationTypeConfig; };

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.name = data.name;
        this.icon = data.icon;
        this.description = data.description;
        this.rpcOrigins = data.rpc_origins;
        this.botPublic = data.bot_public;
        this.botRequireCodeGrant = data.bot_require_code_grant;
        this.termsOfServiceUrl = data.terms_of_service_url;
        this.privacyPolicyUrl = data.privacy_policy_url;
        this.owner = data.owner ? new User(this.client, data.owner) : undefined;
        this.verifyKey = data.verify_key;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : undefined;
        this.primarySkuId = data.primary_sku_id ? BigInt(data.primary_sku_id) : undefined;
        this.slug = data.slug;
        this.coverImage = data.cover_image;
        this.flags = data.flags;
        this.tags = data.tags;
        this.installParams = data.install_params;
        this.customInstallUrl = data.custom_install_url;
        this.roleConnectionsVerificationUrl = data.role_connections_verification_url;
        this.bot = data.bot ? new User(this.client, data.bot) : undefined;
        this.team = data.team ? {
            icon: data.team.icon,
            id: BigInt(data.team.id),
            members: data.team.members.map((m: any) => ({
                membershipState: m.membership_state,
                permissions: m.permissions,
                teamId: BigInt(m.team_id),
                user: new User(this.client, m.user),
            })),
            name: data.team.name,
            ownerUserId: BigInt(data.team.owner_user_id),
        } : undefined;
        this.guild = data.guild ? {
            id: BigInt(data.guild.id),
            name: data.guild.name,
            icon: data.guild.icon,
            splash: data.guild.splash,
            banner: data.guild.banner,
            approximateMemberCount: data.guild.approximate_member_count,
            approximatePresenceCount: data.guild.approximate_presence_count,
            vanityUrlCode: data.guild.vanity_url_code,
            description: data.guild.description,
            features: data.guild.features,
            verificationLevel: data.guild.verification_level,
            nsfwLevel: data.guild.nsfw_level,
            premiumTier: data.guild.premium_tier,
        } : undefined;
        this.approximateGuildCount = data.approximate_guild_count;
        this.approximateUserInstallCount = data.approximate_user_install_count;
        this.approximateUserAuthorizationCount = data.approximate_user_authorization_count;
        this.redirectUris = data.redirect_uris;
        this.interactionsEndpointUrl = data.interactions_endpoint_url;
        this.eventWebhooksUrl = data.event_webhooks_url;
        this.eventWebhooksStatus = data.event_webhooks_status;
        this.eventWebhooksTypes = data.event_webhooks_types;
        this.integrationTypesConfig = data.integration_types_config;
    }

    /**
     * Returns the URL of the application's icon.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public iconURL(format: string = 'png', size: number = 128): string | null {
        if (!this.icon) return null;
        return `https://cdn.discordapp.com/app-icons/${this.id.toString()}/${this.icon}.${format}?size=${size}`;
    }

    /**
     * Returns a serializable object representation of the application.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            name: this.name,
            icon: this.icon,
            description: this.description,
            rpcOrigins: this.rpcOrigins,
            botPublic: this.botPublic,
            botRequireCodeGrant: this.botRequireCodeGrant,
            termsOfServiceUrl: this.termsOfServiceUrl,
            privacyPolicyUrl: this.privacyPolicyUrl,
            owner: this.owner?.toJSON(),
            verifyKey: this.verifyKey,
            guildId: this.guildId?.toString(),
            primarySkuId: this.primarySkuId?.toString(),
            slug: this.slug,
            coverImage: this.coverImage,
            flags: this.flags,
            tags: this.tags,
            installParams: this.installParams,
            customInstallUrl: this.customInstallUrl,
            roleConnectionsVerificationUrl: this.roleConnectionsVerificationUrl,
            bot: this.bot?.toJSON(),
            team: this.team ? {
                icon: this.team.icon,
                id: this.team.id.toString(),
                members: this.team.members.map(m => ({
                    membershipState: m.membershipState,
                    permissions: m.permissions,
                    teamId: m.teamId.toString(),
                    user: m.user.toJSON(),
                })),
                name: this.team.name,
                ownerUserId: this.team.ownerUserId.toString(),
            } : undefined,
            guild: this.guild ? {
                id: this.guild.id.toString(),
                name: this.guild.name,
                icon: this.guild.icon,
                splash: this.guild.splash,
                banner: this.guild.banner,
                approximateMemberCount: this.guild.approximateMemberCount,
                approximatePresenceCount: this.guild.approximatePresenceCount,
                vanityUrlCode: this.guild.vanityUrlCode,
                description: this.guild.description,
                features: this.guild.features,
                verificationLevel: this.guild.verificationLevel,
                nsfwLevel: this.guild.nsfwLevel,
                premiumTier: this.guild.premiumTier,
            } : undefined,
            approximateGuildCount: this.approximateGuildCount,
            approximateUserInstallCount: this.approximateUserInstallCount,
            approximateUserAuthorizationCount: this.approximateUserAuthorizationCount,
            redirectUris: this.redirectUris,
            interactionsEndpointUrl: this.interactionsEndpointUrl,
            eventWebhooksUrl: this.eventWebhooksUrl,
            eventWebhooksStatus: this.eventWebhooksStatus,
            eventWebhooksTypes: this.eventWebhooksTypes,
            integrationTypesConfig: this.integrationTypesConfig,
        };
    }

    /**
     * Returns a formatted string representation of the application.
     * @returns {string}
     */
    public inspect(): string {
        return `Application { id: '${this.id}', name: '${this.name}', description: '${this.description?.substring(0, 50) + (this.description && this.description.length > 50 ? '...' : '')}', guilds: ${this.approximateGuildCount ?? 'N/A'} }`;
    }
}