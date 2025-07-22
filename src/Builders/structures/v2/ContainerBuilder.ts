import { BaseComponentV2, ComponentV2Type, ContainerComponent, ComponentV2Union, SectionComponent, TextDisplayComponent, MediaGalleryComponent, SeparatorComponent, ActionRowComponent, ButtonComponent, StringSelectComponent } from '../../../../src/types/ComponentV2';
import { TextDisplayBuilder } from './TextDisplayBuilder';
import { SectionBuilder } from './SectionBuilder';
import { MediaGalleryBuilder } from './MediaGalleryBuilder';
import { SeparatorBuilder } from './SeparatorBuilder';
import { ActionRowBuilder } from '../components/ActionRowBuilder';
import { ButtonBuilder } from '../ButtonBuilder';
import { StringSelectMenuBuilder } from '../components/StringSelectMenuBuilder';

/**
 * A builder for Discord Container Components (Components V2).
 */
export class ContainerBuilder {
    private _uniqueId?: string;
    private _accentColor?: number;
    private _spoiler?: boolean;
    private _components: ComponentV2Union[] = [];

    constructor(uniqueId?: string) {
        this._uniqueId = uniqueId;
    }

    /**
     * Sets the unique ID for the container.
     * This ID is used for component replacement.
     * @param uniqueId The unique ID.
     * @returns The ContainerBuilder instance.
     */
    public setUniqueId(uniqueId: string): this {
        this._uniqueId = uniqueId;
        return this;
    }

    /**
     * Sets the accent color for the container.
     * @param accentColor The color as a number (e.g., 0xFF0000).
     * @returns The ContainerBuilder instance.
     */
    public setAccentColor(accentColor: number): this {
        this._accentColor = accentColor;
        return this;
    }

    /**
     * Marks the container as spoiler content.
     * @param spoiler Whether the container is spoiler.
     * @returns The ContainerBuilder instance.
     */
    public setSpoiler(spoiler: boolean): this {
        this._spoiler = spoiler;
        return this;
    }

    /**
     * Adds components (Sections, Text Displays, Media Galleries, Separators, Action Rows) to the container.
     * Note: Buttons and Select Menus should typically be wrapped in Action Rows.
     * @param components The components to add.
     * @returns The ContainerBuilder instance.
     */
    public addComponents(...components: (SectionBuilder | TextDisplayBuilder | MediaGalleryBuilder | SeparatorBuilder | ActionRowBuilder)[]): this {
        this._components.push(...components.map(comp => comp.toJSON()));
        return this;
    }

    /**
     * Adds TextDisplayComponents to the container.
     * @param textDisplays The TextDisplayBuilder instances to add.
     * @returns The ContainerBuilder instance.
     */
    public addTextDisplayComponents(...textDisplays: TextDisplayBuilder[]): this {
        this._components.push(...textDisplays.map(td => td.toJSON()));
        return this;
    }

    /**
     * Adds SectionComponents to the container.
     * @param sections The SectionBuilder instances to add.
     * @returns The ContainerBuilder instance.
     */
    public addSectionComponents(...sections: SectionBuilder[]): this {
        this._components.push(...sections.map(s => s.toJSON()));
        return this;
    }

    /**
     * Adds MediaGalleryComponents to the container.
     * @param mediaGalleries The MediaGalleryBuilder instances to add.
     * @returns The ContainerBuilder instance.
     */
    public addMediaGalleryComponents(...mediaGalleries: MediaGalleryBuilder[]): this {
        this._components.push(...mediaGalleries.map(mg => mg.toJSON()));
        return this;
    }

    /**
     * Adds SeparatorComponents to the container.
     * @param separators The SeparatorBuilder instances to add.
     * @returns The ContainerBuilder instance.
     */
    public addSeparatorComponents(...separators: SeparatorBuilder[]): this {
        this._components.push(...separators.map(s => s.toJSON()));
        return this;
    }

    /**
     * Adds ActionRowComponents to the container.
     * @param actionRows The ActionRowBuilder instances to add.
     * @returns The ContainerBuilder instance.
     */
    public addActionRowComponents(...actionRows: ActionRowBuilder[]): this {
        this._components.push(...actionRows.map(ar => ar.toJSON()));
        return this;
    }

    /**
     * Converts the ContainerBuilder to a JSON-ready ContainerComponent object.
     * @returns The ContainerComponent object.
     */
    public toJSON(): ContainerComponent {
        return {
            type: ComponentV2Type.CONTAINER,
            unique_id: this._uniqueId,
            accent_color: this._accentColor,
            spoiler: this._spoiler,
            components: this._components,
        };
    }
}