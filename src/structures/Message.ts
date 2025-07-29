import { Client } from '../client/Client';
import { User } from './User';
import { Member } from './Member';
import { CHANNEL_MESSAGES } from '../rest/Endpoints';
import { EmbedBuilder } from '../Builders/structures/EmbedBuilder';
import { Poll, PollAnswer, PollMedia, PollResults, PollAnswerCount, PollLayoutType } from '../types/Poll';
import { ComponentV2Type, ComponentV2Union, ContainerComponent, SectionComponent, TextDisplayComponent, MediaGalleryComponent, SeparatorComponent, ActionRowComponent, ButtonComponent, StringSelectComponent } from '../types/ComponentV2'; // Import V2 types
import { MessageFlags, MessageType } from '../types/Message';
import { PartialThread, ThreadMetadata, ThreadMember } from '../types/Thread';
import { ResolvedData } from '../types/Interaction';
import { Channel } from './Channel';
import { Role } from './Role';

/**
 * Represents an attachment in a message.
 */
export interface MessageAttachment {
    id: BigInt;
    filename: string;
    title?: string;
    description?: string;
    contentType?: string;
    size: number;
    url: string;
    proxyUrl: string;
    height?: number | null;
    width?: number | null;
    ephemeral?: boolean;
    durationSecs?: number;
    waveform?: string;
    flags?: number;
}

/**
 * Represents the footer of an embed.
 */
export interface EmbedFooter {
    text: string;
    iconUrl?: string;
    proxyIconUrl?: string;
}

/**
 * Represents the image of an embed.
 */
export interface EmbedImage {
    url: string;
    proxyUrl?: string;
    height?: number;
    width?: number;
}

/**
 * Represents the thumbnail of an embed.
 */
export interface EmbedThumbnail {
    url: string;
    proxyUrl?: string;
    height?: number;
    width?: number;
}

/**
 * Represents the video of an embed.
 */
export interface EmbedVideo {
    url?: string;
    proxyUrl?: string;
    height?: number;
    width?: number;
}

/**
 * Represents the provider of an embed.
 */
export interface EmbedProvider {
    name?: string;
    url?: string;
}

/**
 * Represents the author of an embed.
 */
export interface EmbedAuthor {
    name: string;
    url?: string;
    iconUrl?: string;
    proxyIconUrl?: string;
}

/**
 * Represents a field in an embed.
 */
export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
}

/**
 * Represents embedded content in a message.
 */
export interface MessageEmbed {
    title?: string;
    type?: string;
    description?: string;
    url?: string;
    timestamp?: string;
    color?: number;
    footer?: EmbedFooter;
    image?: EmbedImage;
    thumbnail?: EmbedThumbnail;
    video?: EmbedVideo;
    provider?: EmbedProvider;
    author?: EmbedAuthor;
    fields?: EmbedField[];

    pollQuestionText?: string;
    victorAnswerVotes?: number;
    totalVotes?: number;
    victorAnswerId?: string;
    victorAnswerText?: string;
    victorAnswerEmojiId?: string;
    victorAnswerEmojiName?: string;
    victorAnswerEmojiAnimated?: boolean;
}

/**
 * The reaction count details object contains a breakdown of normal and super reaction counts for the associated emoji.
 */
export interface ReactionCountDetails {
    burst: number;
    normal: number;
}

/**
 * Represents a reaction to a message.
 */
export interface MessageReaction {
    count: number;
    countDetails: ReactionCountDetails;
    me: boolean;
    meBurst: boolean;
    emoji: {
        id?: BigInt;
        name: string;
        animated?: boolean;
    };
    burstColors: string[];
}

/**
 * Represents a reference to a message.
 */
export interface MessageReference {
    type?: number; // Message Reference Type
    messageId?: BigInt;
    channelId?: BigInt;
    guildId?: BigInt;
    failIfNotExists?: boolean;
}

/**
 * Determines how associated data is populated.
 */
export enum MessageReferenceType {
    DEFAULT = 0,
    FORWARD = 1,
}

/**
 * Represents message activity.
 */
