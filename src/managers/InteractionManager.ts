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
            case InteractionType.MESSAGE_COMPONENT:
                /**
                 * Emitted when a message component interaction (e.g., button click, select menu use) is created.
                 * @event Client#messageComponentCreate
                 * @param {Interaction} interaction The created interaction.
                 */
                this.client.emit('messageComponentCreate', interaction);
                break;
            case InteractionType.MODAL_SUBMIT:
                /**
                 * Emitted when a modal submit interaction is created.
                 * @event Client#modalSubmitCreate
                 * @param {Interaction} interaction The created interaction.
                 */
                this.client.emit('modalSubmitCreate', interaction);
                break;
            default:
                console.warn(`Unhandled interaction type: ${interaction.type}`);
                break;
        }
    }
}