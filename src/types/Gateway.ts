/**
 * Discord Gateway Opcodes.
 * @docs https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes
 */
export enum GatewayOpcodes {
    Dispatch = 0,
    Heartbeat = 1,
    Identify = 2,
    PresenceUpdate = 3,
    VoiceStateUpdate = 4,
    Resume = 6,
    Reconnect = 7,
    RequestGuildMembers = 8,
    InvalidSession = 9,
    Hello = 10,
    HeartbeatACK = 11,
}

/**
 * Represents a heartbeat payload for the Gateway.
 */
export interface GatewayHeartbeat {
    op: GatewayOpcodes.Heartbeat;
    d: number | null;
}

/**
 * Represents an identify payload for the Gateway.
 */
export interface GatewayIdentify {
    op: GatewayOpcodes.Identify;
    d: {
        token: string;
        properties: {
            os: string;
            browser: string;
            device: string;
        };
        compress?: boolean;
        large_threshold?: number;
        shard?: [number, number];
        presence?: {
            activities?: {
                name: string;
                type: number;
                url?: string | null;
                created_at?: number;
                timestamps?: { start?: number; end?: number };
                application_id?: string;
                details?: string | null;
                state?: string | null;
                emoji?: { name: string; id?: string; animated?: boolean } | null;
                party?: { id?: string; size?: [number, number] };
                assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string };
                secrets?: { join?: string; match?: string; spectate?: string };
                instance?: boolean;
                flags?: number;
            }[];
            status?: string;
            afk?: boolean;
            since?: number | null;
        };
        intents: number;
    };
}

/**
 * Represents a presence update payload for the Gateway.
 */
export interface GatewayUpdatePresence {
    op: GatewayOpcodes.PresenceUpdate;
    d: {
        since: number | null;
        activities: {
            name: string;
            type: number;
            url?: string | null;
            created_at?: number;
            timestamps?: { start?: number; end?: number };
            application_id?: string;
            details?: string | null;
            state?: string | null;
            emoji?: { name: string; id?: string; animated?: boolean } | null;
            party?: { id?: string; size?: [number, number] };
            assets?: { large_image?: string; large_text?: string; small_image?: string; small_text?: string };
            secrets?: { join?: string; match?: string; spectate?: string };
            instance?: boolean;
            flags?: number;
        }[];
        status: string;
        afk: boolean;
    };
}

/**
 * Represents a resume payload for the Gateway.
 */
export interface GatewayResume {
    op: GatewayOpcodes.Resume;
    d: {
        token: string;
        session_id: string;
        seq: number;
    };
}

/**
 * Type alias for Unix timestamp (milliseconds).
 */
export type UnixTimestamp = number; 