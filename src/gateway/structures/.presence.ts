import { GatewayOpcodes, GatewayUpdatePresence, UnixTimestamp } from '../../types/Gateway';
import { ActivityObject, ActivityType, PresenceUpdateStatus } from '../../types/Presence';

/**
 * Generates a PRESENCE_UPDATE payload to inform the Gateway about the client's presence.
 *
 * @param name - The name of the activity (e.g., game name, custom status text).
 * @param type - The type of activity (e.g., PLAYING, STREAMING, CUSTOM).
 * @param status - The client's online status (e.g., Online, Idle, Dnd).
 * @param afk - Whether the client is marked as AFK.
 * @param since - Unix timestamp (milliseconds) of when the client went idle, or null.
 * @returns A JSON string representing the PRESENCE_UPDATE payload.
 */
export function $updatePresence(
  name: string,
  type: ActivityType = ActivityType.PLAYING,
  status: PresenceUpdateStatus = PresenceUpdateStatus.Online,
  afk = false,
  since: UnixTimestamp | null = null,
): Buffer | string {
  const activities: ActivityObject[] = [];

  if (name) {
    activities.push({
      name,
      type,
      state: type === ActivityType.CUSTOM ? name : undefined,
    });
  }

  const payload: GatewayUpdatePresence = {
    op: GatewayOpcodes.PresenceUpdate,
    d: {
      since,
      activities,
      status,
      afk,
    },
  };

  return JSON.stringify(payload);
}