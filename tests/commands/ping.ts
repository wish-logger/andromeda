import { Module } from '../../src/structures/Module';
import { Client } from '../../src/client/Client';

export default class Ping extends Module {
    constructor(client: Client) {
        super(client);

        this.addSlashCommand({
            name: 'ping',
            description: 'Pong?',
            execute: async (interaction) => {
                await interaction.reply({ content: 'Pong!', ephemeral: true });
            },
        });
    }
}