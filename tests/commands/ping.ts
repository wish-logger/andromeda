import { SlashCommandBuilder, Interaction } from '../../src/Builders/structures/SlashCommandBuilder';
import { ActionRowBuilder } from '../../src/Builders/structures/components/ActionRowBuilder';
import { ButtonBuilder, ButtonStyle } from '../../src/Builders/structures/ButtonBuilder';
import { InteractionType } from '../../src/types/Interaction';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong?')
        .setDMPermission(true),
    
    async execute(interaction: Interaction) {
        const pingButton = new ButtonBuilder()
            .setCustomId('ping_button')
            .setLabel('Pong!')
            .setStyle(ButtonStyle.PRIMARY);

        const actionRow = new ActionRowBuilder()
            .addComponents(pingButton);

        await interaction.reply({ 
            content: 'Pong!',
            ephemeral: true,
            components: [actionRow]
        });
    },

    async handleComponent(interaction: Interaction) {
        if (interaction.type === InteractionType.MESSAGE_COMPONENT && interaction.data && 'custom_id' in interaction.data && interaction.data.custom_id === 'ping_button') {

            const randomWords = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
            const randomWord = randomWords[Math.floor(Math.random() * randomWords.length)];

            const originalContent = interaction.message?.content || 'Pong!';

            const newContent = `${originalContent} ${randomWord}`;

            const pingButton = new ButtonBuilder()
                .setCustomId('ping_button')
                .setLabel('Pong!')
                .setStyle(ButtonStyle.PRIMARY);

            const actionRow = new ActionRowBuilder()
                .addComponents(pingButton);

            await interaction.update({
                content: newContent,
                components: [actionRow],
            });
        }
    }
};