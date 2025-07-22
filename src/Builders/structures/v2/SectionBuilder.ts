import { ComponentV2Type, SectionComponent, ComponentV2Union, TextDisplayComponent, MediaGalleryComponent, SeparatorComponent, ButtonComponent, ThumbnailComponent } from '../../../../src/types/ComponentV2';
import { TextDisplayBuilder } from './TextDisplayBuilder';
import { MediaGalleryBuilder } from './MediaGalleryBuilder';
import { SeparatorBuilder } from './SeparatorBuilder';

/**
 * A builder for Discord Section Components (Components V2).
 * Sections group related content within a Container.
 */
export class SectionBuilder {
    private _components: ComponentV2Union[] = [];
    private _accessory?: ButtonComponent | ThumbnailComponent;

    /**
     * Adds components (Text Displays, Media Galleries, Separators) to the section.
     * @param components The components to add.
     * @returns The SectionBuilder instance.
     */
    public addComponents(...components: (TextDisplayBuilder | MediaGalleryBuilder | SeparatorBuilder)[]): this {
        this._components.push(...components.map(comp => comp.toJSON()));
        return this;
    }

    /**
     * Sets an accessory (Button or Thumbnail) for the section.
     * @param accessory The accessory to set.
     * @returns The SectionBuilder instance.
     */
    public setAccessory(accessory: ButtonComponent | ThumbnailComponent /*| ButtonBuilder | ThumbnailBuilder*/): this {
        // if ('toJSON' in accessory) {
        //     this._accessory = accessory.toJSON();
        // } else {
            this._accessory = accessory;
        // }
        return this;
    }

    /**
     * Converts the SectionBuilder to a JSON-ready SectionComponent object.
     * @returns The SectionComponent object.
     */
    public toJSON(): SectionComponent {
        return {
            type: ComponentV2Type.SECTION,
            components: this._components,
            accessory: this._accessory,
        };
    }
}