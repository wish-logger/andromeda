/**
 * Base URL for the Discord API.
 */
export const API_BASE_URL = 'https://discord.com/api/v10';

/**
 * Endpoint for fetching a guild member.
 * Parameters: guildId, userId
 */
export const GUILD_MEMBER = (guildId: string, userId: string) => `/guilds/${guildId}/members/${userId}`;

/**
 * Endpoint for fetching a user by ID.
 * Parameters: userId
 */
export const USER_ENDPOINT = (userId: string) => `/users/${userId}`;

/**
 * Endpoint for replying to an interaction.
 * Parameters: interactionId, interactionToken
 */
export const INTERACTION_CALLBACK = (interactionId: string, interactionToken: string) => `/interactions/${interactionId}/${interactionToken}/callback`;

/**
 * Endpoint for channel messages.
 * Parameters: channelId
 */
export const CHANNEL_MESSAGES = (channelId: string) => `/channels/${channelId}/messages`;

/**
 * Endpoint for global application commands.
 * Parameters: applicationId
 */
export const APPLICATION_COMMANDS = (applicationId: string) => `/applications/${applicationId}/commands`;

/**
 * Endpoint for guild-specific application commands.
 * Parameters: applicationId, guildId
 */
export const GUILD_APPLICATION_COMMANDS = (applicationId: string, guildId: string) => `/applications/${applicationId}/guilds/${guildId}/commands`;

/**
 * Endpoint for a specific global application command.
 * Parameters: applicationId, commandId
 */
export const APPLICATION_COMMAND = (applicationId: string, commandId: string) => `/applications/${applicationId}/commands/${commandId}`;

/**
 * Endpoint for a specific guild-specific application command.
 * Parameters: applicationId, guildId, commandId
 */
export const GUILD_APPLICATION_COMMAND = (applicationId: string, guildId: string, commandId: string) => `/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`;

/**
 * Endpoint for bulk deleting messages in a channel.
 * Parameters: channelId
 */
export const CHANNEL_BULK_DELETE = (channelId: string) => `/channels/${channelId}/messages/bulk-delete`;

/**
 * Endpoint for fetching the current user (bot itself).
 */
export const CURRENT_USER = () => `/users/@me`;

/**
 * Endpoint for fetching a channel by ID.
 * Parameters: channelId
 */
export const CHANNEL = (channelId: string) => `/channels/${channelId}`;

/**
 * Endpoint for fetching a webhook by ID.
 * Parameters: webhookId
 */
export const WEBHOOK = (webhookId: string) => `/webhooks/${webhookId}`;

/**
 * Endpoint for fetching a sticker by ID.
 * Parameters: stickerId
 */
export const STICKER = (stickerId: string) => `/stickers/${stickerId}`;

/**
 * Endpoint for fetching a guild scheduled event by ID.
 * Parameters: guildId, eventId
 */
export const GUILD_SCHEDULED_EVENT = (guildId: string, eventId: string) => `/guilds/${guildId}/scheduled-events/${eventId}`;

/**
 * Endpoint for fetching a specific message.
 * Parameters: channelId, messageId
 */
export const CHANNEL_MESSAGE = (channelId: string, messageId: string) => `/channels/${channelId}/messages/${messageId}`;

/**
 * Endpoint for fetching a role by ID from a specific guild.
 * Parameters: guildId, roleId
 */
export const GUILD_ROLE = (guildId: string, roleId: string) => `/guilds/${guildId}/roles/${roleId}`;

/**
 * Endpoint for fetching an invite by its code.
 * Parameters: inviteCode
 */
export const INVITE = (inviteCode: string) => `/invites/${inviteCode}`;

/**
 * Endpoint for creating a new lobby.
 */
export const CREATE_LOBBY = () => `/lobbies`;

/**
 * Endpoint for fetching a specific lobby by ID.
 * Parameters: lobbyId
 */
export const GET_LOBBY = (lobbyId: string) => `/lobbies/${lobbyId}`;

/**
 * Endpoint for modifying a specific lobby by ID.
 * Parameters: lobbyId
 */
export const MODIFY_LOBBY = (lobbyId: string) => `/lobbies/${lobbyId}`;

/**
 * Endpoint for deleting a specific lobby by ID.
 * Parameters: lobbyId
 */
export const DELETE_LOBBY = (lobbyId: string) => `/lobbies/${lobbyId}`;

/**
 * Endpoint for adding a member to a lobby.
 * Parameters: lobbyId, userId
 */
export const ADD_LOBBY_MEMBER = (lobbyId: string, userId: string) => `/lobbies/${lobbyId}/members/${userId}`;

/**
 * Endpoint for removing a member from a lobby.
 * Parameters: lobbyId, userId
 */
export const REMOVE_LOBBY_MEMBER = (lobbyId: string, userId: string) => `/lobbies/${lobbyId}/members/${userId}`;

/**
 * Endpoint for the current user to leave a lobby.
 * Parameters: lobbyId
 */
export const LEAVE_LOBBY = (lobbyId: string) => `/lobbies/${lobbyId}/members/@me`;

/**
 * Endpoint for linking a channel to a lobby.
 * Parameters: lobbyId
 */
export const LINK_CHANNEL_TO_LOBBY = (lobbyId: string) => `/lobbies/${lobbyId}/channel-linking`;

/**
 * Endpoint for unlinking a channel from a lobby.
 * Parameters: lobbyId
 */
export const UNLINK_CHANNEL_FROM_LOBBY = (lobbyId: string) => `/lobbies/${lobbyId}/channel-linking`;