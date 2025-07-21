import { Client } from '../client/Client';

/**
 * Represents a message on Discord.
 */
export class Message {
    /**
     * The ID of the message.
     * @type {string}
     */
    public id: string;
    /**
     * The content of the message.
     * @type {string}
     */
    public content: string;
    /**
     * The author of the message.
     * @type {any} // TODO: Create User structure
     */
    public author: any; 
    /**
     * The ID of the channel the message was sent in.
     * @type {string}
     */
    public channelId: string;
    /**
     * The ID of the guild the message was sent in, if applicable.
     * @type {string | undefined}
     */
    public guildId: string | undefined;

    /**
     * Creates a new Message instance.
     * @param {Client} client The client instance.
     * @param {any} data The raw message data from Discord.
     */
    constructor(client: Client, data: any) {
        this.id = data.id;
        this.content = data.content;
        this.author = data.author;
        this.channelId = data.channel_id;
        this.guildId = data.guild_id;
    }
}