export interface MessageActivity {
    type: number;
    partyId?: string;
}

/**
 * Message Activity Types
 */
export enum MessageActivityType {
    JOIN = 1,
    SPECTATE = 2,
    LISTEN = 3,
    JOIN_REQUEST = 5,
}

/**
 * Represents a partial application object.
 */
export interface MessageApplication {
    id: BigInt;
    coverImage?: string | null;
    description: string;
    icon?: string | null;
    name: string;
}

/**
 * Represents a mention of a channel.
 */
export interface ChannelMention {
    id: BigInt;
    guildId: BigInt;
    type: number;
    name: string;
}

/**
 * Determines whether users will receive notifications when you include mentions.
 */
export enum AllowedMentionType {
    ROLES = "roles",
    USERS = "users",
    EVERYONE = "everyone",
}

/**
 * Represents allowed mentions object.
 */
export interface AllowedMentions {
    parse?: AllowedMentionType[];
    roles?: BigInt[];
    users?: BigInt[];
    repliedUser?: boolean;
}

/**
 * Represents data of the role subscription purchase or renewal.
 */
export interface RoleSubscriptionData {
    roleSubscriptionListingId: BigInt;
    tierName: string;
    totalMonthsSubscribed: number;
    isRenewal: boolean;
}

/**
 * Information about the call in a private channel.
 */
export interface MessageCall {
    participants: BigInt[];
    endedTimestamp?: string | null;
}

/**
 * Metadata about the interaction.
 */
export interface MessageInteractionMetadata {
    id: BigInt;
    type: number; // InteractionType
    user: User; // User who triggered the interaction
    authorizingIntegrationOwners: Record<number, BigInt>; // dictionary with keys of application integration types
    originalResponseMessageId?: BigInt; // ID of the original response message
    targetUser?: User; // The user the command was run on
    targetMessageId?: BigInt; // The ID of the message the command was run on
    interactedMessageId?: BigInt; // ID of the message that contained the interactive component
    triggeringInteractionMetadata?: MessageInteractionMetadata; // Metadata for the interaction that was used to open the modal
}

/**
 * Minimal subset of fields in the forwarded message.
 */
export interface MessageSnapshot {
    message: Partial<Message>; // This will be a partial message object
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
     * Whether this was a TTS message.
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
     * @type {ChannelMention[] | undefined}
     */
    public mentionChannels?: ChannelMention[];

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
     * @type {MessageReaction[] | undefined}
     */
    public reactions?: MessageReaction[];

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
     * @type {MessageActivity | undefined}
     */
    public activity?: MessageActivity;

    /**
     * Application object.
     * @type {MessageApplication | undefined}
     */
    public application?: MessageApplication;

    /**
     * Application id if message is an Interaction or application-owned webhook.
     * @type {string | null}
     */
    public applicationId: string | null;

    /**
     * Data showing the source of a crosspost, channel follow add, pin, or reply message.
     * @type {MessageReference | undefined}
     */
    public messageReference?: MessageReference;

    /**
     * Message flags combined as a bitfield.
     * @type {number | undefined}
     */
    public flags?: number;

    /**
     * The message associated with the message_reference.
     * @type {Message | null}
     */
    public referencedMessage: Message | null;

    /**
     * The message associated with the message_reference (minimal subset of fields).
     * @type {MessageSnapshot[] | undefined}
     */
    public messageSnapshots?: MessageSnapshot[];

    /**
     * Sent if the message is a response to an Interaction.
     * @deprecated in favor of interactionMetadata
     * @type {any | null}
     */
    public interaction: any | null;

    /**
     * Metadata about the interaction, including the source of the interaction and relevant server and user IDs.
     * @type {MessageInteractionMetadata | undefined}
     */
    public interactionMetadata?: MessageInteractionMetadata;

    /**
     * The thread that was started from this message.
     * @type {PartialThread | null}
     */
    public thread: PartialThread | null;

    /**
     * Sent if the message contains components like buttons, action rows, or other interactive components.
     * @type {MessageComponent[] | undefined}
     */
    public components?: MessageComponent[];

