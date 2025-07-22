import { Client } from '../client/Client';
import { User } from './User';
import { Member } from './Member'
import { EmbedBuilder } from '../Builders/structures/EmbedBuilder';

export interface MessageAttachment {
    id: string;
    filename: string;
    description?: string;
    contentType?: string;
    size: number;
    url: string;
    proxyUrl: string;
    height?: number;
    width?: number;
    ephemeral?: boolean;
}

export interface MessageEmbed {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: {
        text: string;
        iconUrl?: string;
        proxyIconUrl?: string;
    };
    image?: {
        url: string;
        proxyUrl?: string;
        height?: number;
        width?: number;
    };
    thumbnail?: {
        url: string;
        proxyUrl?: string;
        height?: number;
        width?: number;
    };
    video?: {
        url?: string;
        proxyUrl?: string;
        height?: number;
        width?: number;
    };
    provider?: {
        name?: string;
        url?: string;
    };
    author?: {
        name: string;
        url?: string;
        iconUrl?: string;
        proxyIconUrl?: string;
    };
    fields?: {
        name: string;
        value: string;
        inline?: boolean;
    }[];
}

export interface MessageReaction {
    count: number;
    me: boolean;
    emoji: {
        id?: string;
        name: string;
        animated?: boolean;
    };
}

export interface MessageReference {
    messageId?: string;
    channelId?: string;
    guildId?: string;
    failIfNotExists?: boolean;
}

export interface MessageActivity {
    type: number;
    partyId?: string;
}

export interface MessageApplication {
    id: string;
    coverImage?: string;
    description: string;
    icon?: string;
    name: string;
}

export interface MessageInteraction {
    id: string;
    type: number;
    name: string;
    user: User;
    member?: Member;
}

export interface MessageComponent {
    type: number;
    components?: MessageComponent[];
    style?: number;
    label?: string;
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    };
    customId?: string;
    url?: string;
    disabled?: boolean;
    placeholder?: string;
    minValues?: number;
    maxValues?: number;
    options?: {
        label: string;
        value: string;
        description?: string;
        emoji?: {
            id?: string;
            name?: string;
            animated?: boolean;
        };
        default?: boolean;
    }[];
}

export interface MessageSticker {
    id: string;
    packId?: string;
    name: string;
    description?: string;
    tags: string;
    asset?: string;
    type: number;
    formatType: number;
    available?: boolean;
    guildId?: string;
    user?: User;
    sortValue?: number;
}

/**
 * Message types enum
 */
export enum MessageType {
    DEFAULT = 0,
    RECIPIENT_ADD = 1,
    RECIPIENT_REMOVE = 2,
    CALL = 3,
    CHANNEL_NAME_CHANGE = 4,
    CHANNEL_ICON_CHANGE = 5,
    CHANNEL_PINNED_MESSAGE = 6,
    USER_JOIN = 7,
    GUILD_BOOST = 8,
    GUILD_BOOST_TIER_1 = 9,
    GUILD_BOOST_TIER_2 = 10,
    GUILD_BOOST_TIER_3 = 11,
    CHANNEL_FOLLOW_ADD = 12,
    GUILD_DISCOVERY_DISQUALIFIED = 14,
    GUILD_DISCOVERY_REQUALIFIED = 15,
    GUILD_DISCOVERY_GRACE_PERIOD_INITIAL_WARNING = 16,
    GUILD_DISCOVERY_GRACE_PERIOD_FINAL_WARNING = 17,
    THREAD_CREATED = 18,
    REPLY = 19,
    CHAT_INPUT_COMMAND = 20,
    THREAD_STARTER_MESSAGE = 21,
    GUILD_INVITE_REMINDER = 22,
    CONTEXT_MENU_COMMAND = 23,
    AUTO_MODERATION_ACTION = 24,
    ROLE_SUBSCRIPTION_PURCHASE = 25,
    INTERACTION_PREMIUM_UPSELL = 26,
    STAGE_START = 27,
    STAGE_END = 28,
    STAGE_SPEAKER = 29,
    STAGE_TOPIC = 31,
    GUILD_APPLICATION_PREMIUM_SUBSCRIPTION = 32,
}

/**
 * Message flags enum
 */
export enum MessageFlags {
    CROSSPOSTED = 1 << 0,
    IS_CROSSPOST = 1 << 1,
    SUPPRESS_EMBEDS = 1 << 2,
    SOURCE_MESSAGE_DELETED = 1 << 3,
    URGENT = 1 << 4,
    HAS_THREAD = 1 << 5,
    EPHEMERAL = 1 << 6,
    LOADING = 1 << 7,
    FAILED_TO_MENTION_SOME_ROLES_IN_THREAD = 1 << 8,
    SUPPRESS_NOTIFICATIONS = 1 << 12,
    IS_VOICE_MESSAGE = 1 << 13,
}

