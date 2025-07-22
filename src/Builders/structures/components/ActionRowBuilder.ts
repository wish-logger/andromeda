import { ButtonBuilder, ButtonStyle } from './ButtonBuilder';
import { StringSelectMenuBuilder } from './StringSelectMenuBuilder';
import { ComponentType } from '../../../types/Component';

/**
 * A builder for Discord Action Row Components.
 * Action Rows can contain buttons or select menus.
 */
export class ActionRowBuilder {
    private _components: (ButtonBuilder | StringSelectMenuBuilder)[] = [];

    /**
     * Adds components (Buttons or Select Menus) to the action row.
     * @param components The components to add.
     * @returns The ActionRowBuilder instance.
     */
    public addComponents(...components: (ButtonBuilder | StringSelectMenuBuilder)[]): this {
        if (this._components.length + components.length > 5) {
            throw new Error('Action rows can only contain up to 5 components.');
        }
        this._components.push(...components);
        return this;
    }

    /**
     * Converts the ActionRowBuilder to a JSON-ready object.
     * @returns The ActionRow object.
     */
    public toJSON(): any {
        return {
            type: ComponentType.ActionRow,
            components: this._components.map(comp => comp.toJSON()),
        };
    }
}