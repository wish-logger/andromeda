import { Client } from '../../../src/client/Client';
import { Sticker } from '../../../src/structures/Sticker';
import { StickerType, StickerFormatType } from '../../../src/types/Sticker';

describe('Sticker', () => {
    let client: Client;
    let stickerData: any;

    beforeEach(() => {
        client = new Client({});
        stickerData = {
            id: '749054660769218631',
            pack_id: '847199849233514549',
            name: 'Wave',
            description: 'Wumpus waves hello',
            tags: 'wumpus, hello, sup, hi, oi',
            type: StickerType.STANDARD,
            format_type: StickerFormatType.LOTTIE,
            available: true,
            guild_id: '112233445566778899',
            user: {
                id: '223344556677889900',
                username: 'testuser',
                discriminator: '0000',
            },
            sort_value: 12,
        };
    });

    it('should correctly instantiate a Sticker object', () => {
        const sticker = new Sticker(client, stickerData);

        expect(sticker.id).toBe(BigInt(stickerData.id));
        expect(sticker.packId).toBe(BigInt(stickerData.pack_id));
        expect(sticker.name).toBe(stickerData.name);
        expect(sticker.description).toBe(stickerData.description);
        expect(sticker.tags).toBe(stickerData.tags);
        expect(sticker.type).toBe(stickerData.type);
        expect(sticker.formatType).toBe(stickerData.format_type);
        expect(sticker.available).toBe(stickerData.available);
        expect(sticker.guildId).toBe(BigInt(stickerData.guild_id));
        expect(sticker.user).toBeDefined();
        expect(sticker.user?.id).toBe(BigInt(stickerData.user.id));
        expect(sticker.sortValue).toBe(stickerData.sort_value);
    });

    it('should return correct image URL', () => {
        const sticker = new Sticker(client, stickerData);
        expect(sticker.imageURL()).toBe(`https://cdn.discordapp.com/stickers/${stickerData.id}.${stickerData.format_type === StickerFormatType.LOTTIE ? 'json' : 'png'}`);
        expect(sticker.imageURL('webp')).toBe(`https://cdn.discordapp.com/stickers/${stickerData.id}.webp`);
    });

    it('should return correct JSON representation', () => {
        const sticker = new Sticker(client, stickerData);
        const json: any = sticker.toJSON();

        expect(json.id).toBe(stickerData.id);
        expect(json.pack_id).toBe(stickerData.pack_id);
        expect(json.name).toBe(stickerData.name);
        expect(json.description).toBe(stickerData.description);
        expect(json.tags).toBe(stickerData.tags);
        expect(json.type).toBe(stickerData.type);
        expect(json.format_type).toBe(stickerData.format_type);
        expect(json.available).toBe(stickerData.available);
        expect(json.guild_id).toBe(stickerData.guild_id);
        expect(json.user).toBeDefined();
        expect(json.user.id).toBe(stickerData.user.id);
        expect(json.sort_value).toBe(stickerData.sort_value);
    });

    it('should handle null/undefined properties correctly', () => {
        const minimalStickerData = {
            id: '111222333444555666',
            name: 'Minimal Sticker',
            tags: 'minimal',
            type: StickerType.GUILD,
            format_type: StickerFormatType.PNG,
        };
        const sticker = new Sticker(client, minimalStickerData);

        expect(sticker.id).toBe(BigInt(minimalStickerData.id));
        expect(sticker.packId).toBeUndefined();
        expect(sticker.name).toBe(minimalStickerData.name);
        expect(sticker.description).toBeNull();
        expect(sticker.tags).toBe(minimalStickerData.tags);
        expect(sticker.type).toBe(minimalStickerData.type);
        expect(sticker.formatType).toBe(minimalStickerData.format_type);
        expect(sticker.available).toBeUndefined();
        expect(sticker.guildId).toBeUndefined();
        expect(sticker.user).toBeUndefined();
        expect(sticker.sortValue).toBeUndefined();

        const json: any = sticker.toJSON();
        expect(json.pack_id).toBeUndefined();
        expect(json.description).toBeNull();
        expect(json.available).toBeUndefined();
        expect(json.guild_id).toBeUndefined();
        expect(json.user).toBeUndefined();
        expect(json.sort_value).toBeUndefined();
    });
});