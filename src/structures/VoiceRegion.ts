import { Client } from '../client/Client';
import { VoiceRegionData } from '../types/Voice';

export class VoiceRegion {
    public id: string;
    public name: string;
    public optimal: boolean;
    public deprecated: boolean;
    public custom: boolean;

    private client: Client;

    constructor(client: Client, data: VoiceRegionData) {
        this.client = client;
        this.id = data.id;
        this.name = data.name;
        this.optimal = data.optimal;
        this.deprecated = data.deprecated;
        this.custom = data.custom;
    }

    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            optimal: this.optimal,
            deprecated: this.deprecated,
            custom: this.custom,
        };
    }
}