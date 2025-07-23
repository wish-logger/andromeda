import { Client } from '../client/Client';
import { InteractionData, InteractionType, ApplicationCommandInteractionData, ApplicationCommandInteractionDataOption, ResolvedData } from '../types/Interaction';
import { MessageFlags } from '../types/Message';
import { User } from '../structures/User';
import { Member } from '../structures/Member';
import { Message } from '../structures/Message';
import { INTERACTION_CALLBACK } from '../rest/Endpoints';
import { EmbedBuilder } from '../Builders/structures/EmbedBuilder';
import { Channel } from '../structures/Channel';
import { ChannelType } from '../types/Channel';
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
import { ButtonBuilder } from '../Builders/structures/ButtonBuilder';
import { StringSelectMenuBuilder } from '../Builders/structures/components/StringSelectMenuBuilder';

/**
 * A helper class to simplify accessing interaction options.
 */
class InteractionOptions {
    private options: ApplicationCommandInteractionDataOption[] | undefined;
    private resolved: ResolvedData | undefined;
    public client: Client;
    private guildId?: bigint;

    constructor(client: Client, options: ApplicationCommandInteractionDataOption[] | undefined, resolved: ResolvedData | undefined, guildId?: string) {
        this.client = client;
        this.options = options;
        this.resolved = resolved;
        this.guildId = guildId ? BigInt(guildId) : undefined;
    }

    /**
     * Helper method to recursively find an option by name within the options array.
     * This handles nested options within subcommands and subcommand groups.
     * @param optionsArray The current array of options to search.
     * @param name The name of the option to find.
     * @returns The found option, or undefined.
     */
    private _findOptionRecursive(optionsArray: ApplicationCommandInteractionDataOption[] | undefined, name: string): ApplicationCommandInteractionDataOption | undefined {
        if (!optionsArray) return undefined;

        let foundOption: ApplicationCommandInteractionDataOption | undefined;

        for (const option of optionsArray) {
            if ((option.type === ApplicationCommandOptionType.SUB_COMMAND || option.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP) && option.options) {

                const foundInSub = this._findOptionRecursive(option.options, name);
                if (foundInSub) {
                    return foundInSub;
                }
            }
            if (option.name === name) {
                foundOption = option;
            }
        }
        return foundOption;
    }

    /**
     * Retrieves the value of a command option by its name.
     * @param name The name of the option.
     * @returns The value of the option, or undefined if not found.
     */
    public getValue(name: string): any | undefined {
        const option = this._findOptionRecursive(this.options, name);
        return option?.value;
    }

