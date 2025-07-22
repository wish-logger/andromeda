import { GatewayIdentify, GatewayOpcodes } from '../../types/Gateway';
import { ActivityType, PresenceUpdateStatus } from '../../types/Presence';

/**
 * Constructs the IDENTIFY payload for initiating a new Gateway session.
 *
 * @param token - The bot's authentication token.
 * @param shard - An array containing the current cluster ID and the total number of clusters.
 * @param intents - The bitfield of Gateway Intents subscribed by the client.
 * @returns A JSON string representing the IDENTIFY payload.
 */
export function $identify(
  token: string,
  shard: [number, number],
  intents: number,
): Buffer | string {
  const payload: GatewayIdentify = {
    op: GatewayOpcodes.Identify,
    d: {
      token,
      properties: {
        os: process.platform,
        browser: 'Andromeda',
        device: 'Andromeda',
      },
      large_threshold: 250,
      shard,
      presence: {
        activities: [
          {
            name: `Starting cluster ${shard[0]}...`,
            type: ActivityType.PLAYING,
          },
        ],
        status: PresenceUpdateStatus.Idle,
        since: null,
        afk: true,
      },
      intents,
    },
  };
  return JSON.stringify(payload);
}