import { Client } from '../client/Client';
import { Interaction as InteractionPayload, InteractionType, ApplicationCommandInteractionData } from '../types/Interaction';
import { MessageFlags } from '../types/Message';
import { User } from '../structures/User'
import { Member } from '../structures/Member'
import { Message } from '../structures/Message'
import { INTERACTION_CALLBACK } from '../rest/Endpoints';
import { EmbedBuilder } from '../Builders/structures/EmbedBuilder';

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