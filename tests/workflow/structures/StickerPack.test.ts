import { Client } from '../../../src/client/Client';
import { Sticker } from '../../../src/structures/Sticker';
import { StickerPack } from '../../../src/structures/StickerPack';
import { StickerType, StickerFormatType } from '../../../src/types/Sticker';

describe('StickerPack', () => {
    let client: Client;
    let stickerPackData: any;

    beforeEach(() => {
        client = new Client({});
        stickerPackData = {
            id: '100000000000000000',
            stickers: [
                {
                    id: '749054660769218631',
                    name: 'Wave',
                    tags: 'wumpus, hello',
                    type: StickerType.STANDARD,
                    format_type: StickerFormatType.LOTTIE,
                    description: 'Wumpus waves hello',
                },
                {
                    id: '749054660769218632',
                    name: 'Hello',
                    tags: 'hi',
                    type: StickerType.GUILD,
                    format_type: StickerFormatType.PNG,
                    description: null,
                },
            ],
            name: 'Test Sticker Pack',
            sku_id: '200000000000000000',
            cover_sticker_id: '749054660769218888',
            description: 'A pack of test stickers',
            banner_asset_id: '300000000000000000',
        };
    });

    it('should correctly instantiate a StickerPack object', () => {
        const stickerPack = new StickerPack(client, stickerPackData);

        expect(stickerPack.id).toBe(BigInt(stickerPackData.id));
        expect(stickerPack.name).toBe(stickerPackData.name);
        expect(stickerPack.skuId).toBe(BigInt(stickerPackData.sku_id));
        expect(stickerPack.coverStickerId).toBe(BigInt(stickerPackData.cover_sticker_id));
        expect(stickerPack.description).toBe(stickerPackData.description);
        expect(stickerPack.bannerAssetId).toBe(BigInt(stickerPackData.banner_asset_id));
        expect(stickerPack.stickers.length).toBe(2);
        expect(stickerPack.stickers[0]).toBeInstanceOf(Sticker);
        expect(stickerPack.stickers[0].id).toBe(BigInt(stickerPackData.stickers[0].id));
        expect(stickerPack.stickers[1].name).toBe(stickerPackData.stickers[1].name);
    });

    it('should return correct JSON representation', () => {
        const stickerPack = new StickerPack(client, stickerPackData);
        const json: any = stickerPack.toJSON();

        expect(json.id).toBe(stickerPackData.id);
        expect(json.name).toBe(stickerPackData.name);
        expect(json.sku_id).toBe(stickerPackData.sku_id);
        expect(json.cover_sticker_id).toBe(stickerPackData.cover_sticker_id);
        expect(json.description).toBe(stickerPackData.description);
        expect(json.banner_asset_id).toBe(stickerPackData.banner_asset_id);
        expect(json.stickers.length).toBe(2);
        expect(json.stickers[0].id).toBe(stickerPackData.stickers[0].id);
        expect(json.stickers[1].name).toBe(stickerPackData.stickers[1].name);
    });

    it('should handle null/undefined properties correctly', () => {
        const minimalStickerPackData = {
            id: BigInt('400000000000000000'),
            stickers: [],
            name: 'Minimal Pack',
            sku_id: BigInt('500000000000000000'),
            description: 'Minimal description',
        };
        const stickerPack = new StickerPack(client, minimalStickerPackData);

        expect(stickerPack.id).toBe(BigInt(minimalStickerPackData.id));
        expect(stickerPack.stickers).toEqual([]);
        expect(stickerPack.name).toBe(minimalStickerPackData.name);
        expect(stickerPack.skuId).toBe(BigInt(minimalStickerPackData.sku_id));
        expect(stickerPack.coverStickerId).toBeUndefined();
        expect(stickerPack.description).toBe(minimalStickerPackData.description);
        expect(stickerPack.bannerAssetId).toBeUndefined();

        const json: any = stickerPack.toJSON();
        expect(json.cover_sticker_id).toBeUndefined();
        expect(json.banner_asset_id).toBeUndefined();
    });
});