    /**
     * Sent if the message contains stickers.
     * @type {MessageSticker[] | undefined}
     */
    public stickerItems?: MessageSticker[];

    /**
     * The stickers sent with the message.
     * @deprecated
     * @type {MessageSticker[] | undefined}
     */
    public stickers?: MessageSticker[];

    /**
     * A generally increasing integer with potentially gaps or duplicates that represents the approximate position of the message in a thread.
     * @type {number | undefined}
     */
    public position?: number;

    /**
     * Data of the role subscription purchase or renewal that prompted this message.
     * @type {RoleSubscriptionData | undefined}
     */
    public roleSubscriptionData?: RoleSubscriptionData;

    /**
     * Data for users, members, channels, and roles in the message's auto-populated select menus.
     * @type {ResolvedData | undefined}
     */
    public resolved?: ResolvedData;

    /**
     * Poll data, if the message is a poll.
     * @type {Poll | undefined}
     */
    public poll?: Poll;

    /**
     * The call associated with the message.
     * @type {MessageCall | undefined}
     */
    public call?: MessageCall;

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
        this.mentionChannels = (data.mention_channels ?? []).map((c: any) => ({
            id: BigInt(c.id),
            guildId: BigInt(c.guild_id),
            type: c.type,
            name: c.name,
        }));
        this.attachments = (data.attachments ?? []).map((att: any) => ({
            id: BigInt(att.id),
            filename: att.filename,
            title: att.title,
            description: att.description,
            contentType: att.content_type,
            size: att.size,
            url: att.url,
            proxyUrl: att.proxy_url,
            height: att.height,
            width: att.width,
            ephemeral: att.ephemeral,
            durationSecs: att.duration_secs,
            waveform: att.waveform,
            flags: att.flags,
        }));
        this.embeds = (data.embeds ?? []).map((embed: any) => ({
            title: embed.title,
            type: embed.type,
            description: embed.description,
            url: embed.url,
            timestamp: embed.timestamp,
            color: embed.color,
            footer: embed.footer ? { text: embed.footer.text, iconUrl: embed.footer.icon_url, proxyIconUrl: embed.footer.proxy_icon_url } : undefined,
            image: embed.image ? { url: embed.image.url, proxyUrl: embed.image.proxy_url, height: embed.image.height, width: embed.image.width } : undefined,
            thumbnail: embed.thumbnail ? { url: embed.thumbnail.url, proxyUrl: embed.thumbnail.proxy_url, height: embed.thumbnail.height, width: embed.thumbnail.width } : undefined,
            video: embed.video ? { url: embed.video.url, proxyUrl: embed.video.proxy_url, height: embed.video.height, width: embed.video.width } : undefined,
            provider: embed.provider ? { name: embed.provider.name, url: embed.provider.url } : undefined,
            author: embed.author ? { name: embed.author.name, url: embed.author.url, iconUrl: embed.author.icon_url, proxyIconUrl: embed.author.proxy_icon_url } : undefined,
            fields: embed.fields ? embed.fields.map((field: any) => ({ name: field.name, value: field.value, inline: field.inline })) : undefined,
            pollQuestionText: embed.poll_question_text,
            victorAnswerVotes: embed.victor_answer_votes,
            totalVotes: embed.total_votes,
            victorAnswerId: embed.victor_answer_id,
            victorAnswerText: embed.victor_answer_text,
            victorAnswerEmojiId: embed.victor_answer_emoji_id,
            victorAnswerEmojiName: embed.victor_answer_emoji_name,
            victorAnswerEmojiAnimated: embed.victor_answer_emoji_animated,
        }));
        this.reactions = (data.reactions ?? []).map((r: any) => ({
            count: r.count,
            countDetails: r.count_details ? { burst: r.count_details.burst, normal: r.count_details.normal } : { burst: 0, normal: r.count },
            me: r.me,
            meBurst: r.me_burst,
            emoji: { ...r.emoji, id: r.emoji.id ? BigInt(r.emoji.id) : undefined },
            burstColors: r.burst_colors ?? [],
        }));
        this.nonce = data.nonce ?? null;
        this.pinned = data.pinned ?? false;
        this.webhookId = data.webhook_id ?? null;
        this.activity = data.activity ? { type: data.activity.type, partyId: data.activity.party_id } : undefined;
        this.application = data.application ? { id: BigInt(data.application.id), coverImage: data.application.cover_image, description: data.application.description, icon: data.application.icon, name: data.application.name } : undefined;
        this.applicationId = data.application_id ?? null;
        this.messageReference = data.message_reference ? {
            type: data.message_reference.type,
            messageId: data.message_reference.message_id ? BigInt(data.message_reference.message_id) : undefined,
            channelId: data.message_reference.channel_id ? BigInt(data.message_reference.channel_id) : undefined,
            guildId: data.message_reference.guild_id ? BigInt(data.message_reference.guild_id) : undefined,
            failIfNotExists: data.message_reference.fail_if_not_exists
        } : undefined;
        this.flags = data.flags ?? undefined;
        this.referencedMessage = data.referenced_message ? new Message(client, data.referenced_message) : null;
        this.messageSnapshots = (data.message_snapshots ?? []).map((snapshot: any) => ({ message: new Message(client, snapshot.message) }));
        this.interaction = data.interaction ? { ...data.interaction, id: BigInt(data.interaction.id) } : null;
        this.interactionMetadata = data.interaction_metadata ? {
            id: BigInt(data.interaction_metadata.id),
            type: data.interaction_metadata.type,
            user: new User(client, data.interaction_metadata.user),
            authorizingIntegrationOwners: data.interaction_metadata.authorizing_integration_owners ? Object.fromEntries(Object.entries(data.interaction_metadata.authorizing_integration_owners).map(([key, value]) => [Number(key), BigInt(value as string)])) : {},
            originalResponseMessageId: data.interaction_metadata.original_response_message_id ? BigInt(data.interaction_metadata.original_response_message_id) : undefined,
            targetUser: data.interaction_metadata.target_user ? new User(client, data.interaction_metadata.target_user) : undefined,
            targetMessageId: data.interaction_metadata.target_message_id ? BigInt(data.interaction_metadata.target_message_id) : undefined,
            interactedMessageId: data.interaction_metadata.interacted_message_id ? BigInt(data.interaction_metadata.interacted_message_id) : undefined,
            triggeringInteractionMetadata: data.interaction_metadata.triggering_interaction_metadata ? (data.interaction_metadata.triggering_interaction_metadata.type === 2 /* Message Component */ ? { ...data.interaction_metadata.triggering_interaction_metadata, id: BigInt(data.interaction_metadata.triggering_interaction_metadata.id), user: new User(client, data.interaction_metadata.triggering_interaction_metadata.user), interactedMessageId: BigInt(data.interaction_metadata.triggering_interaction_metadata.interacted_message_id) } : { ...data.interaction_metadata.triggering_interaction_metadata, id: BigInt(data.interaction_metadata.triggering_interaction_metadata.id), user: new User(client, data.interaction_metadata.triggering_interaction_metadata.user) }) : undefined,
        } : undefined;
        this.thread = data.thread ? {
            id: BigInt(data.thread.id),
            guild_id: data.thread.guild_id ? BigInt(data.thread.guild_id) : undefined,
            parent_id: BigInt(data.thread.parent_id),
            owner_id: BigInt(data.thread.owner_id),
            name: data.thread.name,
            type: data.thread.type,
            last_message_id: data.thread.last_message_id ? BigInt(data.thread.last_message_id) : null,
            rate_limit_per_user: data.thread.rate_limit_per_user,
            thread_metadata: data.thread.thread_metadata ? {
                archived: data.thread.thread_metadata.archived,
                autoArchiveDuration: data.thread.thread_metadata.auto_archive_duration,
                archiveTimestamp: new Date(data.thread.thread_metadata.archive_timestamp),
                locked: data.thread.thread_metadata.locked,
                invitable: data.thread.thread_metadata.invitable,
                createTimestamp: data.thread.thread_metadata.create_timestamp ? new Date(data.thread.thread_metadata.create_timestamp) : undefined,
            } : undefined,
            member: data.thread.member ? {
                id: data.thread.member.id ? BigInt(data.thread.member.id) : undefined,
                userId: data.thread.member.user_id ? BigInt(data.thread.member.user_id) : undefined,
                joinTimestamp: new Date(data.thread.member.join_timestamp),
                flags: data.thread.member.flags,
                member: data.thread.member.member ? new Member(client, { ...data.thread.member.member, user: data.thread.member.user }, data.thread.guild_id.toString()) : undefined,
            } : undefined,
        } : null;
        this.components = (data.components ?? []).map((c: any) => this._parseMessageComponent(c));
        this.stickerItems = (data.sticker_items ?? []).map((s: any) => ({ ...s, id: BigInt(s.id) }));
        this.stickers = (data.stickers ?? []).map((s: any) => ({
            ...s,
            id: BigInt(s.id),
            packId: s.pack_id ? BigInt(s.pack_id) : undefined,
            guildId: s.guild_id ? BigInt(s.guild_id) : undefined,
        }));
        this.position = data.position ?? undefined;
        this.roleSubscriptionData = data.role_subscription_data ? {
            roleSubscriptionListingId: BigInt(data.role_subscription_data.role_subscription_listing_id),
            tierName: data.role_subscription_data.tier_name,
            totalMonthsSubscribed: data.role_subscription_data.total_months_subscribed,
            isRenewal: data.role_subscription_data.is_renewal,
        } : undefined;
        this.resolved = data.resolved ? {
            users: data.resolved.users ? Object.fromEntries(Object.entries(data.resolved.users).map(([id, user]) => [id, new User(client, (user as User).toJSON())])) : undefined,
            members: data.resolved.members ? Object.fromEntries(Object.entries(data.resolved.members).map(([id, member]) => [id, new Member(client, { ...(member as Member).toJSON(), user: (data.resolved.users[id] as User).toJSON() }, data.guild_id.toString())])) : undefined,
            roles: data.resolved.roles ? Object.fromEntries(Object.entries(data.resolved.roles).map(([id, role]) => [id, new Role(client, (role as Role).toJSON(), data.guild_id.toString())])) : undefined,
            channels: data.resolved.channels ? Object.fromEntries(Object.entries(data.resolved.channels).map(([id, channel]) => [id, new Channel(client, (channel as Channel).toJSON())])) : undefined,
            messages: data.resolved.messages ? Object.fromEntries(Object.entries(data.resolved.messages).map(([id, message]) => [id, new Message(client, (message as Message).toJSON())])) : undefined,
            // TODO: Attachments will be added later (if needed)
        } : undefined;
        this.call = data.call ? {
            participants: (data.call.participants ?? []).map(BigInt),
            endedTimestamp: data.call.ended_timestamp,
        } : undefined;
        
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
            this.poll = undefined;
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
     * Helper to recursively serialize our structured ComponentV2 types back to raw Discord format.
     * @param components The structured ComponentV2Union object or array.
     * @returns The raw Discord component object or array.
     */
    private _serializeComponentV2(components: ComponentV2Union | ComponentV2Union[]): any {
        if (Array.isArray(components)) {
            return components.map(comp => this._serializeComponentV2(comp));
        }

        const component = components as ComponentV2Union;
        let rawComponent: any; 

        switch (component.type) {
            case ComponentV2Type.CONTAINER:
                const containerComp = component as ContainerComponent;
                rawComponent = {
                    type: ComponentV2Type.CONTAINER,
                    unique_id: containerComp.unique_id,
                    accent_color: containerComp.accent_color,
                    spoiler: containerComp.spoiler,
                    components: containerComp.components ? this._serializeComponentV2(containerComp.components) : undefined,
                };
                break;
            case ComponentV2Type.SECTION:
                const sectionComp = component as SectionComponent;
                rawComponent = {
                    type: ComponentV2Type.SECTION,
                    components: sectionComp.components ? this._serializeComponentV2(sectionComp.components) : undefined,
                    accessory: sectionComp.accessory,
                };
                break;
            case ComponentV2Type.TEXT_DISPLAY:
                const textDisplayComp = component as TextDisplayComponent;
                rawComponent = {
                    type: ComponentV2Type.TEXT_DISPLAY,
                    content: textDisplayComp.content,
                };
                break;
            case ComponentV2Type.MEDIA_GALLERY:
                const mediaGalleryComp = component as MediaGalleryComponent;
                rawComponent = {
                    type: ComponentV2Type.MEDIA_GALLERY,
                    items: mediaGalleryComp.items,
                };
                break;
            case ComponentV2Type.SEPARATOR:
                rawComponent = { type: ComponentV2Type.SEPARATOR };
                break;
            case ComponentV2Type.ACTION_ROW:
                const actionRowComp = component as ActionRowComponent;
                rawComponent = {
                    type: ComponentV2Type.ACTION_ROW,
                    components: actionRowComp.components ? this._serializeComponentV2(actionRowComp.components) : undefined,
                };
                break;
            case ComponentV2Type.BUTTON:
                const buttonComp = component as ButtonComponent;
                rawComponent = {
                    type: ComponentV2Type.BUTTON,
                    style: buttonComp.style,
                    label: buttonComp.label,
                    emoji: buttonComp.emoji ? { id: buttonComp.emoji.id?.toString(), name: buttonComp.emoji.name, animated: buttonComp.emoji.animated } : undefined, 
                    custom_id: buttonComp.custom_id, 
                    url: buttonComp.url,
                    disabled: buttonComp.disabled,
                };
                break;
            case ComponentV2Type.STRING_SELECT:
                const stringSelectComp = component as StringSelectComponent;
                rawComponent = {
                    type: ComponentV2Type.STRING_SELECT,
                    custom_id: stringSelectComp.custom_id, 
                    options: stringSelectComp.options ? stringSelectComp.options.map(opt => ({
                        label: opt.label,
                        value: opt.value,
                        description: opt.description,
                        emoji: opt.emoji ? { id: opt.emoji.id?.toString(), name: opt.emoji.name, animated: opt.emoji.animated } : undefined,
                        default: opt.default,
                    })) : undefined,
                    placeholder: stringSelectComp.placeholder,
                    min_values: stringSelectComp.min_values, 
                    max_values: stringSelectComp.max_values, 
                    disabled: stringSelectComp.disabled,
                };
                break;
            default:
                console.warn(`Unknown Component V2 type for serialization: ${(component as any).type}`);
                rawComponent = {};
                break; 
        }
        return rawComponent;
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
            components: this.components?.map(comp => this._serializeMessageComponent(comp)),
            sticker_ids: this.stickerItems?.map(sticker => sticker.id.toString()),
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
            customId: component.customId,
            url: component.url,
            disabled: component.disabled,
            placeholder: component.placeholder,
            minValues: component.minValues,
            maxValues: component.maxValues,
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

    /**
     * Returns a serializable object representation of the message.
     * @returns {object}
     */
    public toJSON(): object {
        return {
            id: this.id.toString(),
            type: this.type,
            content: this.content,
            author: this.author.toJSON(),
            channel_id: this.channelId.toString(),
            guild_id: this.guildId?.toString() || null,
            timestamp: this.timestamp.toISOString(),
            edited_timestamp: this.editedTimestamp?.toISOString() || null,
            tts: this.tts,
            mention_everyone: this.mentionEveryone,
            mentions: this.mentions.map(user => user.toJSON()),
            mention_roles: this.mentionRoles,
            mention_channels: this.mentionChannels?.map(c => ({ id: c.id.toString(), guild_id: c.guildId.toString(), type: c.type, name: c.name })),
            attachments: this.attachments.map(att => ({
                id: att.id.toString(),
                filename: att.filename,
                title: att.title,
                description: att.description,
                content_type: att.contentType,
                size: att.size,
                url: att.url,
                proxy_url: att.proxyUrl,
                height: att.height,
                width: att.width,
                ephemeral: att.ephemeral,
                duration_secs: att.durationSecs,
                waveform: att.waveform,
                flags: att.flags,
            })),
            embeds: this.embeds.map(embed => {
                const jsonEmbed: any = {
                    title: embed.title,
                    type: embed.type,
                    description: embed.description,
                    url: embed.url,
                    timestamp: embed.timestamp,
                    color: embed.color,
                    footer: embed.footer,
                    image: embed.image,
                    thumbnail: embed.thumbnail,
                    video: embed.video,
                    provider: embed.provider,
                    author: embed.author,
                    fields: embed.fields,
                };
                // Poll specific fields
                if (embed.pollQuestionText) jsonEmbed.poll_question_text = embed.pollQuestionText;
                if (embed.victorAnswerVotes) jsonEmbed.victor_answer_votes = embed.victorAnswerVotes;
                if (embed.totalVotes) jsonEmbed.total_votes = embed.totalVotes;
                if (embed.victorAnswerId) jsonEmbed.victor_answer_id = embed.victorAnswerId;
                if (embed.victorAnswerText) jsonEmbed.victor_answer_text = embed.victorAnswerText;
                if (embed.victorAnswerEmojiId) jsonEmbed.victor_answer_emoji_id = embed.victorAnswerEmojiId;
                if (embed.victorAnswerEmojiName) jsonEmbed.victor_answer_emoji_name = embed.victorAnswerEmojiName;
                if (embed.victorAnswerEmojiAnimated) jsonEmbed.victor_answer_emoji_animated = embed.victorAnswerEmojiAnimated;

                return jsonEmbed;
            }),
            reactions: this.reactions?.map(r => ({
                count: r.count,
                count_details: r.countDetails,
                me: r.me,
                me_burst: r.meBurst,
                emoji: r.emoji ? { ...r.emoji, id: r.emoji.id?.toString() } : undefined,
                burst_colors: r.burstColors,
            })),
            nonce: this.nonce,
            pinned: this.pinned,
            webhook_id: this.webhookId,
            activity: this.activity,
            application: this.application ? { ...this.application, id: this.application.id.toString() } : undefined,
            application_id: this.applicationId,
            message_reference: this.messageReference ? {
                type: this.messageReference.type,
                message_id: this.messageReference.messageId?.toString(),
                channel_id: this.messageReference.channelId?.toString(),
                guild_id: this.messageReference.guildId?.toString(),
                fail_if_not_exists: this.messageReference.failIfNotExists,
            } : undefined,
            flags: this.flags,
            referenced_message: (this.referencedMessage && typeof this.referencedMessage.toJSON === 'function') ? this.referencedMessage.toJSON() : null,
            message_snapshots: this.messageSnapshots?.map(s => ({
                message: s.message?.toJSON ? s.message.toJSON() : undefined,
            })),
            interaction: this.interaction ? { ...this.interaction, id: this.interaction.id.toString() } : null,
            interaction_metadata: this.interactionMetadata ? {
                id: this.interactionMetadata.id.toString(),
                type: this.interactionMetadata.type,
                user: this.interactionMetadata.user.toJSON(),
                authorizing_integration_owners: Object.fromEntries(Object.entries(this.interactionMetadata.authorizingIntegrationOwners).map(([key, value]) => [Number(key), value.toString()])), // Convert BigInt to string
                original_response_message_id: this.interactionMetadata.originalResponseMessageId?.toString(),
                target_user: this.interactionMetadata.targetUser?.toJSON(),
                target_message_id: this.interactionMetadata.targetMessageId?.toString(),
                interacted_message_id: this.interactionMetadata.interactedMessageId?.toString(),
                triggering_interaction_metadata: this.interactionMetadata.triggeringInteractionMetadata ? {
                    ...this.interactionMetadata.triggeringInteractionMetadata,
                    id: this.interactionMetadata.triggeringInteractionMetadata.id.toString(),
                    user: this.interactionMetadata.triggeringInteractionMetadata.user.toJSON(),
                    interacted_message_id: this.interactionMetadata.triggeringInteractionMetadata.interactedMessageId?.toString(),
                } : undefined,
            } : undefined,
            thread: this.thread ? {
                id: this.thread.id.toString(),
                guild_id: this.thread.guild_id?.toString(),
                parent_id: this.thread.parent_id.toString(),
                owner_id: this.thread.owner_id.toString(),
                name: this.thread.name,
                type: this.thread.type,
                last_message_id: this.thread.last_message_id?.toString() || null,
                rate_limit_per_user: this.thread.rate_limit_per_user,
                thread_metadata: this.thread.thread_metadata ? {
                    archived: this.thread.thread_metadata.archived,
                    auto_archive_duration: this.thread.thread_metadata.autoArchiveDuration,
                    archiveTimestamp: this.thread.thread_metadata.archiveTimestamp?.toISOString(),
                    locked: this.thread.thread_metadata.locked,
                    invitable: this.thread.thread_metadata.invitable,
                    create_timestamp: this.thread.thread_metadata.createTimestamp?.toISOString(),
                } : undefined,
                member: this.thread.member ? {
                    id: this.thread.member.id?.toString(),
                    user_id: this.thread.member.userId?.toString(),
                    joinTimestamp: this.thread.member.joinTimestamp.toISOString(),
                    flags: this.thread.member.flags,
                    member: this.thread.member.member?.toJSON(),
                } : undefined,
            } : null,
            components: this.components?.map(comp => this._serializeMessageComponent(comp)),
            sticker_items: this.stickerItems?.map(sticker => sticker.id.toString()),
            stickers: this.stickers?.map(sticker => ({
                ...sticker,
                id: sticker.id.toString(),
                pack_id: sticker.packId?.toString(),
                guild_id: sticker.guildId?.toString(),
            })),
            position: this.position,
            role_subscription_data: this.roleSubscriptionData ? {
                role_subscription_listing_id: this.roleSubscriptionData.roleSubscriptionListingId.toString(),
                tier_name: this.roleSubscriptionData.tierName,
                total_months_subscribed: this.roleSubscriptionData.totalMonthsSubscribed,
                is_renewal: this.roleSubscriptionData.isRenewal,
            } : undefined,
            resolved: this.resolved ? {
                users: this.resolved.users ? Object.fromEntries(Object.entries(this.resolved.users).map(([id, user]) => [id, user.toJSON()])) : undefined,
                members: this.resolved.members ? Object.fromEntries(Object.entries(this.resolved.members).map(([id, member]) => [id, member.toJSON()])) : undefined,
                roles: this.resolved.roles ? Object.fromEntries(Object.entries(this.resolved.roles).map(([id, role]) => [id, role.toJSON()])) : undefined,
                channels: this.resolved.channels ? Object.fromEntries(Object.entries(this.resolved.channels).map(([id, channel]) => [id, channel.toJSON()])) : undefined,
                messages: this.resolved.messages ? Object.fromEntries(Object.entries(this.resolved.messages).map(([id, message]) => [id, message.toJSON()])) : undefined,
            } : undefined,
            call: this.call ? {
                participants: this.call.participants?.map(p => p.toString()),
                ended_timestamp: this.call.endedTimestamp,
            } : undefined,
            poll: this.poll ? {
                id: this.poll.id?.toString(), 
                question: this.poll.question,
                answers: this.poll.answers.map(ans => ({ answer_id: ans.answer_id, poll_media: ans.poll_media })),
                results: {
                    is_finalized: this.poll.results?.is_finalized,
                    answer_counts: this.poll.results?.answer_counts.map(count => ({
                        id: count.id,
                        count: count.count,
                        me_voted: count.me_voted,
                    })),
                },
                expiry: this.poll.expiry,
                allow_multiselect: this.poll.allow_multiselect,
                layout_type: this.poll.layout_type,
            } : undefined,
            components_v2: this.componentsV2?.map(comp => this._serializeComponentV2(comp)) || null,
        };
    }
}