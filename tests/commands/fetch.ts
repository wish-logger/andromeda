import { SlashCommandBuilder, Interaction } from "../../src/Builders/structures/SlashCommandBuilder";
import { EmbedBuilder } from "../../src/Builders/structures/EmbedBuilder";
import { ChannelType } from "../../src/types/Channel"

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch')
        .setDescription('Fetch various Discord entities.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel')
                .setDescription('Fetch a channel')
                .addChannelOption(option =>
                    option.setName('channel')
                          .setDescription('The channel to fetch.')
                          .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('user')
                .setDescription('Fetch a user')
                .addUserOption(option =>
                    option.setName('user')
                          .setDescription('The user to fetch.')
                          .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('guild')
                .setDescription('Fetch the current guild.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('message')
                .setDescription('Fetch a message by ID from a channel.')
                .addChannelOption(option =>
                    option.setName('channel')
                          .setDescription('The ID of the channel where the message is located.')
                          .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('message')
                          .setDescription('The ID of the message to fetch.')
                          .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('role')
            .setDescription('Fetch a role')
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('A role to fetch')
                    .setRequired(true)
            )
        ),

    async execute(interaction: Interaction) {
        const subcommand = interaction.options.getSubcommand();
        const embed = new EmbedBuilder().setColor(0x0099FF);

        switch (subcommand) {
            case 'channel':
                const channelId = await interaction.options.getChannelId('channel');
                
                if (!channelId) {
                    await interaction.reply({ content: 'Please provide a valid channel.', ephemeral: true });
                    return;
                }

                try {
                    const channel = await interaction.client.fetchChannel(channelId);
                    if (channel) {
                        embed.setTitle(`Channel: ${channel.name || 'N/A'}`);
                        embed.setDescription(`ID: ${channel.id}\nType: ${ChannelType[channel.type]}\nGuild ID: ${channel.guildId || 'N/A'}`);
                    } else {
                        embed.setTitle('Channel Not Found');
                        embed.setDescription(`Could not find channel with ID: ${channelId}`);
                    }
                } catch (error) {
                    console.error('Error fetching channel:', error);
                    embed.setTitle('Error');
                    embed.setDescription('An error occurred while fetching the channel.');
                }
                break;
            case 'user':
                const userId = await interaction.options.getUserId('user');
                
                if (!userId) {
                    await interaction.reply({ content: 'Please provide a valid user.', ephemeral: true });
                    return;
                }

                try {
                    const user = await interaction.client.fetchUser(userId);
                    if (user) {
                        embed.setTitle(`User: ${user.username}`);
                        embed.setDescription(`ID: ${user.id}\nBot: ${user.bot ? 'Yes' : 'No'}`);
                        if (user.avatar) embed.setThumbnail(user.displayAvatarURL()); 
                    } else {
                        embed.setTitle('User Not Found');
                        embed.setDescription(`Could not find user with ID: ${userId}`);
                    }
                } catch (error) {
                    console.error('Error fetching user:', error);
                    embed.setTitle('Error');
                    embed.setDescription('An error occurred while fetching the user.');
                }
                break;
            case 'guild':
                if (!interaction.guildId) {
                    await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
                    return;
                }

                try {
                    const guild = await interaction.client.guilds.fetch(interaction.guildId);
                    if (guild) {
                        embed.setTitle(`Guild: ${guild.name}`);
                        embed.setDescription(`ID: ${guild.id}\nOwner ID: ${guild.ownerId}\nMembers: ${guild.memberCount || 'N/A'}`);
                        if (guild.icon) embed.setThumbnail(guild.iconURL() || ''); 
                    } else {
                        embed.setTitle('Guild Not Found');
                        embed.setDescription(`Could not find guild with ID: ${interaction.guildId}`);
                    }
                } catch (error) {
                    console.error('Error fetching guild:', error);
                    embed.setTitle('Error');
                    embed.setDescription('An error occurred while fetching the guild.');
                }
                break;
            case 'message':
                const msgChannelId = await interaction.options.getChannelId('channel'); 
                const messageId = interaction.options.getString('message');

                if (!msgChannelId || !messageId) {
                    await interaction.reply({ content: 'Please provide both a valid channel and message ID.', ephemeral: true });
                    return;
                }

                try {
                    const channel = await interaction.client.fetchChannel(msgChannelId);
                    if (!channel) {
                        embed.setTitle('Channel Not Found');
                        embed.setDescription(`Could not find channel with ID: ${msgChannelId}`);
                        break;
                    }
                    
                    const message = await channel.fetchMessage(BigInt(messageId));
                    if (message) {
                        embed.setTitle(`Message in #${channel.name || 'Unknown'}`);
                        embed.setDescription(`ID: ${message.id}\nAuthor: ${message.author.username}\nContent: ${message.content.substring(0, 100)}...\nURL: ${message.url}`);
                    } else {
                        embed.setTitle('Message Not Found');
                        embed.setDescription(`Could not find message with ID: ${messageId} in channel ${msgChannelId}`);
                    }
                } catch (error) {
                    console.error('Error fetching message:', error);
                    embed.setTitle('Error');
                    embed.setDescription('An error occurred while fetching the message.');
                }
                break;
            case 'role':
                if (!interaction.guildId) {
                    await interaction.reply({ content: 'This command can only be used in a guild.', ephemeral: true });
                    return;
                }
                const roleObject = await interaction.options.getRole('role');
                
                if (!roleObject?.id) {
                    await interaction.reply({ content: 'Please provide a valid role.', ephemeral: true });
                    return;
                }

                try {
                    const role = await interaction.client.fetchRole(interaction.guildId, roleObject.id);
                    if (role) {
                        embed.setTitle(`Role: ${role.name}`);
                        embed.setDescription(`ID: ${role.id}\nColor: ${role.getHexColor()}\nPosition: ${role.position}`);
                    } else {
                        embed.setTitle('Role Not Found');
                        embed.setDescription(`Could not find role with ID: ${roleObject.id}`);
                    }
                } catch (error) {
                    console.error('Error fetching role:', error);
                    embed.setTitle('Error');
                    embed.setDescription('An error occurred while fetching the role.');
                }
                break;
            default:
                embed.setTitle('Unknown Subcommand');
                embed.setDescription('Please use one of the available subcommands: channel, user, guild, message.');
                break;
        }

        await interaction.reply({ embeds: [embed] });
    }
};