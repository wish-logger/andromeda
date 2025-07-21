import { ApplicationCommandType, ApplicationCommandOptionType, ApplicationCommandData, ApplicationCommand } from '../../../src/types/ApplicationCommand';

describe('ApplicationCommand Types', () => {
  it('should have correct enum values for ApplicationCommandType', () => {
    expect(ApplicationCommandType.CHAT_INPUT).toBe(1);
    expect(ApplicationCommandType.USER).toBe(2);
    expect(ApplicationCommandType.MESSAGE).toBe(3);
  });

  it('should have correct enum values for ApplicationCommandOptionType', () => {
    expect(ApplicationCommandOptionType.SUB_COMMAND).toBe(1);
    expect(ApplicationCommandOptionType.SUB_COMMAND_GROUP).toBe(2);
    expect(ApplicationCommandOptionType.STRING).toBe(3);
    expect(ApplicationCommandOptionType.INTEGER).toBe(4);
    expect(ApplicationCommandOptionType.BOOLEAN).toBe(5);
    expect(ApplicationCommandOptionType.USER).toBe(6);
    expect(ApplicationCommandOptionType.CHANNEL).toBe(7);
    expect(ApplicationCommandOptionType.ROLE).toBe(8);
    expect(ApplicationCommandOptionType.MENTIONABLE).toBe(9);
    expect(ApplicationCommandOptionType.NUMBER).toBe(10);
  });

  it('should allow creating an object conforming to ApplicationCommandData', () => {
    const commandData: ApplicationCommandData = {
      name: 'hello',
      description: 'Says hello!',
      type: ApplicationCommandType.CHAT_INPUT,
      options: [
        {
          type: ApplicationCommandOptionType.STRING,
          name: 'name',
          description: 'Your name',
          required: true,
        },
      ],
    };

    expect(commandData).toBeDefined();
    expect(commandData.name).toBe('hello');
    expect(commandData.options?.length).toBe(1);
  });

  it('should allow creating an object conforming to ApplicationCommand', () => {
    const command: ApplicationCommand = {
      id: '12345',
      application_id: 'app_id',
      name: 'info',
      description: 'Get info',
      version: '1',
      type: ApplicationCommandType.CHAT_INPUT,
    };

    expect(command).toBeDefined();
    expect(command.id).toBe('12345');
    expect(command.application_id).toBe('app_id');
  });
}); 