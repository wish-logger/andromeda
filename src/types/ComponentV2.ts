/**
 * Enum for Discord Component V2 types.
 */
export enum ComponentV2Type {
    CONTAINER = 100, // Placeholder, actual Discord API value for Container if it existed as a root type
    SECTION = 101,
    TEXT_DISPLAY = 102,
    MEDIA_GALLERY = 103,
    SEPARATOR = 104,
    ACTION_ROW = 1,
    BUTTON = 2,
    STRING_SELECT = 3,
    TEXT_INPUT = 4,
    USER_SELECT = 5,
    ROLE_SELECT = 6,
    MENTIONABLE_SELECT = 7,
    CHANNEL_SELECT = 8,
}

/**
 * Represents the base interface for any Discord Component V2.
 */
export interface BaseComponentV2 {
    type: ComponentV2Type;
}

/**
 * Represents a Text Display Component V2.
 * Used for displaying formatted text within a container or section.
 */
export interface TextDisplayComponent extends BaseComponentV2 {
    type: ComponentV2Type.TEXT_DISPLAY;
    content: string;
}

/**
 * Represents a Separator Component V2.
 * Used for visual separation between content blocks.
 */
export interface SeparatorComponent extends BaseComponentV2 {
    type: ComponentV2Type.SEPARATOR;
    // Discord API may have properties like 'style' or 'size' for separators.
    // Placeholder: This can be expanded based on actual API. For now, it's a simple divider.
}

/**
 * Represents a Media Gallery Item within a Media Gallery Component V2.
 */
export interface MediaGalleryItem {
    media_url?: string; // URL to the media asset
    alt_text?: string;  // Alt text for accessibility
    // Other properties like 'spoiler', 'height', 'width' if applicable
}

/**
 * Represents a Media Gallery Component V2.
 * Used for displaying collections of images or media.
 */
export interface MediaGalleryComponent extends BaseComponentV2 {
    type: ComponentV2Type.MEDIA_GALLERY;
    items: MediaGalleryItem[];
}

/**
 * Represents a Section Component V2.
 * Sections group related content within a Container.
 */
export interface SectionComponent extends BaseComponentV2 {
    type: ComponentV2Type.SECTION;
    components: ComponentV2Union[];
    accessory?: ButtonComponent | ThumbnailComponent;
}

/**
 * Represents a Thumbnail accessory for a Section Component V2.
 */
export interface ThumbnailComponent {
    url: string;
}

/**
 * Represents a Button Component (re-used from existing components, but context in V2).
 * Actual Discord API structure for buttons will be used.
 */
export interface ButtonComponent extends BaseComponentV2 {
    type: ComponentV2Type.BUTTON;
    style: number;
    label?: string;
    emoji?: { id?: string; name?: string; animated?: boolean };
    custom_id?: string;
    url?: string;
    disabled?: boolean;
}

/**
 * Represents an Action Row Component (re-used from existing components, but context in V2).
 * Can contain buttons or select menus.
 */
export interface ActionRowComponent extends BaseComponentV2 {
    type: ComponentV2Type.ACTION_ROW;
    components: (ButtonComponent | StringSelectComponent)[];
}

/**
 * Represents a String Select Component (re-used from existing components, but context in V2).
 */
export interface StringSelectComponent extends BaseComponentV2 {
    type: ComponentV2Type.STRING_SELECT;
    custom_id: string;
    options: { label: string; value: string; description?: string; emoji?: { id?: string; name?: string; animated?: boolean }; default?: boolean }[]; // Added default?: boolean
    placeholder?: string;
    min_values?: number;
    max_values?: number;
    disabled?: boolean;
}

// TODO: Other select menu types (User, Role, Mentionable, Channel)

/**
 * Represents a Container Component V2.
 * The top-level component that holds all other elements (Sections, Text Displays, etc.).
 */
export interface ContainerComponent extends BaseComponentV2 {
    type: ComponentV2Type.CONTAINER;
    components: ComponentV2Union[];
    unique_id?: string;
    accent_color?: number;
    spoiler?: boolean;
}

/**
 * A union type of all possible Component V2 types.
 */
export type ComponentV2Union = 
    TextDisplayComponent |
    SeparatorComponent |
    MediaGalleryComponent |
    SectionComponent |
    ContainerComponent |
    ActionRowComponent |
    ButtonComponent |
    StringSelectComponent;