export interface PartialGuild {
    id: bigint;
    name: string;
    icon: string | null;
    splash: string | null;
    banner: string | null;
    approximateMemberCount?: number;
    approximatePresenceCount?: number;
    vanityUrlCode: string | null;
    description: string | null;
    features: string[];
    verificationLevel: number;
    nsfwLevel: number;
    premiumTier: number;
}