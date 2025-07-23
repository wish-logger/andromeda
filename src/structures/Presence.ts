import { Client } from '../client/Client';
import { User } from './User';
import { PresenceData, ActivityObject, PresenceUpdateStatus } from '../types/Presence';

export class Presence {
    public user: User;
    public activities: ActivityObject[];
    public status: PresenceUpdateStatus;
    public since: number | null;
    public afk: boolean;

    private client: Client;

    constructor(client: Client, data: PresenceData) {
        this.client = client;
        this.user = new User(this.client, data.user);
        this.activities = data.activities || [];
        this.status = data.status as PresenceUpdateStatus;
        this.since = data.since;
        this.afk = data.afk;
    }

    public toJSON() {
        return {
            user: this.user.toJSON(),
            activities: this.activities.map(activity => ({
                name: activity.name,
                type: activity.type,
                url: activity.url,
                created_at: activity.created_at,
                timestamps: activity.timestamps,
                application_id: activity.application_id,
                details: activity.details,
                state: activity.state,
                emoji: activity.emoji,
                party: activity.party,
                assets: activity.assets,
                secrets: activity.secrets,
                instance: activity.instance,
                flags: activity.flags,
            })),
            status: this.status,
            since: this.since,
            afk: this.afk,
        };
    }
}