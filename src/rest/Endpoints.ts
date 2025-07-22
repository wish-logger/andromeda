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
