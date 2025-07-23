import { Client } from '../client/Client';
import { User } from './User';
import { Member } from './Member';
import { CHANNEL_MESSAGES } from '../rest/Endpoints';
import { EmbedBuilder } from '../Builders/structures/EmbedBuilder';
import { Poll, PollAnswer, PollMedia, PollResults, PollAnswerCount, PollLayoutType } from '../types/Poll';
import { ComponentV2Type, ComponentV2Union, ContainerComponent, SectionComponent, TextDisplayComponent, MediaGalleryComponent, SeparatorComponent, ActionRowComponent, ButtonComponent, StringSelectComponent } from '../types/ComponentV2'; // Import V2 types

export interface MessageAttachment {
    id: BigInt;
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
        id?: BigInt;
        name: string;
        animated?: boolean;
    };
}

export interface MessageReference {
    messageId?: BigInt;
    channelId?: BigInt;
    guildId?: BigInt;
    failIfNotExists?: boolean;
}

export interface MessageActivity {
    type: number;
    partyId?: string;
}

export interface MessageApplication {
    id: BigInt;
    coverImage?: string;
    description: string;
    icon?: string;
    name: string;
}

export interface MessageInteraction {
    id: BigInt;
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
        id?: BigInt;
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
            id?: BigInt;
            name?: string;
            animated?: boolean;
        };
        default?: boolean;
    }[];
}

export interface MessageSticker {
    id: BigInt;
    packId?: BigInt;
    name: string;
    description?: string;
    tags: string;
    asset?: string;
    type: number;
    formatType: number;
    available?: boolean;
    guildId?: BigInt;
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
    IS_COMPONENTS_V2 = 1 << 14,
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
     * Poll data, if the message is a poll.
     * @type {Poll | null}
     */
    public poll: Poll | null;

    /**
     * Components V2 data, if the message uses the new component system.
     * @type {ComponentV2Union[] | null}
     */
    public componentsV2: ComponentV2Union[] | null;

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
        this.attachments = (data.attachments ?? []).map((att: any) => ({ ...att, id: BigInt(att.id) }));
        this.embeds = data.embeds ?? [];
        this.reactions = (data.reactions ?? []).map((r: any) => ({ ...r, emoji: { ...r.emoji, id: r.emoji.id ? BigInt(r.emoji.id) : undefined } }));
        this.nonce = data.nonce ?? null;
        this.pinned = data.pinned ?? false;
        this.webhookId = data.webhook_id ?? null;
        this.activity = data.activity ?? null;
        this.application = data.application ? { ...data.application, id: BigInt(data.application.id) } : null;
        this.applicationId = data.application_id ?? null;
        this.messageReference = data.message_reference ? {
            messageId: data.message_reference.message_id ? BigInt(data.message_reference.message_id) : undefined,
            channelId: data.message_reference.channel_id ? BigInt(data.message_reference.channel_id) : undefined,
            guildId: data.message_reference.guild_id ? BigInt(data.message_reference.guild_id) : undefined,
            failIfNotExists: data.message_reference.fail_if_not_exists
        } : null;
        this.flags = data.flags ?? null;
        this.referencedMessage = data.referenced_message ? new Message(client, data.referenced_message) : null;
        this.interaction = data.interaction ? { ...data.interaction, id: BigInt(data.interaction.id) } : null;
        this.thread = data.thread ?? null;
        this.components = (data.components ?? []).map((c: any) => this._parseMessageComponent(c));
        this.stickerItems = (data.sticker_items ?? []).map((s: any) => ({ ...s, id: BigInt(s.id) }));
        this.stickers = (data.stickers ?? []).map((s: any) => ({
            ...s,
            id: BigInt(s.id),
            packId: s.pack_id ? BigInt(s.pack_id) : undefined,
            guildId: s.guild_id ? BigInt(s.guild_id) : undefined,
        }));
        this.position = data.position ?? null;
        this.roleSubscriptionData = data.role_subscription_data ?? null;
        
