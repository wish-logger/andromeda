import { Client } from '../client/Client';
import { User } from './User';
import { StickerType, StickerFormatType } from "../types/Sticker";

export class Sticker {
    public id: bigint;
    public packId?: bigint;
    public name: string;
    public description: string | null;
    public tags: string;
    public type: StickerType;
    public formatType: StickerFormatType;
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
        this.description = data.description ?? null;
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
     * @param {string} [format] The format of the sticker (e.g., 'png', 'json', 'webp', 'gif').
     * @returns {string}
     */
    public imageURL(format?: string): string {
        const defaultFormat = this.formatType === StickerFormatType.LOTTIE ? 'json' : 'png';
        const chosenFormat = format ?? defaultFormat;
        return `https://cdn.discordapp.com/stickers/${this.id.toString()}.${chosenFormat}`;
    }

    /**
     * Returns a serializable object representation of the sticker.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            pack_id: this.packId?.toString(),
            name: this.name,
            description: this.description,
            tags: this.tags,
            type: this.type,
            format_type: this.formatType,
            available: this.available,
            guild_id: this.guildId?.toString(),
            user: this.user?.toJSON(),
            sort_value: this.sortValue,
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