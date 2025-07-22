import { GatewayHeartbeat, GatewayOpcodes } from '../../types/Gateway';

/**
 * Prepares a heartbeat payload for dispatch to the Discord Gateway.
 *
 * @param d - The sequence number from the last dispatch event, or null if starting a new session.
 * @returns A JSON string representing the heartbeat payload.
 */
export function $heartbeat(d: number | null): Buffer | string {
    const payload: GatewayHeartbeat = {
      op: GatewayOpcodes.Heartbeat,
      d: d ? d : null,
    };
    return JSON.stringify(payload);
}