    /**
     * Retrieves the value of a command option by its name, automatically converting it to the correct type.
     * @param name The name of the option.
     * @returns The converted value of the option, or undefined if not found.
     */
    public getData(name: string): any | undefined {
        const option = this._findOptionRecursive(this.options, name);
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
                return option.value;
        }
    }

    /**
     * Retrieves the value of a string option.
     * @param name The name of the option.
     * @returns The string value of the option, or undefined if not found.
     */
    public getString(name: string): string | undefined {
        const option = this._findOptionRecursive(this.options, name);
        return option?.value as string | undefined;
    }

    /**
     * Retrieves the value of an integer option.
     * @param name The name of the option.
     * @returns The integer value of the option, or undefined if not found.
     */
    public getInteger(name: string): number | undefined {
        const option = this._findOptionRecursive(this.options, name);
        return option?.value as number | undefined;
    }

    /**
     * Retrieves the value of a boolean option.
     * @param name The name of the option.
     * @returns The boolean value of the option, or undefined if not found.
     */
    public getBoolean(name: string): boolean | undefined {
        const option = this._findOptionRecursive(this.options, name);
        return option?.value as boolean | undefined;
    }

    /**
     * Retrieves a User object from a user option.
     * @param name The name of the user option.
     * @returns The User object, or undefined if not found.
     */
    public async getUser(name: string): Promise<User | null> {
        const option = this._findOptionRecursive(this.options, name);
        if (!option?.value) return null;
        
        const userId = BigInt(option.value as string);
        let user: User | null = this.client.userCache.get(userId) || null;
        if (user) return user;
        
        if (this.resolved?.users && this.resolved.users[option.value as string]) {
            const userData = this.resolved.users[option.value as string];
            user = new User(this.client, userData);
            this.client.userCache.set(user);
            return user;
        }

        try {
            user = await this.client.fetchUser(userId);
            return user;
        } catch (error) {
            console.error(`Failed to retrieve user ${userId} from interaction options:`, error);
            return null;
        }
    }

    /**
     * Retrieves a Member object from a user or mentionable option.
     * @param name The name of the user or mentionable option.
     * @returns The Member object, or undefined if not found.
     */
    public getMember(name: string): Member | undefined {
        const option = this._findOptionRecursive(this.options, name);
        if (!option?.value || !this.resolved?.members || !this.resolved.users || !this.guildId) return undefined;

        const memberId = BigInt(option.value as string);
        const memberData = this.resolved.members[memberId.toString()];
        const userData = this.resolved.users[memberId.toString()];

        if (memberData && userData) {
            let user = this.client.userCache.get(memberId);
            if (!user) {
                user = new User(this.client, userData);
                this.client.userCache.set(user);
            }

            const fullMemberData = { ...memberData, user: user };
            return new Member(this.client, fullMemberData, this.guildId.toString());
        }
        return undefined;
    }

    /**
     * Retrieves a Channel object from a channel option.
     * @param name The name of the channel option.
     * @returns The Channel object, or undefined if not found.
     */
    public async getChannel(name: string): Promise<Channel | undefined> {
        const option = this._findOptionRecursive(this.options, name);
        if (!option?.value) return undefined;
        
        const channelId = BigInt(option.value as string);
        let channel = this.client.channelCache.get(channelId);
        if (channel) return channel;

        if (this.resolved?.channels && this.resolved.channels[option.value as string]) {
            const channelData = this.resolved.channels[option.value as string];
            channel = new Channel(this.client, channelData);
            this.client.channelCache.set(channel);
            return channel;
        }

        try {
            channel = await this.client.fetchChannel(channelId);
            return channel;
        } catch (error) {
            console.error(`Failed to retrieve channel ${channelId} from interaction options:`, error);
            return undefined;
        }
    }

    /**
     * Retrieves a Role object from a role option.
     * @param name The name of the option.
     * @returns The Role object, or undefined if not found.
     */
    public getRole(name: string): Role | undefined {
        const option = this._findOptionRecursive(this.options, name);
        if (!option?.value || !this.resolved?.roles || !this.guildId) return undefined;

        const roleId = BigInt(option.value as string);
        // Roles are typically cached per guild, not globally in the client.guildCache
        // For now we will create a new Role instance
        const roleData = this.resolved.roles[option.value as string];
        return roleData ? new Role(this.client, roleData, this.guildId.toString()) : undefined;
    }

    /**
     * Retrieves the value of a mentionable option.
     * @param name The name of the option.
     * @returns The mentionable ID string of the option, or undefined if not found.
     */
    public getMentionable(name: string): string | undefined {
        const option = this._findOptionRecursive(this.options, name);
        return option?.value as string | undefined;
    }

    /**
     * Retrieves the value of a number option.
     * @param name The name of the option.
     * @returns The number value of the option, or undefined if not found.
     */
    public getNumber(name: string): number | undefined {
        const option = this._findOptionRecursive(this.options, name);
        return option?.value as number | undefined;
    }

    /**
     * Retrieves the ID of a channel option as a BigInt.
     * @param name The name of the channel option.
     * @returns The BigInt ID of the channel, or undefined if not found.
     */
    public async getChannelId(name: string): Promise<bigint | undefined> {
        const channel = await this.getChannel(name);
        return channel?.id;
    }

    /**
     * Retrieves the ID of a user option as a BigInt.
     * @param name The name of the user option.
     * @returns The BigInt ID of the user, or undefined if not found.
     */
    public async getUserId(name: string): Promise<bigint | undefined> {
        const user = await this.getUser(name);
        return user?.id;
    }

    /**
     * Retrieves the value of a subcommand option.
     * @param {string} [name] The name of the subcommand option. If omitted, returns the name of the top-level subcommand.
     * @returns {string | undefined} The subcommand name, or undefined if not found.
     */
    public getSubcommand(name?: string): string | undefined {
        const subcommandOption = this.options?.find(opt => opt.type === ApplicationCommandOptionType.SUB_COMMAND || opt.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP);
        return subcommandOption ? subcommandOption.name : undefined;
    }

    /**
     * Retrieves the value of a subcommand group option.
     * @param name The name of the option.
     * @returns The subcommand group object, or undefined if not found.
     */
    public getSubcommandGroup(name: string): any | undefined {
        const groupOption = this.options?.find(opt => opt.name === name && opt.type === ApplicationCommandOptionType.SUB_COMMAND_GROUP);
        return groupOption;
    }
}

/**
 * Represents a Discord interaction.
 */
