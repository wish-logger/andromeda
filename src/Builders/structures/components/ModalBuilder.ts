import { ActionRowBuilder } from './ActionRowBuilder';
import { ComponentType } from '../../../types/Component';

interface ModalActionRow {
    type: ComponentType.ActionRow;
    components: any[];
}

export class ModalBuilder {
    private _customId: string;
    private _title: string;
    private _components: ModalActionRow[] = [];

    /**
     * Creates a new ModalBuilder instance.
     * @param customId The custom ID for this modal.
     * @param title The title of the modal.
     */
    constructor(customId: string, title: string) {
        this._customId = customId;
        this._title = title;
    }

    public setCustomId(customId: string): this {
        this._customId = customId;
        return this;
    }

    public setTitle(title: string): this {
        this._title = title;
        return this;
    }

    public addComponents(...components: ActionRowBuilder[]): this {
        this._components.push(...components.map(comp => comp.toJSON()));
        return this;
    }

    public toJSON(): any {
        return {
            custom_id: this._customId,
            title: this._title,
            components: this._components,
        };
    }
}