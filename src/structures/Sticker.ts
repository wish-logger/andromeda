import { Client } from '../client/Client';
import { User } from './User';

export class Sticker {
    public id: bigint;
    public packId?: bigint;
    public name: string;
    public description: string | null;
    public tags: string;
    public type: number;
    public formatType: number;
    public available?: boolean;
    public guildId?: bigint;
    public user?: User;
    public sortValue?: number;

    private client: Client;

    constructor(client: Client, data: any) {
        this.client = client;
        this.id = BigInt(data.id);
        this.packId = data.pack_id ? BigInt(data.pack_id) : undefined;
        this.name = data.name;
        this.description = data.description;
        this.tags = data.tags;
        this.type = data.type;
        this.formatType = data.format_type;
        this.available = data.available;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : undefined;
        this.user = data.user ? new User(this.client, data.user) : undefined;
        this.sortValue = data.sort_value;
    }

    /**
     * Returns the URL of the sticker.
     * @param {string} [format='png'] The format of the sticker (e.g., 'png', 'json').
     * @returns {string}
     */
    public imageURL(format: string = 'png'): string {
        return `https://cdn.discordapp.com/stickers/${this.id.toString()}.${format}`;
    }

    /**
     * Returns a serializable object representation of the sticker.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            packId: this.packId?.toString(),
            name: this.name,
            description: this.description,
            tags: this.tags,
            type: this.type,
            formatType: this.formatType,
            available: this.available,
            guildId: this.guildId?.toString(),
            user: this.user?.toJSON(),
            sortValue: this.sortValue,
        };
    }

    /**
     * Returns a formatted string representation of the sticker.
     * @returns {string}
     */
    public inspect(): string {
        return `Sticker { id: '${this.id}', name: '${this.name}' }`;
    }
} 