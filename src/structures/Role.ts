import { Client } from '../client/Client';
import { PermissionFlagsBits } from '../types/Permissions';
import { RoleTags } from '../types/Role';

export interface RoleEditOptions {
    name?: string;
    permissions?: bigint;
    color?: number;
    hoist?: boolean;
    icon?: string | null;
    unicodeEmoji?: string | null;
    mentionable?: boolean;
    position?: number;
    reason?: string;
    // "Enhanced Role Styles" (gradient, holo and other stuff)
    style?: RoleStyle;
}

export interface RoleStyle {
    type: 'solid' | 'gradient' | 'holographic';
    colors?: number[]; // [startColor, endColor]
    direction?: 'horizontal' | 'vertical' | 'diagonal'; // Gradient
    animationSpeed?: 'slow' | 'normal' | 'fast'; // Holo
}

export class Role {
    public id: bigint;
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
    public guildId: bigint;
    // Enh
    public style?: RoleStyle;
    public enhancedColors?: number[];
    public gradientDirection?: string;
    public holographicAnimation?: boolean;

    private client: Client;

    constructor(client: Client, data: any, guildId: string) {
        this.client = client;
        this.id = BigInt(data.id);
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
        this.guildId = BigInt(guildId);
        
        // Enh
        if (data.style) {
            this.style = data.style;
            this.enhancedColors = data.style.colors;
            this.gradientDirection = data.style.direction;
            this.holographicAnimation = data.style.type === 'holographic';
        }
    }

