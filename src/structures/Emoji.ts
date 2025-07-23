import { Client } from '../client/Client';
import { User } from './User';

/**
 * Represents a custom emoji.
 */
export class Emoji {
    public id: bigint | null;
    public name: string | null;
    public roles?: bigint[];
    public user?: User;
    public requireColons?: boolean;
    public managed?: boolean;
    public animated?: boolean;
    public available?: boolean;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = data.id ? BigInt(data.id) : null;
        this.name = data.name;
        this.roles = data.roles ? data.roles.map((id: string) => BigInt(id)) : undefined;
        this.user = data.user ? new User(this.client, data.user) : undefined;
        this.requireColons = data.require_colons;
        this.managed = data.managed;
        this.animated = data.animated;
        this.available = data.available;
    }

    /**
     * Returns the URL of the emoji's image.
     * @param {string} [format='png'] The format of the image (e.g., 'png', 'jpg', 'webp', 'gif').
     * @param {number} [size=128] The size of the image (any power of 2 between 16 and 4096).
     * @returns {string | null}
     */
    public imageURL(format: string = 'png', size: number = 128): string | null {
        if (!this.id) return null;
        return `https://cdn.discordapp.com/emojis/${this.id.toString()}.${this.animated ? 'gif' : format}?size=${size}`;
    }

    /**
     * Returns a serializable object representation of the emoji.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id?.toString() || null,
            name: this.name,
            roles: this.roles?.map(id => id.toString()),
            user: this.user?.toJSON(),
            requireColons: this.requireColons,
            managed: this.managed,
            animated: this.animated,
            available: this.available,
        };
    }

    /**
     * Returns a formatted string representation of the emoji.
     * @returns {string}
     */
    public inspect(): string {
        return `Emoji { id: '${this.id}', name: '${this.name}' }`;
    }
}