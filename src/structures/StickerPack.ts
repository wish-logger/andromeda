import { Client } from '../client/Client';
import { Sticker } from './Sticker';
import { StickerPackData } from '../types/Sticker';

export class StickerPack {
    public id: bigint;
    public stickers: Sticker[];
    public name: string;
    public skuId: bigint;
    public coverStickerId?: bigint;
    public description: string;
    public bannerAssetId?: bigint;

    private client: Client;

    constructor(client: Client, data: StickerPackData) {
        this.client = client;
        this.id = BigInt(data.id);
        this.stickers = data.stickers.map(s => new Sticker(this.client, s));
        this.name = data.name;
        this.skuId = BigInt(data.sku_id);
        this.coverStickerId = data.cover_sticker_id ? BigInt(data.cover_sticker_id) : undefined;
        this.description = data.description;
        this.bannerAssetId = data.banner_asset_id ? BigInt(data.banner_asset_id) : undefined;
    }

    public toJSON() {
        return {
            id: this.id.toString(),
            stickers: this.stickers.map(s => s.toJSON()),
            name: this.name,
            sku_id: this.skuId.toString(),
            cover_sticker_id: this.coverStickerId?.toString(),
            description: this.description,
            banner_asset_id: this.bannerAssetId?.toString(),
        };
    }
}