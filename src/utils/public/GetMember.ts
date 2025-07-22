import { Client } from '../../client/Client';
import { User } from '../../structures/User';
import { Member } from '../../structures/Member';

/**
 * Fetches and returns a User object for a given user within a guild.
 * This utility provides the full User object with all its properties and methods.
 * @param client The client instance used to make API requests.
 * @param guildId The ID of the guild where the member resides.
 * @param userId The ID of the user whose data is to be fetched.
 * @returns A Promise that resolves to a User object if found, or null if the user could not be fetched.
 */
export async function GetMember(client: Client, guildId: string, userId: string): Promise<User | null> {
    try {
        const memberData = await client.rest.request(
            'GET',
            `/guilds/${guildId}/members/${userId}`
        );

        if (memberData && memberData.user) {
            return new User(client, memberData.user);
        }
    } catch (error) {
        console.error(`Failed to get member ${userId} in guild ${guildId}:`, error);
    }
    return null;
}

/**
 * Fetches and returns a Member object for a given user within a specific guild.
 * This utility provides the full Member object with all its properties and methods.
 * @param client The client instance used to make API requests.
 * @param guildId The ID of the guild where the member resides.
 * @param userId The ID of the user whose member data is to be fetched.
 * @returns A Promise that resolves to a Member object if found, or null if the member could not be fetched.
 */
export async function GetGuildMember(client: Client, guildId: string, userId: string): Promise<Member | null> {
    try {
        // Fetch the guild member data using the REST API
        const memberData = await client.rest.request(
            'GET',
            `/guilds/${guildId}/members/${userId}`
        );

        if (memberData) {
            return new Member(client, memberData, guildId);
        }
    } catch (error) {
        console.error(`Failed to get guild member ${userId} in guild ${guildId}:`, error);
    }
    return null;
}