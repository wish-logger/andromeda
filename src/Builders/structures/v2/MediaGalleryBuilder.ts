import { ComponentV2Type, MediaGalleryComponent, MediaGalleryItem } from '../../../../src/types/ComponentV2';

/**
 * A builder for Discord Media Gallery Components (Components V2).
 * Used for displaying collections of images or media.
 */
export class MediaGalleryBuilder {
    private _items: MediaGalleryItem[] = [];

    /**
     * Adds a media item to the gallery.
     * @param mediaItem The media item to add. Can be a URL, or an object with URL and alt text.
     * @returns The MediaGalleryBuilder instance.
     */
    public addMediaItem(mediaItem: string | MediaGalleryItem): this {
        if (typeof mediaItem === 'string') {
            this._items.push({ media_url: mediaItem });
        } else {
            this._items.push(mediaItem);
        }
        return this;
    }

    /**
     * Converts the MediaGalleryBuilder to a JSON-ready MediaGalleryComponent object.
     * @returns The MediaGalleryComponent object.
     */
    public toJSON(): MediaGalleryComponent {
        return {
            type: ComponentV2Type.MEDIA_GALLERY,
            items: this._items,
        };
    }
}