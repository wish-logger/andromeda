import { User } from "../structures/User";
import { PartialChannel } from '../structures/Guild';
import { PartialGuild } from './Guild';

export enum WebhookType {
    INCOMING = 1,
    CHANNEL_FOLLOWER = 2,
    APPLICATION = 3,
}

export interface WebhookData {
    id: bigint;
    type: WebhookType;
    guild_id?: bigint | null;
    channel_id: bigint | null;
    user?: User;
    name?: string | null;
    avatar?: string | null;
    token?: string;
    application_id?: bigint;
    source_guild?: PartialGuild;
    source_channel?: PartialChannel;
    url?: string;
}