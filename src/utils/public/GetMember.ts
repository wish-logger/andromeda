import { Client } from '../../client/Client';
import { User } from '../../structures/User';
import { Member } from '../../structures/Member';
import { GUILD_MEMBER, USER_ENDPOINT } from '../../rest/Endpoints';

/**
 * Fetches and returns a User object for a given user.
 * This utility provides the full User object with all its properties and methods.
 * @param client The client instance used to make API requests.
 * @param userId The ID of the user whose data is to be fetched.
 * @returns A Promise that resolves to a User object if found, or null if the user could not be fetched.
 */
export async function GetUser(client: Client, userId: string): Promise<User | null> {
    try {
        const userData = await client.rest.request(
            'GET',
            USER_ENDPOINT(userId)
        );

        if (userData) {
            return new User(client, userData);
        }
    } catch (error) {
        console.error(`Failed to get user ${userId}:`, error);
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
export async function GetMember(client: Client, guildId: string, userId: string): Promise<Member | null> {
    try {

        const memberData = await client.rest.request(
            'GET',
            GUILD_MEMBER(guildId, userId)
        );

        if (memberData) {
            return new Member(client, memberData, guildId);
        }
    } catch (error) {
        console.error(`Failed to get guild member ${userId} in guild ${guildId}:`, error);
    }
    return null;
}