    /**
     * Returns a mention string for the role.
     * @returns {string}
     */
    public toString(): string {
        return `<@&${this.id.toString()}>`;
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

    /**
     * Checks if the role has enhanced styling (gradient or holographic).
     * @returns {boolean}
     */
    public hasEnhancedStyle(): boolean {
        return this.style !== undefined && this.style.type !== 'solid';
    }

    /**
     * Checks if the role has gradient styling.
     * @returns {boolean}
     */
    public hasGradientStyle(): boolean {
        return this.style?.type === 'gradient';
    }

    /**
     * Checks if the role has holographic styling.
     * @returns {boolean}
     */
    public hasHolographicStyle(): boolean {
        return this.style?.type === 'holographic';
    }

    /**
     * Gets the gradient colors if the role has gradient styling.
     * @returns {number[] | null}
     */
    public getGradientColors(): number[] | null {
        if (!this.hasGradientStyle() || !this.enhancedColors) return null;
        return this.enhancedColors;
    }

    /**
     * Gets the gradient colors as hex strings.
     * @returns {string[] | null}
     */
    public getGradientColorsHex(): string[] | null {
        const colors = this.getGradientColors();
        if (!colors) return null;
        return colors.map(color => `#${color.toString(16).padStart(6, '0')}`);
    }

    /**
     * Gets the gradient direction.
     * @returns {string | null}
     */
    public getGradientDirection(): string | null {
        return this.gradientDirection || null;
    }

    /**
     * Sets enhanced style for the role (gradient or holographic).
     * @param {RoleStyle} style The enhanced style configuration.
     * @param {string} [reason] The reason for the change.
     * @returns {Promise<Role>}
     */
    public async setEnhancedStyle(style: RoleStyle, reason?: string): Promise<Role> {
        // womp womp, check if server has 3rd lvl of boosts or shiiiiii high !!!!!!
        const guild = await this.client.guilds.fetch(BigInt(this.guildId));
        if (!guild?.premiumTier || (guild.premiumSubscriptionCount ?? 0) < 3) {
            throw new Error('Server needs 3 boosts to use Enhanced Role Styles');
        }

        const data: any = {
            style: {
                type: style.type,
                ...(style.colors && { colors: style.colors }),
                ...(style.direction && { direction: style.direction }),
                ...(style.animationSpeed && { animation_speed: style.animationSpeed })
            }
        };

        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        const response = await this.client.rest.request('PATCH',
            `/guilds/${this.guildId}/roles/${this.id}`,
            data, headers
        );

        const updatedData = response;
        
        this.style = updatedData.style;
        this.enhancedColors = updatedData.style?.colors;
        this.gradientDirection = updatedData.style?.direction;
        this.holographicAnimation = updatedData.style?.type === 'holographic';

        return this;
    }

    /**
     * Sets gradient style for the role.
     * @param {number} startColor The starting color of the gradient.
     * @param {number} endColor The ending color of the gradient.
     * @param {'horizontal' | 'vertical' | 'diagonal'} [direction='horizontal'] The gradient direction.
     * @param {string} [reason] The reason for the change.
     * @returns {Promise<Role>}
     */
    public async setGradient(
        startColor: number, 
        endColor: number, 
        direction: 'horizontal' | 'vertical' | 'diagonal' = 'horizontal',
        reason?: string
    ): Promise<Role> {
        return this.setEnhancedStyle({
            type: 'gradient',
            colors: [startColor, endColor],
            direction
        }, reason);
    }

    /**
     * Sets holographic style for the role.
     * @param {'slow' | 'normal' | 'fast'} [animationSpeed='normal'] The animation speed.
     * @param {string} [reason] The reason for the change.
     * @returns {Promise<Role>}
     */
    public async setHolographic(
        animationSpeed: 'slow' | 'normal' | 'fast' = 'normal',
        reason?: string
    ): Promise<Role> {
        return this.setEnhancedStyle({
            type: 'holographic',
            animationSpeed
        }, reason);
    }

    /**
     * Checks if the role is higher in hierarchy than another role.
     * @param {Role} role The role to compare against.
     * @returns {boolean}
     */
    public isHigherThan(role: Role): boolean {
        return this.position > role.position;
    }

    /**
     * Checks if the role is lower in hierarchy than another role.
     * @param {Role} role The role to compare against.
     * @returns {boolean}
     */
    public isLowerThan(role: Role): boolean {
        return this.position < role.position;
    }

    /**
     * Checks if the role is the @everyone role.
     * @returns {boolean}
     */
    public isEveryone(): boolean {
        return this.id.toString() === this.guildId.toString();
    }

    /**
     * Checks if the role is a bot role.
     * @returns {boolean}
     */
    public isBotRole(): boolean {
        return this.tags?.bot_id !== undefined;
    }

    /**
     * Checks if the role is a premium subscriber role.
     * @returns {boolean}
     */
    public isPremiumSubscriberRole(): boolean {
        return this.tags?.premium_subscriber !== undefined;
    }

    /**
     * Checks if the role is an integration role.
     * @returns {boolean}
     */
    public isIntegrationRole(): boolean {
        return this.tags?.integration_id !== undefined;
    }

    /**
     * Gets the hex color of the role.
     * @returns {string}
     */
    public getHexColor(): string {
        return `#${this.color.toString(16).padStart(6, '0')}`; // Color is number, so toString is fine
    }

    /**
     * Gets members who have this role.
     * @returns {Promise<GuildMember[]>}
     */
    public async getMembers(): Promise<any[]> {
        const guild = await this.client.guilds.fetch(this.guildId);
        if (!guild) throw new Error('Guild not found');
        
        const members = await guild.members();
        return members.filter((member: any) => member.roles.cache.has(this.id));
    }

    /**
     * Gets the number of members who have this role.
     * @returns {Promise<number>}
     */
    public async getMemberCount(): Promise<number> {
        const members = await this.getMembers();
        return members.length;
    }

    /**
     * Edits the role.
     * @param {RoleEditOptions} options The options for editing the role.
     * @returns {Promise<Role>}
     */
    public async edit(options: RoleEditOptions): Promise<Role> {
        if (this.managed) {
            throw new Error('Cannot edit a managed role');
        }

        const data: any = {};
        
        if (options.name !== undefined) data.name = options.name;
        if (options.permissions !== undefined) data.permissions = options.permissions.toString();
        if (options.color !== undefined) data.color = options.color;
        if (options.hoist !== undefined) data.hoist = options.hoist;
        if (options.icon !== undefined) data.icon = options.icon;
        if (options.unicodeEmoji !== undefined) data.unicode_emoji = options.unicodeEmoji;
        if (options.mentionable !== undefined) data.mentionable = options.mentionable;
        if (options.style !== undefined) data.style = options.style;

        const headers: any = { 'Content-Type': 'application/json' };
        if (options.reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(options.reason);
        }

        const response = await this.client.rest.request('PATCH',
            `/guilds/${this.guildId.toString()}/roles/${this.id.toString()}`,
            data, headers
        );

        const updatedData = response;
        
        this.name = updatedData.name;
        this.permissions = BigInt(updatedData.permissions);
        this.color = updatedData.color;
        this.hoist = updatedData.hoist;
        this.icon = updatedData.icon;
        this.unicodeEmoji = updatedData.unicode_emoji;
        this.mentionable = updatedData.mentionable;
        
        if (updatedData.style) {
            this.style = updatedData.style;
            this.enhancedColors = updatedData.style.colors;
            this.gradientDirection = updatedData.style.direction;
            this.holographicAnimation = updatedData.style.type === 'holographic';
        }

        return this;
    }

    /**
     * Sets the role's position.
     * @param {number} position The new position for the role.
     * @param {string} [reason] The reason for changing the position.
     * @returns {Promise<Role>}
     */
    public async setPosition(position: number, reason?: string): Promise<Role> {
        if (this.managed) {
            throw new Error('Cannot change position of a managed role');
        }

        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        await this.client.rest.request('PATCH',
            `/guilds/${this.guildId.toString()}/roles`,
            [{ id: this.id.toString(), position }],
            headers
        );

        this.position = position;
        return this;
    }

    /**
     * Deletes the role.
     * @param {string} [reason] The reason for deleting the role.
     * @returns {Promise<void>}
     */
    public async delete(reason?: string): Promise<void> {
        if (this.managed) {
            throw new Error('Cannot delete a managed role');
        }

        if (this.isEveryone()) {
            throw new Error('Cannot delete the @everyone role');
        }

        const headers: any = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        await this.client.rest.request('DELETE',
            `/guilds/${this.guildId.toString()}/roles/${this.id.toString()}`,
            undefined,
            headers
        );
    }

    /**
     * Clones the role.
     * @param {string} [name] The name for the cloned role.
     * @param {string} [reason] The reason for cloning the role.
     * @returns {Promise<Role>}
     */
    public async clone(name?: string, reason?: string): Promise<Role> {
        const guild = await this.client.guilds.fetch(this.guildId);
        if (!guild) throw new Error('Guild not found');

        return await guild.createRole({
            name: name || `${this.name} (Clone)`,
            color: this.color,
            hoist: this.hoist,
            permissions: this.permissions,
            mentionable: this.mentionable,
            icon: this.icon,
            unicodeEmoji: this.unicodeEmoji,
            reason
        });
    }

    /**
     * Compares this role with another role.
     * @param {Role} role The role to compare with.  
     * @returns {number} -1 if this role is lower, 0 if equal, 1 if higher.
     */
    public comparePositionTo(role: Role): number {
        if (this.position < role.position) return -1;
        if (this.position > role.position) return 1;
        return 0;
    }

    /**
     * Checks if the role can be assigned to a member by the client.
     * @returns {boolean}
     */
    public isAssignable(): boolean {
        if (this.managed) return false;
        if (this.isEveryone()) return false;
        
        return true;
    }

    /**
     * Returns a serializable object representation of the role.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            name: this.name,
            color: this.color,
            hoist: this.hoist,
            icon: this.icon,
            unicodeEmoji: this.unicodeEmoji,
            position: this.position,
            permissions: this.permissions.toString(),
            managed: this.managed,
            mentionable: this.mentionable,
            tags: this.tags,
            guildId: this.guildId.toString(),
            style: this.style,
            enhancedColors: this.enhancedColors,
            gradientDirection: this.gradientDirection,
            holographicAnimation: this.holographicAnimation
        };
    }

    /**
     * Returns a formatted string representation of the role.
     * @returns {string}
     */
    public inspect(): string {
        return `Role { id: '${this.id}', name: '${this.name}', position: ${this.position}, managed: ${this.managed} }`;
    }
}