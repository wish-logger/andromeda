import { ComponentV2Type, SeparatorComponent } from '../../../../src/types/ComponentV2';

/**
 * A builder for Discord Separator Components (Components V2).
 * Used for visual separation between content blocks.
 */
export class SeparatorBuilder {
    // Discord API may have properties like 'style' or 'size' for separators.
    // For now, it's a simple divider, so no specific properties to set via builder.

    /**
     * Converts the SeparatorBuilder to a JSON-ready SeparatorComponent object.
     * @returns The SeparatorComponent object.
     */
    public toJSON(): SeparatorComponent {
        return {
            type: ComponentV2Type.SEPARATOR,
        };
    }
}