import { Message } from '../../structures/Message';
import { Client } from '../../client/Client';

export class MessageCacheManager {
    private client: Client;
    private cache: Map<bigint, Message>;

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<bigint, Message>();
    }

    /**
     * Adds a message to the cache.
     * @param {Message} message The message to add.
     */
    public set(message: Message): void {
        this.cache.set(BigInt(message.id), message);
    }

    /**
     * Retrieves a message from the cache.
     * @param {bigint} messageId The ID of the message to retrieve.
     * @returns {Message | undefined} The cached message, or undefined if not found.
     */
    public get(messageId: bigint): Message | undefined {
        return this.cache.get(messageId);
    }

    /**
     * Deletes a message from the cache.
     * @param {bigint} messageId The ID of the message to delete.
     */
    public delete(messageId: bigint): void {
        this.cache.delete(messageId);
    }

    /**
     * Clears the entire message cache.
     */
    public clear(): void {
        this.cache.clear();
    }

    /**
     * Returns the number of messages in the cache.
     * @returns {number}
     */
    public get size(): number {
        return this.cache.size;
    }
} 