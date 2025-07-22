import { GatewayOpcodes, GatewayResume } from '../../types/Gateway';

/**
 * Creates a RESUME payload to reconnect and resume a disconnected Gateway session.
 *
 * @param token - The authentication token for the bot.
 * @param session_id - The session ID received during the READY event.
 * @param seq - The last sequence number received from the Gateway before disconnection.
 * @returns A JSON string representing the RESUME payload.
 */
export function $resume(
  token: string,
  session_id: string,
  seq: number,
): Buffer | string {
  const payload: GatewayResume = {
    op: GatewayOpcodes.Resume,
    d: {
      token,
      session_id,
      seq,
    },
  };
  return JSON.stringify(payload);
}