/**
 * Represents a message on Discord.
 */
export class Message {
    /**
     * The client instance.
     * @type {Client}
     */
    public client: Client;

    /**
     * The ID of the message.
     * @type {string}
     */
    public id: string;

    /**
     * The type of message.
     * @type {MessageType}
     */
    public type: MessageType;

    /**
     * The content of the message.
     * @type {string}
     */
    public content: string;

    /**
     * The author of the message.
     * @type {User}
     */
    public author: User;

    /**
     * The ID of the channel the message was sent in.
     * @type {string}
     */
    public channelId: string;

    /**
     * The channel the message was sent in.
     * @type {object}
     */
    public channel: any;

    /**
     * The ID of the guild the message was sent in, if applicable.
     * @type {string | null}
     */
    public guildId: string | null;

    /**
     * When the message was sent.
     * @type {Date}
     */
    public timestamp: Date;

    /**
     * When the message was edited (if applicable).
     * @type {Date | null}
     */
    public editedTimestamp: Date | null;

    /**
     * Whether this message is a TTS message.
     * @type {boolean}
     */
    public tts: boolean;

    /**
     * Whether this message mentions everyone.
     * @type {boolean}
     */
    public mentionEveryone: boolean;

    /**
     * Users specifically mentioned in the message.
     * @type {User[]}
     */
    public mentions: User[];

    /**
     * Roles specifically mentioned in this message.
     * @type {string[]}
     */
    public mentionRoles: string[];

    /**
     * Channels specifically mentioned in this message.
     * @type {any[]}
     */
    public mentionChannels: any[];

    /**
     * Any attached files.
     * @type {MessageAttachment[]}
     */
    public attachments: MessageAttachment[];

    /**
     * Any embedded content.
     * @type {MessageEmbed[]}
     */
    public embeds: MessageEmbed[];

    /**
     * Reactions to the message.
     * @type {MessageReaction[]}
     */
    public reactions: MessageReaction[];

    /**
     * Used for validating a message was sent.
     * @type {string | number | null}
     */
    public nonce: string | number | null;

    /**
     * Whether this message is pinned.
     * @type {boolean}
     */
    public pinned: boolean;

    /**
     * If the message is generated by a webhook, this is the webhook's id.
     * @type {string | null}
     */
    public webhookId: string | null;

    /**
     * Message activity object.
     * @type {MessageActivity | null}
     */
    public activity: MessageActivity | null;

    /**
     * Application object.
     * @type {MessageApplication | null}
     */
    public application: MessageApplication | null;

    /**
     * Application id if message is an Interaction or application-owned webhook.
     * @type {string | null}
     */
    public applicationId: string | null;

    /**
     * Data showing the source of a crosspost, channel follow add, pin, or reply message.
     * @type {MessageReference | null}
     */
    public messageReference: MessageReference | null;

    /**
     * Message flags combined as a bitfield.
     * @type {number | null}
     */
    public flags: number | null;

    /**
     * The message associated with the message_reference.
     * @type {Message | null}
     */
    public referencedMessage: Message | null;

    /**
     * Sent if the message is a response to an Interaction.
     * @type {MessageInteraction | null}
     */
    public interaction: MessageInteraction | null;

    /**
     * The thread that was started from this message.
     * @type {any | null}
     */
    public thread: any | null; // TODO: Create Thread structure

    /**
     * Sent if the message contains components like buttons, action rows, or other interactive components.
     * @type {MessageComponent[]}
     */
    public components: MessageComponent[];

    /**
     * Sent if the message contains stickers.
     * @type {MessageSticker[]}
     */
    public stickerItems: MessageSticker[];

    /**
     * The stickers sent with the message.
     * @type {MessageSticker[]}
     */
    public stickers: MessageSticker[];

    /**
     * A generally increasing integer with potentially gaps or duplicates that represents the approximate position of the message in a thread.
     * @type {number | null}
     */
    public position: number | null;

    /**
     * Data of the role subscription purchase or renewal that prompted this message.
     * @type {any | null}
     */
    public roleSubscriptionData: any | null;

