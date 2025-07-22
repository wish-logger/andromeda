import { Client } from '../client/Client';
import { Interaction as InteractionPayload, InteractionType, ApplicationCommandInteractionData, ApplicationCommandInteractionDataOption, ResolvedData } from '../types/Interaction';
import { MessageFlags } from '../types/Message';
import { User } from '../structures/User'
import { Member } from '../structures/Member'
import { Message } from '../structures/Message'
import { INTERACTION_CALLBACK } from '../rest/Endpoints';
import { EmbedBuilder } from '../Builders/structures/EmbedBuilder';
import { Channel, ChannelType } from '../structures/Channel';
import { ApplicationCommandOptionType } from '../types/ApplicationCommand';
import { Role } from '../structures/Role';
import { ComponentV2Union, ContainerComponent, SectionComponent, TextDisplayComponent, MediaGalleryComponent, SeparatorComponent, ActionRowComponent } from '../types/ComponentV2'; // Import V2 types

// v2
import { ContainerBuilder } from '../Builders/structures/v2/ContainerBuilder';
import { SectionBuilder } from '../Builders/structures/v2/SectionBuilder';
import { TextDisplayBuilder } from '../Builders/structures/v2/TextDisplayBuilder';
import { MediaGalleryBuilder } from '../Builders/structures/v2/MediaGalleryBuilder';
import { SeparatorBuilder } from '../Builders/structures/v2/SeparatorBuilder';
import { ActionRowBuilder } from '../Builders/structures/components/ActionRowBuilder';

/**
 * A helper class to simplify accessing interaction options.
 */
class InteractionOptions {
    private options: ApplicationCommandInteractionDataOption[] | undefined;
    private resolved: ResolvedData | undefined;
    private client: Client;
    private guildId?: string;

    constructor(client: Client, options: ApplicationCommandInteractionDataOption[] | undefined, resolved: ResolvedData | undefined, guildId?: string) {
        this.client = client;
        this.options = options;
        this.resolved = resolved;
        this.guildId = guildId;
    }

    /**
     * Retrieves the value of a command option by its name.
     * @param name The name of the option.
     * @returns The value of the option, or undefined if not found.
     */
    public getValue(name: string): any | undefined {
        const option = this.options?.find(opt => opt.name === name);
        return option?.value;
    }

    /**
     * Retrieves the value of a command option by its name, automatically converting it to the correct type.
     * @param name The name of the option.
     * @returns The converted value of the option, or undefined if not found.
     */
    public getData(name: string): any | undefined {
        const option = this.options?.find(opt => opt.name === name);
        if (!option) {
            return undefined;
        }

        switch (option.type) {
            case ApplicationCommandOptionType.STRING:
                return option.value as string;
            case ApplicationCommandOptionType.INTEGER:
            case ApplicationCommandOptionType.NUMBER:
                return option.value as number;
            case ApplicationCommandOptionType.BOOLEAN:
                return option.value as boolean;
            case ApplicationCommandOptionType.USER:
                return this.getUser(name);
            case ApplicationCommandOptionType.CHANNEL:
                return this.getChannel(name);
            case ApplicationCommandOptionType.ROLE:
                return this.getRole(name);
            case ApplicationCommandOptionType.MENTIONABLE:
                return this.getUser(name) || this.getRole(name) || option.value as string;
            case ApplicationCommandOptionType.SUB_COMMAND:
            case ApplicationCommandOptionType.SUB_COMMAND_GROUP:
                return option;
            default:
                return option.value; // Fallback for any other types or if value is already suitable
        }
    }