        if (data.poll) {
            this.poll = {
                id: BigInt(data.poll.id),
                question: data.poll.question as PollMedia,
                answers: data.poll.answers.map((answer: any) => ({ answer_id: answer.answer_id, poll_media: answer.poll_media as PollMedia })) as PollAnswer[],
                results: {
                    is_finalized: data.poll.results.is_finalized,
                    answer_counts: data.poll.results.answer_counts.map((count: any) => ({ id: count.id, count: count.count, me_voted: count.me_voted })) as PollAnswerCount[],
                } as PollResults,
                expiry: data.poll.expiry,
                allow_multiselect: data.poll.allow_multiselect,
                layout_type: data.poll.layout_type as PollLayoutType,
            };
        } else {
            this.poll = null;
        }

        this.componentsV2 = data.components_v2 ? this._parseComponentV2(data.components_v2) : null;

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
     * Helper to recursively parse raw Discord Components V2 data into our structured types.
     * @param rawComponents The raw components array from Discord.
     * @returns An array of parsed ComponentV2Union objects.
     */
    private _parseComponentV2(rawComponents: any[]): ComponentV2Union[] {
        return rawComponents.map(rawComp => {
            switch (rawComp.type) {
                case ComponentV2Type.CONTAINER:
                    return {
                        type: rawComp.type,
                        unique_id: rawComp.unique_id,
                        accent_color: rawComp.accent_color,
                        spoiler: rawComp.spoiler,
                        components: this._parseComponentV2(rawComp.components || []),
                    } as ContainerComponent;
                case ComponentV2Type.SECTION:
                    return {
                        type: rawComp.type,
                        components: this._parseComponentV2(rawComp.components || []),
                        accessory: rawComp.accessory,
                    } as SectionComponent;
                case ComponentV2Type.TEXT_DISPLAY:
                    return {
                        type: rawComp.type,
                        content: rawComp.content,
                    } as TextDisplayComponent;
                case ComponentV2Type.MEDIA_GALLERY:
                    return {
                        type: rawComp.type,
                        items: rawComp.items,
                    } as MediaGalleryComponent;
                case ComponentV2Type.SEPARATOR:
                    return { type: rawComp.type } as SeparatorComponent;
                case ComponentV2Type.ACTION_ROW:
                    return {
                        type: rawComp.type,
                        components: rawComp.components.map((c: any) => this._parseComponentV2(c)[0]),
                    } as ActionRowComponent;
                case ComponentV2Type.BUTTON:
                    return {
                        type: rawComp.type,
                        style: rawComp.style,
                        label: rawComp.label,
                        emoji: rawComp.emoji ? { ...rawComp.emoji, id: rawComp.emoji.id ? BigInt(rawComp.emoji.id) : undefined } : undefined,
                        custom_id: rawComp.custom_id,
                        url: rawComp.url,
                        disabled: rawComp.disabled,
                    } as ButtonComponent;
                case ComponentV2Type.STRING_SELECT:
                    return {
                        type: rawComp.type,
                        custom_id: rawComp.custom_id,
                        options: rawComp.options.map((opt: any) => ({
                            ...opt,
                            emoji: opt.emoji ? { ...opt.emoji, id: opt.emoji.id ? BigInt(opt.emoji.id) : undefined } : undefined,
                        })),
                        placeholder: rawComp.placeholder,
                        min_values: rawComp.min_values,
                        max_values: rawComp.max_values,
                        disabled: rawComp.disabled,
                    } as StringSelectComponent;
                default:
                    console.warn(`Unknown Component V2 type encountered: ${rawComp.type}`);
                    return rawComp; // Return raw if type is unknown
            }
        });
    }

