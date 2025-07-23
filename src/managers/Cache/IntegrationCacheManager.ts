import { Client } from '../../client/Client';
import { Integration } from '../../structures/Integration';

export class IntegrationCacheManager {
    private client: Client;
    private cache: Map<bigint, Integration>;

    constructor(client: Client) {
        this.client = client;
        this.cache = new Map<bigint, Integration>();
    }

    public set(integration: Integration): void {
        this.cache.set(integration.id, integration);
    }

    public get(integrationId: bigint): Integration | undefined {
        return this.cache.get(integrationId);
    }

    public delete(integrationId: bigint): boolean {
        return this.cache.delete(integrationId);
    }
} 