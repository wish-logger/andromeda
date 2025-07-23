/**
 * Enum for Discord Poll Layout Types.
 */
export enum PollLayoutType {
    DEFAULT = 1,
}

/**
 * Represents the media (text and/or emoji) for a poll question or answer.
 */
export interface PollMedia {
    text?: string;
    emoji?: { id?: bigint; name?: string; animated?: boolean };
}

/**
 * Represents an answer option in a Discord poll.
 */
export interface PollAnswer {
    answer_id: number;
    poll_media: PollMedia;
}

/**
 * Represents a count of votes for a specific answer in a poll.
 */
export interface PollAnswerCount {
    id: number;
    count: number;
    me_voted: boolean;
}

/**
 * Represents the results of a Discord poll.
 */
export interface PollResults {
    is_finalized: boolean;
    answer_counts: PollAnswerCount[];
}

/**
 * Represents a Discord Poll object.
 */
export interface Poll {
    id: bigint;
    question: PollMedia;
    answers: PollAnswer[];
    expiry?: Date;
    allow_multiselect: boolean;
    layout_type: PollLayoutType;
    results?: PollResults;
}

/**
 * This is the request object used when creating a poll across the different endpoints.
 */
export interface PollCreateRequest {
    question: PollMedia;
    answers: PollAnswer[];
    duration?: number; // Number of hours the poll should be open for, up to 32 days. Defaults to 24
    allow_multiselect?: boolean; // Whether a user can select multiple answers. Defaults to false
    layout_type?: PollLayoutType; // The layout type of the poll. Defaults to... DEFAULT!!!!!!!!!!!!!!!!!!!!
}