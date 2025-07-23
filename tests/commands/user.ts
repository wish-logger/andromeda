import { SlashCommandBuilder, Interaction } from "../../src/Builders/structures/SlashCommandBuilder";
import { EmbedBuilder } from "../../src/Builders/structures/EmbedBuilder";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Check a profile of a user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user in mind')
                .setRequired(false)
        ),
    async execute(interaction: Interaction) {

        const user = await interaction.options.getUser('user')

        if (!user) {
            await interaction.reply({ content: 'Could not find user information.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle("User Information")
            .setColor(EmbedBuilder.Colors.DarkButNotBlack);

        embed.addFields(
            { name: `Username`, value: `${user.username}`, inline: true },
            { name: `Global Name`, value: `${user.globalName || 'N/A'}`, inline: true },
            { name: `ID`, value: `${user.id}`, inline: true },
            { name: `Bot`, value: `${user.bot ? 'Yes' : 'No'}`, inline: true },
            { name: `Account Created`, value: `${user.createdAt.toDateString()}`, inline: true }
        );

        if (user.avatarURL()) {
            embed.setThumbnail(user.displayAvatarURL());
        }

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}