import { Client } from '../client/Client';
import { Channel } from './Channel';

/**
 * Type of a prompt.
 */
export enum OnboardingPromptType {
    MULTIPLE_CHOICE = 0,
    DROPDOWN = 1,
}

/**
 * Flags for a prompt.
 */
export enum OnboardingPromptFlag {
    /**
     * Prompt is disabled
     */
    DISABLED = 1 << 0,
}

/**
 * Represents an option for an onboarding prompt.
 */
export interface OnboardingPromptOption {
    /**
     * ID of the onboarding prompt option.
     * @type {bigint}
     */
    id: bigint;
    /**
     * Channel IDs that the user is added to when selecting this option.
     * @type {bigint[]}
     */
    channelIds: bigint[];
    /**
     * Role IDs that the user is added to when selecting this option.
     * @type {bigint[]}
     */
    roleIds: bigint[];
    /**
     * Emoji ID, if the option is an emoji.
     * @type {bigint | undefined}
     */
    emojiId?: bigint;
    /**
     * Emoji name, if the option is an emoji.
     * @type {string | null | undefined}
     */
    emojiName?: string | null;
    /**
     * Emoji animated status, if the option is an emoji.
     * @type {boolean | undefined}
     */
    emojiAnimated?: boolean;
    /**
     * Title of the option.
     * @type {string}
     */
    title: string;
    /**
     * Description of the option.
     * @type {string | undefined}
     */
    description?: string;
}

/**
 * Represents a prompt in the guild onboarding flow.
 */
export interface OnboardingPrompt {
    /**
     * ID of the onboarding prompt.
     * @type {bigint}
     */
    id: bigint;
    /**
     * Type of the prompt.
     * @type {OnboardingPromptType}
     */
    type: OnboardingPromptType;
    /**
     * Options for the prompt.
     * @type {OnboardingPromptOption[]}
     */
    options: OnboardingPromptOption[];
    /**
     * Title of the prompt.
     * @type {string}
     */
    title: string;
    /**
     * Whether the prompt is single select.
     * @type {boolean}
     */
    singleSelect: boolean;
    /**
     * Whether the prompt is required.
     * @type {boolean}
     */
    required: boolean;
    /**
     * Whether the prompt is in the onboarding flow.
     * @type {boolean}
     */
    inOnboarding: boolean;
    /**
     * Flags for the prompt.
     * @type {OnboardingPromptFlag | undefined}
     */
    flags?: OnboardingPromptFlag;
}

/**
 * Represents the guild onboarding flow.
 */
export class GuildOnboarding {
    /**
     * ID of the guild this onboarding is for.
     * @type {bigint}
     */
    public guildId: bigint;
    /**
     * Prompts shown to users onboarding to the guild.
     * @type {OnboardingPrompt[]}
     */
    public prompts: OnboardingPrompt[];
    /**
     * IDs of channels that are considered default channels for new members.
     * @type {bigint[]}
     */
    public defaultChannelIds: bigint[];
    /**
     * Whether onboarding is enabled in the guild.
     * @type {boolean}
     */
    public enabled: boolean;
    /**
     * IDs of the countries the guild is restricted to.
     * @type {string[] | undefined}
     */
    public countriesRestricted?: string[];

    private client: Client;

    /**
     * @param {Client} client The client that instantiated this guild onboarding.
     * @param {any} data The raw data for the guild onboarding.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.guildId = BigInt(data.guild_id);
        this.prompts = data.prompts ? data.prompts.map((p: any) => ({
            id: BigInt(p.id),
            type: p.type,
            options: p.options.map((o: any) => ({
                id: BigInt(o.id),
                channelIds: (o.channel_ids ?? []).map(BigInt),
                roleIds: (o.role_ids ?? []).map(BigInt),
                emojiId: o.emoji_id ? BigInt(o.emoji_id) : undefined,
                emojiName: o.emoji_name,
                emojiAnimated: o.emoji_animated,
                title: o.title,
                description: o.description,
            })),
            title: p.title,
            singleSelect: p.single_select,
            required: p.required,
            inOnboarding: p.in_onboarding,
            flags: p.flags,
        })) : [];
        this.defaultChannelIds = data.default_channel_ids ? data.default_channel_ids.map(BigInt) : [];
        this.enabled = data.enabled;
        this.countriesRestricted = data.countries_restricted;
    }

    /**
     * Returns a serializable object representation of the guild onboarding.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            guild_id: this.guildId.toString(),
            prompts: this.prompts.map(p => ({
                id: p.id.toString(),
                type: p.type,
                options: p.options.map(o => ({
                    id: o.id.toString(),
                    channel_ids: o.channelIds.map(String),
                    role_ids: o.roleIds.map(String),
                    emoji_id: o.emojiId?.toString(),
                    emoji_name: o.emojiName,
                    emoji_animated: o.emojiAnimated,
                    title: o.title,
                    description: o.description,
                })),
                title: p.title,
                single_select: p.singleSelect,
                required: p.required,
                in_onboarding: p.inOnboarding,
                flags: p.flags,
            })),
            default_channel_ids: this.defaultChannelIds.map(String),
            enabled: this.enabled,
            countries_restricted: this.countriesRestricted,
        };
    }

    /**
     * Returns a formatted string representation of the guild onboarding.
     * @returns {string}
     */
    public inspect(): string {
        return `GuildOnboarding { guildId: '${this.guildId}', enabled: ${this.enabled}, prompts: ${this.prompts.length} }`;
    }
}