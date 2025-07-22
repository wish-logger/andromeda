import { SlashCommandBuilder, Interaction } from '../../src/Builders/structures/SlashCommandBuilder';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong?')
        .setDMPermission(true),
    
    async execute(interaction: Interaction) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
    }
};