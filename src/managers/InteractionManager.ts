import { Client } from '../client/Client';
import { Interaction as InteractionPayload, InteractionType } from '../types/Interaction';
import { Interaction } from '../structures/Interaction';

/**
 * Manages incoming Discord interactions.
 */
export class InteractionManager {
    private client: Client;

    /**
     * Creates a new InteractionManager instance.
     * @param {Client} client The client instance.
     */
    constructor(client: Client) {
        this.client = client;

        // Listen for raw INTERACTION_CREATE events from the Gateway
        this.client.on('interactionCreate', (payload: InteractionPayload) => {
            this.handleInteractionCreate(payload);
        });
    }

    /**
     * Handles an incoming INTERACTION_CREATE payload.
     * @private
     * @param {InteractionPayload} payload The raw interaction payload.
     */
    private handleInteractionCreate(payload: InteractionPayload): void {
        const interaction = new Interaction(this.client, payload);

        switch (interaction.type) {
            case InteractionType.APPLICATION_COMMAND:
                /**
                 * Emitted when an application command interaction is created.
                 * @event Client#applicationCommandCreate
                 * @param {Interaction} interaction The created interaction.
                 */
                this.client.emit('applicationCommandCreate', interaction);
                break;
            // TODO: Handle other interaction types (MESSAGE_COMPONENT, MODAL_SUBMIT, etc.)
            default:
                console.log(`Unhandled interaction type: ${interaction.type}`);
                break;
        }
    }
}
