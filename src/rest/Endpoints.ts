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