    /**
     * Helper to recursively parse raw Discord Components data into our structured types.
     * @param rawComponent The raw component object from Discord.
     * @returns A parsed MessageComponent object.
     */
    private _parseMessageComponent(rawComponent: any): MessageComponent {
        const component: MessageComponent = {
            type: rawComponent.type,
            // Common
            style: rawComponent.style,
            label: rawComponent.label,
            emoji: rawComponent.emoji ? { ...rawComponent.emoji, id: rawComponent.emoji.id ? BigInt(rawComponent.emoji.id) : undefined } : undefined,
            customId: rawComponent.custom_id,
            url: rawComponent.url,
            disabled: rawComponent.disabled,
            // Select menu spe
            placeholder: rawComponent.placeholder,
            minValues: rawComponent.min_values,
            maxValues: rawComponent.max_values,
            options: rawComponent.options?.map((opt: any) => ({
                ...opt,
                emoji: opt.emoji ? { ...opt.emoji, id: opt.emoji.id ? BigInt(opt.emoji.id) : undefined } : undefined,
            })),
        };

        if (rawComponent.components) {
            component.components = rawComponent.components.map((c: any) => this._parseMessageComponent(c));
        }

        return component;
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
     * @param {string | object} content The new content or edit options. Can be string or an object with `content`, `embeds`, `components`, `flags`, `allowed_mentions`.
     * @param {string} [reason] The reason for editing the message.
     * @returns {Promise<Message>} The edited message.
     */
    public async edit(content: string | object, reason?: string): Promise<Message> {
        let payload: any;

        if (typeof content === 'string') {
            payload = { content };
        } else {
            payload = content;
        }

        const headers: any = { 'Content-Type': 'application/json' };
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        const response = await this.client.rest.request('PATCH',
            `/channels/${this.channelId.toString()}/messages/${this.id.toString()}`,
            payload,
            headers
        );

        const editedMessage = new Message(this.client, response);
        this.client.messages.set(editedMessage); // Update cache
        return editedMessage;
    }

    /**
     * Delete the message.
     * @param {string} [reason] Reason for deleting the message.
     * @returns {Promise<void>}
     */
    public async delete(reason?: string): Promise<void> {
        const headers: any = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        await this.client.rest.request('DELETE',
            `/channels/${this.channelId.toString()}/messages/${this.id.toString()}`,
            undefined,
            headers
        );

        this.client.messages.delete(BigInt(this.id));
    }

    /**
     * Pin the message.
     * @param {string} [reason] Reason for pinning the message.
     * @returns {Promise<void>}
     */
    public async pin(reason?: string): Promise<void> {
        const headers: any = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        await this.client.rest.request('PUT',
            `/channels/${this.channelId.toString()}/pins/${this.id.toString()}`,
            undefined,
            headers
        );

        this.pinned = true;
    }

    /**
     * Unpin the message.
     * @param {string} [reason] Reason for unpinning the message.
     * @returns {Promise<void>}
     */
    public async unpin(reason?: string): Promise<void> {
        const headers: any = {};
        if (reason) {
            headers['X-Audit-Log-Reason'] = encodeURIComponent(reason);
        }

        await this.client.rest.request('DELETE',
            `/channels/${this.channelId.toString()}/pins/${this.id.toString()}`,
            undefined,
            headers
        );

        this.pinned = false;
    }

    /**
     * React to the message with an emoji.
     * @param {string} emoji The emoji to react with. Can be a unicode emoji or a custom emoji in the format `name:id`.
     * @returns {Promise<void>}
     */
    public async react(emoji: string): Promise<void> {
        const encodedEmoji = encodeURIComponent(emoji);
        await this.client.rest.request('PUT',
            `/channels/${this.channelId.toString()}/messages/${this.id.toString()}/reactions/${encodedEmoji}/@me`
        );
    }

    /**
     * Reply to the message.
     * @param {string | object} content The reply content or options. Can be string or an object with `content`, `embeds`, `components`, `flags`, `allowed_mentions`, `message_reference`.
     * @returns {Promise<Message>} The reply message.
     */
    public async reply(content: string | object): Promise<Message> {
        let payload: any;

        if (typeof content === 'string') {
            payload = { content };
        } else {
            payload = content;
        }

        payload.message_reference = {
            message_id: this.id.toString(),
            channel_id: this.channelId.toString(),
            guild_id: this.guildId?.toString(),
            fail_if_not_exists: false, // depending on the wanted behavior can also be true
        };

        const response = await this.client.rest.request('POST',
            `/channels/${this.channelId.toString()}/messages`,
            payload
        );
        
        const replyMessage = new Message(this.client, response);
        this.client.messages.set(replyMessage); // Cache the reply
        return replyMessage;
    }

    /**
     * Create a thread from this message.
     * @param {object} options Thread creation options. Requires `name`, `auto_archive_duration`.
     * @returns {Promise<Thread>} The created thread.
     */
    public async startThread(options: { name: string; autoArchiveDuration?: number; rateLimitPerUser?: number; }): Promise<any> {
        if (!this.channelId) {
            throw new Error('Cannot start a thread without a channel ID.');
        }

        const payload: any = {
            name: options.name,
            auto_archive_duration: options.autoArchiveDuration ?? 1440, // 24 hours
            rate_limit_per_user: options.rateLimitPerUser,
        };

        const response = await this.client.rest.request('POST',
            `/channels/${this.channelId.toString()}/messages/${this.id.toString()}/threads`,
            payload
        );

        const ThreadClass = (await import('./Thread')).Thread;
        const newThread = new ThreadClass(this.client, response);
        return newThread;
    }

    /**
     * Crosspost the message to subscribed channels (announcement channels only).
     * @returns {Promise<Message>} The crossposted message.
     */
    public async crosspost(): Promise<Message> {
        if (!this.crosspostable) {
            throw new Error('Message is not crosspostable or already crossposted).');
        }

        const response = await this.client.rest.request('POST',
            `/channels/${this.channelId.toString()}/messages/${this.id.toString()}/crosspost`
        );

        const crosspostedMessage = new Message(this.client, response);
        this.client.messages.set(crosspostedMessage);
        return crosspostedMessage;
    }

    /**
     * Sends a message to the channel this message belongs to.
     * @param {string | object} content The content of the message or message options.
     * @returns {Promise<Message>} The sent message.
     */
    public async send(content: string | object): Promise<Message> {
        const payload = typeof content === 'string' ? { content } : content;
        const response = await this.client.rest.request('POST', CHANNEL_MESSAGES(this.channelId.toString()), payload);
        const newMessage = new Message(this.client, response);
        this.client.messages.set(newMessage);
        return newMessage;
    }

    /**
     * Forwards this message to another channel.
     * @param {BigInt} targetChannelId The ID of the channel to forward the message to.
     * @returns {Promise<Message>} The new message sent in the target channel.
     */
    public async forward(targetChannelId: BigInt): Promise<Message> {
        const payload: any = {
            content: this.content,
            tts: this.tts,
            embeds: this.embeds,
            attachments: this.attachments.map(att => ({
                id: att.id.toString(),
                filename: att.filename,
                description: att.description,
                content_type: att.contentType,
                size: att.size,
                url: att.url,
                proxy_url: att.proxyUrl,
                height: att.height,
                width: att.width,
                ephemeral: att.ephemeral,
            })),
            components: this.components.map(comp => this._serializeMessageComponent(comp)),
            sticker_ids: this.stickerItems.map(sticker => sticker.id.toString()),
        };

        // Try to forward a poll if exists, throw an ANDOROMEDA error if failed 
        if (this.poll) {
            try {
                payload.poll = {
                    question: this.poll.question,
                    answers: this.poll.answers.map(ans => ({ answer_id: ans.answer_id, poll_media: ans.poll_media })),
                    allow_multiselect: this.poll.allow_multiselect,
                    layout_type: this.poll.layout_type,
                };
                if (this.poll.id) {
                    payload.poll.id = this.poll.id.toString();
                }

            } catch (error) {
                console.error('[ANDOROMEDA]: Failed to forward poll data:', error);
                delete payload.poll; // Remove poll from payload if it failed to process
            }
        }

        const response = await this.client.rest.request('POST', `/channels/${targetChannelId.toString()}/messages`, payload);
        return new Message(this.client, response);
    }

    /**
     * Helper to recursively serialize our structured MessageComponent types back to raw Discord format.
     * @param component The structured MessageComponent object.
     * @returns The raw Discord component object.
     */
    private _serializeMessageComponent(component: MessageComponent): any {
        const rawComponent: any = {
            type: component.type,
            style: component.style,
            label: component.label,
            emoji: component.emoji ? { ...component.emoji, id: component.emoji.id?.toString() } : undefined,
            custom_id: component.customId,
            url: component.url,
            disabled: component.disabled,
            placeholder: component.placeholder,
            min_values: component.minValues,
            max_values: component.maxValues,
            options: component.options?.map((opt: any) => ({
                ...opt,
                emoji: opt.emoji ? { ...opt.emoji, id: opt.emoji.id?.toString() } : undefined,
            })),
        };

        if (component.components) {
            rawComponent.components = component.components.map(c => this._serializeMessageComponent(c));
        }

        return rawComponent;
    }
}