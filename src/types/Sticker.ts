export enum StickerType {
    STANDARD = 1,
    GUILD = 2,
}

export enum StickerFormatType {
    PNG = 1,
    APNG = 2,
    LOTTIE = 3,
    GIF = 4,
}

export interface StickerItemData {
    id: bigint;
    name: string;
    format_type: StickerFormatType;
}

export interface StickerPackData {
    id: bigint;
    stickers: any[];
    name: string;
    sku_id: bigint;
    cover_sticker_id?: bigint;
    description: string;
    banner_asset_id?: bigint;
}