export class Interaction {
    public id: bigint;
    public applicationId: bigint;
    public type: InteractionType;
    public data?: ApplicationCommandInteractionData;
    public guildId?: bigint;
    public channelId?: bigint;
    public member?: Member;
    public user: User | null;
    public token: string;
    public version: number;
    public message?: Message;

    private _client: Client;

    /**
     * Creates an instance of Interaction.
     * @param {Client} client The client instance.
     * @param {InteractionData} data The raw interaction payload.
     */
    constructor(client: Client, data: InteractionData) {
        this._client = client;
        this.id = BigInt(data.id);
        this.applicationId = BigInt(data.application_id);
        this.type = data.type;
        this.data = data.data;
        this.guildId = data.guild_id ? BigInt(data.guild_id) : undefined;
        this.channelId = data.channel_id ? BigInt(data.channel_id) : undefined;
        this.token = data.token;
        this.version = data.version;

        if (data.user) {
            let user: User | null = this._client.userCache.get(BigInt(data.user.id)) || null;
            if (!user) {
                user = new User(this._client, data.user);
                this._client.userCache.set(user);
            }
            this.user = user;
        } else {
            this.user = null;
        }

        if (data.member) {
            this.member = new Member(this._client, data.member, this.guildId!.toString());
        }

        this.message = data.message ? new Message(this._client, data.message) : undefined;
        if (this.message) {
            this._client.messages.set(this.message);
        }
    }

    /**
     * Public getter for the client instance.
     * @returns {Client} The client instance.
     */
    public get client(): Client {
        return this._client;
    }

    /**
     * Returns the channel associated with this interaction.
     * @returns {Channel | undefined} The channel object, or undefined if not available.
     */
    public get channel(): Channel | undefined {
        if (!this.channelId) return undefined;

        let channel = this._client.channelCache.get(this.channelId);
        if (channel) {
            return channel;
        }

        if (this.data?.resolved?.channels && this.data.resolved.channels[this.channelId.toString()]) {
            channel = new Channel(this._client, this.data.resolved.channels[this.channelId.toString()]);
            this._client.channelCache.set(channel);
            return channel;
        }
        
        return new Channel(this._client, { id: this.channelId.toString(), type: ChannelType.GUILD_TEXT, guild_id: this.guildId?.toString() });
    }

    /**
     * Access to command options.
     */
    public get options(): InteractionOptions {
        return new InteractionOptions(this._client, this.data?.options, this.data?.resolved, this.guildId?.toString()); // Pass guildId as string to InteractionOptions
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
    public async reply(options: string | { content?: string; embeds?: any[]; ephemeral?: boolean; componentsV2?: (ContainerBuilder | SectionBuilder | TextDisplayBuilder | MediaGalleryBuilder | SeparatorBuilder | ActionRowBuilder)[]; components?: ActionRowBuilder[] }): Promise<void> {
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
                delete payload.components;
            } else if (options.components && options.components.length > 0) {
                payload.components = options.components.map(comp => comp.toJSON());
            }
        }

        await this._client.rest.request(
            'POST',
            INTERACTION_CALLBACK(this.id.toString(), this.token),
            {
                type: 4,
                data: {
                    ...payload,
                    flags: flags,
                },
            }
        );
    }

    /**
     * Updates the original interaction response message.
     * @param {string | { content?: string; embeds?: any[]; components?: ActionRowBuilder[]; componentsV2?: (ContainerBuilder | SectionBuilder | TextDisplayBuilder | MediaGalleryBuilder | SeparatorBuilder | ActionRowBuilder)[] }} options The message content or an object with message options to update.
     * @returns {Promise<void>}
     */
    public async update(options: string | { content?: string; embeds?: any[]; components?: ActionRowBuilder[]; componentsV2?: (ContainerBuilder | SectionBuilder | TextDisplayBuilder | MediaGalleryBuilder | SeparatorBuilder | ActionRowBuilder)[] }): Promise<void> {
        let payload: any;
        
        if (typeof options === 'string') {
            payload = { content: options };
        } else {
            payload = options;

            if (options.componentsV2 && options.componentsV2.length > 0) {
                payload.components_v2 = options.componentsV2.map(comp => comp.toJSON());

                delete payload.components;
            } else if (options.components && options.components.length > 0) {
                payload.components = options.components.map(comp => comp.toJSON());
            }
        }

        await this._client.rest.request(
            'POST',
            INTERACTION_CALLBACK(this.id.toString(), this.token),
            {
                type: 7,
                data: {
                    ...payload,
                },
            }
        );
    }
}