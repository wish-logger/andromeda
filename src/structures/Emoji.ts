import { Client } from '../client/Client';
import { User } from '../structures/User';

export class Emoji {
    public id: bigint | null;
    public name: string | null;
    public animated?: boolean;
    public available?: boolean;
    public managed?: boolean;
    public requireColons?: boolean;
    public roles?: string[];
    public user?: User;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = data.id ? BigInt(data.id) : null;
        this.name = data.name;
        this.animated = data.animated;
        this.available = data.available;
        this.managed = data.managed;
        this.requireColons = data.require_colons;
        this.roles = data.roles;
        this.user = data.user;
    }

    /**
     * Returns the URL of the emoji image.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'gif').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public imageURL(format: string = 'png', size: number = 128): string | null {
        if (!this.id) return null;
        return `https://cdn.discordapp.com/emojis/${this.id.toString()}.${this.animated ? 'gif' : format}?size=${size}`;
    }

    /**
     * Returns a formatted string representation of the emoji.
     * @returns {string}
     */
    public toString(): string {
        return this.id ? `<${this.animated ? 'a' : ''}:${this.name}:${this.id.toString()}>` : this.name || '';
    }

    /**
     * Returns a serializable object representation of the emoji.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id?.toString() || null,
            name: this.name,
            animated: this.animated,
            available: this.available,
            managed: this.managed,
            requireColons: this.requireColons,
            roles: this.roles,
            user: this.user,
        };
    }
}