    /**
     * Retrieves the value of a string option.
     * @param name The name of the option.
     * @returns The string value of the option, or undefined if not found.
     */
    public getString(name: string): string | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.STRING);
        return option?.value as string | undefined;
    }

    /**
     * Retrieves the value of an integer option.
     * @param name The name of the option.
     * @returns The integer value of the option, or undefined if not found.
     */
    public getInteger(name: string): number | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.INTEGER);
        return option?.value as number | undefined;
    }

    /**
     * Retrieves the value of a boolean option.
     * @param name The name of the option.
     * @returns The boolean value of the option, or undefined if not found.
     */
    public getBoolean(name: string): boolean | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.BOOLEAN);
        return option?.value as boolean | undefined;
    }

    /**
     * Retrieves a User object from a user option.
     * @param name The name of the user option.
     * @returns The User object, or undefined if not found.
     */
    public getUser(name: string): User | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.USER);
        if (!option?.value || !this.resolved?.users) return undefined;
        const userData = this.resolved.users[option.value as string];
        return userData ? new User(this.client, userData) : undefined;
    }

    /**
     * Retrieves a Member object from a user or mentionable option.
     * @param name The name of the user or mentionable option.
     * @returns The Member object, or undefined if not found.
     */
    public getMember(name: string): Member | undefined {
        const option = this.options?.find(opt => (opt.name === name && (opt.type === ApplicationCommandOptionType.USER || opt.type === ApplicationCommandOptionType.MENTIONABLE)));
        if (!option?.value || !this.resolved?.members || !this.resolved.users || !this.guildId) return undefined;

        const memberId = option.value as string;
        const memberData = this.resolved.members[memberId];
        const userData = this.resolved.users[memberId];

        if (memberData && userData) {
            const fullMemberData = { ...memberData, user: userData };
            return new Member(this.client, fullMemberData, this.guildId);
        }
        return undefined;
    }

    /**
     * Retrieves a Channel object from a channel option.
     * @param name The name of the channel option.
     * @returns The Channel object, or undefined if not found.
     */
    public getChannel(name: string): Channel | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.CHANNEL);
        if (!option?.value || !this.resolved?.channels) return undefined;
        const channelData = this.resolved.channels[option.value as string];
        return channelData ? new Channel(this.client, channelData) : undefined;
    }

    /**
     * Retrieves a Role object from a role option.
     * @param name The name of the option.
     * @returns The Role object, or undefined if not found.
     */
    public getRole(name: string): Role | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.ROLE);
        if (!option?.value || !this.resolved?.roles) return undefined;
        const roleData = this.resolved.roles[option.value as string];
        return roleData ? new Role(this.client, roleData, this.guildId || 'unknown') : undefined;
    }

    /**
     * Retrieves the value of a mentionable option.
     * @param name The name of the option.
     * @returns The mentionable ID string of the option, or undefined if not found.
     */
    public getMentionable(name: string): string | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.MENTIONABLE);
        return option?.value as string | undefined;
    }

    /**
     * Retrieves the value of a number option.
     * @param name The name of the option.
     * @returns The number value of the option, or undefined if not found.
     */
    public getNumber(name: string): number | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.NUMBER);
        return option?.value as number | undefined;
    }

    /**
     * Retrieves the value of a subcommand option.
     * @param name The name of the option.
     * @returns The subcommand object, or undefined if not found.
     */
    public getSubcommand(name: string): any | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.SUB_COMMAND);
        return option;
    }

    /**
     * Retrieves the value of a subcommand group option.
     * @param name The name of the option.
     * @returns The subcommand group object, or undefined if not found.
     */
    public getSubcommandGroup(name: string): any | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP);
        return option;
    }
}

/**
 * Represents a Discord interaction.
 */
export class Interaction {
    public id: string;
    public applicationId: string;
    public type: InteractionType;
    public data?: ApplicationCommandInteractionData;
    public guildId?: string;
    public channelId?: string;
    public member?: Member;
    public user: User;
    public token: string;
    public version: number;
    public message?: Message;

    private client: Client;

    /**
     * Creates an instance of Interaction.
     * @param {Client} client The client instance.
     * @param {InteractionPayload} data The raw interaction payload.
     */
    constructor(client: Client, data: InteractionPayload) {
        this.client = client;
        this.id = data.id;
        this.applicationId = data.application_id;
        this.type = data.type;
        this.data = data.data;
        this.guildId = data.guild_id;
        this.channelId = data.channel_id;
        this.member = data.member;
        this.user = data.user;
        this.token = data.token;
        this.version = data.version;
        this.message = data.message;
    }

    /**
     * Returns the channel associated with this interaction.
     * @returns {Channel | undefined} The channel object, or undefined if not available.
     */
    public get channel(): Channel | undefined {
        if (!this.channelId) return undefined;
        if (this.data?.resolved?.channels && this.data.resolved.channels[this.channelId]) {
            return new Channel(this.client, this.data.resolved.channels[this.channelId]);
        }
        return new Channel(this.client, { id: this.channelId, type: ChannelType.GUILD_TEXT }); // Fallback if not resolved
    }

    /**
     * Access to command options.
     */
    public get options(): InteractionOptions {
        return new InteractionOptions(this.client, this.data?.options, this.data?.resolved, this.guildId);
    }

    /**
     * Creates and returns a new EmbedBuilder instance.
     * This allows for fluent embed construction directly from an interaction context.
     * @returns {EmbedBuilder} A new EmbedBuilder instance.
     */
    public createEmbed(): EmbedBuilder {
        return new EmbedBuilder();
    }

    /**
     * Replies to the interaction.
     * @param {string | { content?: string; embeds?: any[]; ephemeral?: boolean }} options The message content or an object with message options.
     * @param {boolean} [options.ephemeral] Whether the reply should be ephemeral (only visible to the user who invoked the interaction). Defaults to `false`.
     * @returns {Promise<void>}
     */
    public async reply(options: string | { content?: string; embeds?: any[]; ephemeral?: boolean; componentsV2?: (ContainerBuilder | SectionBuilder | TextDisplayBuilder | MediaGalleryBuilder | SeparatorBuilder | ActionRowBuilder)[] }): Promise<void> {
        let payload: any;
        let flags = 0;

        if (typeof options === 'string') {
            payload = { content: options };
        } else {
            payload = options;
            if (options.ephemeral) {
                flags |= MessageFlags.EPHEMERAL;
            }

            if (options.componentsV2 && options.componentsV2.length > 0) {
                payload.components_v2 = options.componentsV2.map(comp => comp.toJSON());
                flags |= MessageFlags.IS_COMPONENTS_V2;
                // delete payload.content; // idk
                delete payload.embeds;
            }
        }

        await this.client.rest.request(
            'POST',
            INTERACTION_CALLBACK(this.id, this.token),
            {
                type: 4,
                data: {
                    ...payload,
                    flags: flags,
                },
            }
        );
    }
}