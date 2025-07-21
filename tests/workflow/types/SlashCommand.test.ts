import { SlashCommandDefinition, RegisteredSlashCommand } from '../../../src/types/SlashCommand';
import { ApplicationCommandType } from '../../../src/types/ApplicationCommand';
import { Interaction } from '../../..//src/structures/Interaction';

const mockInteraction: Interaction = {
  id: 'mock_interaction_id',
  application_id: 'mock_app_id',
  type: 2,
  token: 'mock_token',
  version: 1,
  data: { name: 'mock_command' } as any,
  channel_id: 'mock_channel_id',
  guild_id: 'mock_guild_id',
  user: { id: 'mock_user_id', username: 'MockUser' } as any,
  member: { user: { id: 'mock_user_id', username: 'MockUser' }, roles: [], permissions: '0' } as any,
  app_permissions: '0',
  reply: jest.fn(),
  deferReply: jest.fn(),
  editReply: jest.fn(),
  followUp: jest.fn(),
  deleteReply: jest.fn(),
  getOption: jest.fn(),
} as unknown as Interaction;

describe('SlashCommand Types', () => {
  it('should allow creating an object conforming to SlashCommandDefinition', async () => {
    const commandDefinition: SlashCommandDefinition = {
      name: 'mycommand',
      description: 'My awesome command',
      type: ApplicationCommandType.CHAT_INPUT,
      execute: async (interaction) => {
        await interaction.reply({ content: 'Executed!' });
      },
    };

    expect(commandDefinition).toBeDefined();
    expect(commandDefinition.name).toBe('mycommand');
    expect(typeof commandDefinition.execute).toBe('function');

    await commandDefinition.execute(mockInteraction);
    expect(mockInteraction.reply).toHaveBeenCalledWith({ content: 'Executed!' });
  });

  it('should allow creating an object conforming to RegisteredSlashCommand', async () => {
    const registeredCommand: RegisteredSlashCommand = {
      id: 'registered_id',
      application_id: 'app_id_123',
      name: 'anothercommand',
      description: 'Another registered command',
      version: '1',
      type: ApplicationCommandType.CHAT_INPUT,
      execute: async (interaction) => {
        await interaction.reply({ content: 'Registered executed!' });
      },
    };

    expect(registeredCommand).toBeDefined();
    expect(registeredCommand.id).toBe('registered_id');
    expect(registeredCommand.name).toBe('anothercommand');
    expect(typeof registeredCommand.execute).toBe('function');

    await registeredCommand.execute(mockInteraction);
    expect(mockInteraction.reply).toHaveBeenCalledWith({ content: 'Registered executed!' });
  });
}); 