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
    emoji?: { id?: string; name?: string; animated?: boolean };
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
    id: string;
    question: PollMedia;
    answers: PollAnswer[];
    results: PollResults;
    expiry: string;
    allow_multiselect: boolean;
    layout_type: PollLayoutType;
}