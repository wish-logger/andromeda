import { Client } from '../../../src/client/Client';
import { SoundboardSound } from '../../../src/structures/SoundboardSound';

describe('SoundboardSound', () => {
    let client: Client;
    let soundboardSoundData: any;

    beforeEach(() => {
        client = new Client({});
        soundboardSoundData = {
            name: 'test_sound',
            sound_id: '123456789012345678',
            volume: 0.8,
            emoji_id: '987654321098765432',
            emoji_name: '🔊',
            guild_id: '112233445566778899',
            available: true,
            user: {
                id: '223344556677889900',
                username: 'testuser',
                discriminator: '0000',
            },
        };
    });

    it('should correctly instantiate a SoundboardSound object', () => {
        const sound = new SoundboardSound(client, soundboardSoundData);

        expect(sound.name).toBe(soundboardSoundData.name);
        expect(sound.soundId).toBe(BigInt(soundboardSoundData.sound_id));
        expect(sound.volume).toBe(soundboardSoundData.volume);
        expect(sound.emojiId).toBe(BigInt(soundboardSoundData.emoji_id));
        expect(sound.emojiName).toBe(soundboardSoundData.emoji_name);
        expect(sound.guildId).toBe(BigInt(soundboardSoundData.guild_id));
        expect(sound.available).toBe(soundboardSoundData.available);
        expect(sound.user).toBeDefined();
        expect(sound.user?.id).toBe(BigInt(soundboardSoundData.user.id));
    });

    it('should return correct JSON representation', () => {
        const sound = new SoundboardSound(client, soundboardSoundData);
        const json = sound.toJSON();

        expect(json.name).toBe(soundboardSoundData.name);
        expect(json.sound_id).toBe(soundboardSoundData.sound_id);
        expect(json.volume).toBe(soundboardSoundData.volume);
        expect(json.emoji_id).toBe(soundboardSoundData.emoji_id);
        expect(json.emoji_name).toBe(soundboardSoundData.emoji_name);
        expect(json.guild_id).toBe(soundboardSoundData.guild_id);
        expect(json.available).toBe(soundboardSoundData.available);
        expect(json.user).toBeDefined();
        expect((json.user as any).id).toBe(soundboardSoundData.user.id);
    });

    it('should handle null/undefined properties correctly', () => {
        const minimalSoundData = {
            name: 'minimal_sound',
            sound_id: BigInt('111222333444555666'),
            volume: 1.0,
            available: false,
        };
        const sound = new SoundboardSound(client, minimalSoundData);

        expect(sound.name).toBe(minimalSoundData.name);
        expect(sound.soundId).toBe(BigInt(minimalSoundData.sound_id));
        expect(sound.volume).toBe(minimalSoundData.volume);
        expect(sound.emojiId).toBeNull();
        expect(sound.emojiName).toBeNull();
        expect(sound.guildId).toBeNull();
        expect(sound.available).toBe(minimalSoundData.available);
        expect(sound.user).toBeNull();

        const json = sound.toJSON();
        expect(json.emoji_id).toBeNull();
        expect(json.emoji_name).toBeNull();
        expect(json.guild_id).toBeNull();
        expect(json.user).toBeNull();
    });
});