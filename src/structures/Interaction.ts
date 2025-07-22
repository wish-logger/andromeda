import { Client } from '../client/Client';
import { Interaction as InteractionPayload, InteractionType, ApplicationCommandInteractionData, ApplicationCommandInteractionDataOption } from '../types/Interaction';
import { MessageFlags } from '../types/Message';
import { User } from '../structures/User'
import { Member } from '../structures/Member'
import { Message } from '../structures/Message'
import { INTERACTION_CALLBACK } from '../rest/Endpoints';
import { EmbedBuilder } from '../Builders/structures/EmbedBuilder';
import { Channel, ChannelType } from '../structures/Channel';
import { ApplicationCommandOptionType } from '../types/ApplicationCommand';

/**
 * A helper class to simplify accessing interaction options.
 */
class InteractionOptions {
    private options: ApplicationCommandInteractionDataOption[] | undefined;

    constructor(options: ApplicationCommandInteractionDataOption[] | undefined) {
        this.options = options;
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
            case ApplicationCommandOptionType.USER:
            case ApplicationCommandOptionType.CHANNEL:
            case ApplicationCommandOptionType.ROLE:
            case ApplicationCommandOptionType.MENTIONABLE:
                return option.value as string;
            case ApplicationCommandOptionType.INTEGER:
            case ApplicationCommandOptionType.NUMBER:
                return option.value as number;
            case ApplicationCommandOptionType.BOOLEAN:
                return option.value as boolean;
            case ApplicationCommandOptionType.SUB_COMMAND:
            case ApplicationCommandOptionType.SUB_COMMAND_GROUP:
                return option;
            default:
                return option.value;
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
     * Retrieves the value of a user option.
     * @param name The name of the option.
     * @returns The user ID string of the option, or undefined if not found.
     */
    public getUser(name: string): string | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.USER);
        return option?.value as string | undefined;
    }

    /**
     * Retrieves the value of a channel option.
     * @param name The name of the option.
     * @returns The channel ID string of the option, or undefined if not found.
     */
    public getChannel(name: string): string | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.CHANNEL);
        return option?.value as string | undefined;
    }

    /**
     * Retrieves the value of a role option.
     * @param name The name of the option.
     * @returns The role ID string of the option, or undefined if not found.
     */
    public getRole(name: string): string | undefined {
        const option = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.ROLE);
        return option?.value as string | undefined;
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
        // For now, we only have the ID. In a real scenario, we'll fetch the full channel object from cachce
        return new Channel(this.client, { id: this.channelId, type: ChannelType.GUILD_TEXT });
    }

    /**
     * A simplified way to access command options.
     */
    public get options(): InteractionOptions {
        return new InteractionOptions(this.data?.options);
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
    public async reply(options: string | { content?: string; embeds?: any[]; ephemeral?: boolean }): Promise<void> {
        let payload: any;
        let flags = 0;

        if (typeof options === 'string') {
            payload = { content: options };
        } else {
            payload = options;
            if (options.ephemeral) {
                flags |= MessageFlags.EPHEMERAL;
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