    /**
     * Creates a new Message instance.
     * @param {Client} client The client instance.
     * @param {any} data The raw message data from Discord.
     */
    constructor(client: Client, data: any) {
        this.client = client;
        this.id = data.id;
        this.type = data.type ?? MessageType.DEFAULT;
        this.content = data.content ?? '';
        this.author = new User(client, data.author);
        this.channelId = data.channel_id;
        this.guildId = data.guild_id ?? null;
        this.timestamp = new Date(data.timestamp);
        this.editedTimestamp = data.edited_timestamp ? new Date(data.edited_timestamp) : null;
        this.tts = data.tts ?? false;
        this.mentionEveryone = data.mention_everyone ?? false;
        this.mentions = (data.mentions ?? []).map((user: any) => new User(client, user));
        this.mentionRoles = data.mention_roles ?? [];
        this.mentionChannels = data.mention_channels ?? [];
        this.attachments = data.attachments ?? [];
        this.embeds = data.embeds ?? [];
        this.reactions = data.reactions ?? [];
        this.nonce = data.nonce ?? null;
        this.pinned = data.pinned ?? false;
        this.webhookId = data.webhook_id ?? null;
        this.activity = data.activity ?? null;
        this.application = data.application ?? null;
        this.applicationId = data.application_id ?? null;
        this.messageReference = data.message_reference ?? null;
        this.flags = data.flags ?? null;
        this.referencedMessage = data.referenced_message ? new Message(client, data.referenced_message) : null;
        this.interaction = data.interaction ?? null;
        this.thread = data.thread ?? null;
        this.components = data.components ?? [];
        this.stickerItems = data.sticker_items ?? [];
        this.stickers = data.stickers ?? [];
        this.position = data.position ?? null;
        this.roleSubscriptionData = data.role_subscription_data ?? null;

        this.channel = {
            send: async (content: string | { embeds: EmbedBuilder[] }) => {
                let payload: any = {};

                if (typeof content === 'string') {
                    payload.content = content;
                } else if (typeof content === 'object' && content.embeds) {
                    payload.embeds = content.embeds.map(embed => embed.toJSON());
                } else {
                    throw new Error('Invalid content type for message sending.');
                }

                return this.client.rest.request('POST', `/channels/${this.channelId}/messages`, payload);
            }
        };
    }

    /**
     * Returns the URL to jump to this message.
     * @type {string}
     */
    public get url(): string {
        return `https://discord.com/channels/${this.guildId || '@me'}/${this.channelId}/${this.id}`;
    }

    /**
     * The time the message was created.
     * @type {Date}
     */
    public get createdAt(): Date {
        return this.timestamp;
    }

    /**
     * Whether this message was edited.
     * @type {boolean}
     */
    public get edited(): boolean {
        return this.editedTimestamp !== null;
    }

    /**
     * Whether this message is from a guild.
     * @type {boolean}
     */
    public get inGuild(): boolean {
        return this.guildId !== null;
    }

    /**
     * Whether this message is a system message.
     * @type {boolean}
     */
    public get system(): boolean {
        return this.type !== MessageType.DEFAULT && this.type !== MessageType.REPLY;
    }

    /**
     * Whether this message is deletable by the client user.
     * @type {boolean}
     */
    public get deletable(): boolean {
        // This would need more context about permissions, but basic logic:
        return this.author.id === this.client.user?.id || !this.inGuild;
    }

    /**
     * Whether this message is editable by the client user.
     * @type {boolean}
     */
    public get editable(): boolean {
        return this.author.id === this.client.user?.id;
    }

    /**
     * Whether this message is crosspostable.
     * @type {boolean}
     */
    public get crosspostable(): boolean {
        return !!(this.flags && !(this.flags & MessageFlags.CROSSPOSTED) && this.type === MessageType.DEFAULT);
    }

    /**
     * Returns the message as a mention string.
     * @returns {string} The message mention.
     */
    public toString(): string {
        return `https://discord.com/channels/${this.guildId || '@me'}/${this.channelId}/${this.id}`;
    }

    /**
     * Edit the message.
     * @param {string | any} content The new content or edit options.
     * @returns {Promise<Message>} The edited message.
     */
    public async edit(content: string | any): Promise<Message> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Delete the message.
     * @param {string} reason Reason for deleting the message.
     * @returns {Promise<Message>} The deleted message.
     */
    public async delete(reason?: string): Promise<Message> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Pin the message.
     * @param {string} reason Reason for pinning the message.
     * @returns {Promise<void>}
     */
    public async pin(reason?: string): Promise<void> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Unpin the message.
     * @param {string} reason Reason for unpinning the message.
     * @returns {Promise<void>}
     */
    public async unpin(reason?: string): Promise<void> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * React to the message with an emoji.
     * @param {string} emoji The emoji to react with.
     * @returns {Promise<void>}
     */
    public async react(emoji: string): Promise<void> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Reply to the message.
     * @param {string | any} content The reply content or options.
     * @returns {Promise<Message>} The reply message.
     */
    public async reply(content: string | any): Promise<Message> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Create a thread from this message.
     * @param {any} options Thread creation options.
     * @returns {Promise<any>} The created thread.
     */
    public async startThread(options: any): Promise<any> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }

    /**
     * Crosspost the message to subscribed channels (announcement channels only).
     * @returns {Promise<Message>} The crossposted message.
     */
    public async crosspost(): Promise<Message> {
        // This would be implemented with API calls
        throw new Error('Method not implemented - requires API implementation');
    }
}