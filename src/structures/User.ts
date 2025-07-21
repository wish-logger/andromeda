import { Client } from '../client/Client';

/**
 * Represents a user on Discord.
 */
export class User {
    /**
     * The user's ID.
     * @type {string}
     */
    public id: string;
    /**
     * The user's username.
     * @type {string}
     */
    public username: string;
    /**
     * The user's 4-digit Discord tag.
     * @type {string}
     */
    public discriminator: string;
    /**
     * The user's avatar hash.
     * @type {string | null}
     */
    public avatar: string | null;
    /**
     * Whether the user is a bot.
     * @type {boolean}
     */
    public bot: boolean;

    /**
     * Creates a new User instance.
     * @param {Client} client The client instance.
     * @param {any} data The raw user data from Discord.
     */
    constructor(client: Client, data: any) {
        this.id = data.id;
        this.username = data.username;
        this.discriminator = data.discriminator;
        this.avatar = data.avatar;
        this.bot = data.bot ?? false;
    }

    /**
     * The user's tag (e.g., `username#1234`).
     * @type {string}
     */
    public get tag(): string {
        return `${this.username}#${this.discriminator}`;
    }
}
