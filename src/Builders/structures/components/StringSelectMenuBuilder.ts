import { ComponentType } from '../../../types/Component';

export interface SelectMenuOption {
    label: string;
    value: string;
    description?: string;
    emoji?: { id?: string; name?: string; animated?: boolean };
    default?: boolean;
}

/**
 * A builder for Discord String Select Menu Components.
 * Select menus can be used within Action Rows in Components V2.
 */
export class StringSelectMenuBuilder {
    private _customId: string;
    private _options: SelectMenuOption[] = [];
    private _placeholder?: string;
    private _minValues?: number;
    private _maxValues?: number;
    private _disabled: boolean = false;

    constructor(customId: string) {
        this._customId = customId;
    }

    /**
     * Sets the custom ID for the select menu.
     * @param customId The custom ID.
     * @returns The StringSelectMenuBuilder instance.
     */
    public setCustomId(customId: string): this {
        this._customId = customId;
        return this;
    }

    /**
     * Adds options to the select menu.
     * @param options The options to add.
     * @returns The StringSelectMenuBuilder instance.
     */
    public addOptions(...options: SelectMenuOption[]): this {
        this._options.push(...options);
        return this;
    }

    /**
     * Sets the placeholder text shown when no option is selected.
     * @param placeholder The placeholder text.
     * @returns The StringSelectMenuBuilder instance.
     */
    public setPlaceholder(placeholder: string): this {
        this._placeholder = placeholder;
        return this;
    }

    /**
     * Sets the minimum number of items that must be chosen.
     * @param minValues The minimum number of values.
     * @returns The StringSelectMenuBuilder instance.
     */
    public setMinValues(minValues: number): this {
        this._minValues = minValues;
        return this;
    }

    /**
     * Sets the maximum number of items that can be chosen.
     * @param maxValues The maximum number of values.
     * @returns The StringSelectMenuBuilder instance.
     */
    public setMaxValues(maxValues: number): this {
        this._maxValues = maxValues;
        return this;
    }

    /**
     * Sets whether the select menu is disabled.
     * @param disabled Whether the select menu is disabled. Defaults to `false`.
     * @returns The StringSelectMenuBuilder instance.
     */
    public setDisabled(disabled: boolean): this {
        this._disabled = disabled;
        return this;
    }

    /**
     * Converts the StringSelectMenuBuilder to a JSON-ready object.
     * @returns The string select component object.
     */
    public toJSON(): any {
        return {
            type: ComponentType.StringSelect,
            custom_id: this._customId,
            options: this._options,
            placeholder: this._placeholder,
            min_values: this._minValues,
            max_values: this._maxValues,
            disabled: this._disabled,
        };
    }
}