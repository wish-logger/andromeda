/**
 * Represents Discord API permission flags as bitfields.
 * These flags can be combined using bitwise OR operations to specify multiple permissions.
 * Values are based on Discord API documentation (v10).
 */
export const PermissionFlagsBits = {
    CREATE_INSTANT_INVITE:           1n << 0n,   // 1
    KICK_MEMBERS:                    1n << 1n,   // 2
    BAN_MEMBERS:                     1n << 2n,   // 4
    ADMINISTRATOR:                   1n << 3n,   // 8
    MANAGE_CHANNELS:                 1n << 4n,   // 16
    MANAGE_GUILD:                    1n << 5n,   // 32
    ADD_REACTIONS:                   1n << 6n,   // 64
    VIEW_AUDIT_LOG:                  1n << 7n,   // 128
    PRIORITY_SPEAKER:                1n << 8n,   // 256
    STREAM:                          1n << 9n,   // 512
    VIEW_CHANNEL:                    1n << 10n,  // 1024
    SEND_MESSAGES:                   1n << 11n,  // 2048
    SEND_TTS_MESSAGES:               1n << 12n,  // 4096
    MANAGE_MESSAGES:                 1n << 13n,  // 8192
    EMBED_LINKS:                     1n << 14n,  // 16384
    ATTACH_FILES:                    1n << 15n,  // 32768
    READ_MESSAGE_HISTORY:            1n << 16n,  // 65536
    MENTION_EVERYONE:                1n << 17n,  // 131072
    USE_EXTERNAL_EMOJIS:             1n << 18n,  // 262144
    VIEW_GUILD_INSIGHTS:             1n << 19n,  // 524288
    CONNECT:                         1n << 20n,  // 1048576
    SPEAK:                           1n << 21n,  // 2097152
    MUTE_MEMBERS:                    1n << 22n,  // 4194304
    DEAFEN_MEMBERS:                  1n << 23n,  // 8388608
    MOVE_MEMBERS:                    1n << 24n,  // 16777216
    USE_VAD:                         1n << 25n,  // 33554432
    CHANGE_NICKNAME:                 1n << 26n,  // 67108864
    MANAGE_NICKNAMES:                1n << 27n,  // 134217728
    MANAGE_ROLES:                    1n << 28n,  // 268435456
    MANAGE_WEBHOOKS:                 1n << 29n,  // 536870912
    MANAGE_EMOJIS_AND_STICKERS:      1n << 30n,  // 1073741824
    USE_APPLICATION_COMMANDS:        1n << 31n,  // 2147483648
    REQUEST_TO_SPEAK:                1n << 32n,  // 4294967296
    MANAGE_EVENTS:                   1n << 33n,  // 8589934592
    MANAGE_THREADS:                  1n << 34n,  // 17179869184
    CREATE_PUBLIC_THREADS:           1n << 35n,  // 34359738368
    CREATE_PRIVATE_THREADS:          1n << 36n,  // 68719476736
    USE_EXTERNAL_STICKERS:           1n << 37n,  // 137438953472
    SEND_MESSAGES_IN_THREADS:        1n << 38n,  // 274877906944
    USE_SOUNDBOARD:                  1n << 39n,  // 549755813888
    USE_EXTERNAL_SOUNDS:             1n << 40n,  // 1099511627776
    SEND_VOICE_MESSAGES:             1n << 41n,  // 2199023255552
} as const;