import { Message } from '../../../src/structures/Message';

describe('Message', () => {
  it('should construct from payload', () => {
    const mockClient: any = {};
    const payload = {
      id: '1234567890',
      channel_id: '0987654321',
      guild_id: '1122334455',
      author: {
        id: 'botuser',
        username: 'TestBot',
        discriminator: '1234',
        avatar: null,
        bot: true,
      },
      content: 'Hello, Discord!',
      timestamp: new Date().toISOString(),
      edited_timestamp: null,
      tts: false,
      mention_everyone: false,
      mentions: [],
      mention_roles: [],
      attachments: [],
      embeds: [],
      reactions: [],
      nonce: null,
      pinned: false,
      webhook_id: null,
      type: 0,
      flags: 0,
      referenced_message: null,
      interaction_metadata: null,
      components: [],
      sticker_items: [],
      thread: null,
    };
    const msg = new Message(mockClient, payload);

    expect(msg).toBeDefined();
    expect(msg.id).toBe(payload.id);
    expect(msg.content).toBe(payload.content);
    expect(msg.author.username).toBe(payload.author.username);
    expect(msg.channelId).toBe(payload.channel_id);
  });
}); 