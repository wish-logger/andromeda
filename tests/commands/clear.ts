import { SlashCommandBuilder, Interaction } from "../../src/Builders/structures/SlashCommandBuilder";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear some messages on your server')
        .setDefaultMemberPermissions(SlashCommandBuilder.Permissions.MANAGE_MESSAGES)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages you want to clear')
                .setRequired(true)
                .setMinValue(1)
        )
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Clear messages from a specific user')
                .setRequired(false)
        ),
    async execute(interaction: Interaction) {

        // getData is a Global auto-convering function.
        const amount = interaction.options.getData('amount');

        // If you want, you can use getInteger just like in d.js
        // const amount = interaction.options.getInteger('amount');

        if (amount) {
            if (interaction.channel) {

                const messages = await interaction.channel.fetchMessages(amount); // for now fetch messages, later I'll add a caching system
                const messageIds = messages.map(msg => msg.id);

                if (messageIds.length > 0) {
                    await interaction.channel.bulkDelete(messageIds);
                    await interaction.reply({ content: `You've cleared ${messageIds.length} message(s).`, ephemeral: true });
                } else {
                    await interaction.reply({ content: 'No messages found to clear.', ephemeral: true });
                }
            } else {
                await interaction.reply({ content: 'Could not find the channel for bulk deletion.', ephemeral: true });
            }
        } else {
            await interaction.reply({ content: 'Please specify the amount of messages to clear.', ephemeral: true });
        }
    }
};