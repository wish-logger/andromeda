import { Client } from '../src/client/Client';
import * as path from 'path';
import * as fs from 'fs/promises';

const client = new Client({
    intents: [
        Client.MESSAGE_CONTENT,
        Client.GUILD_MEMBERS,
        Client.GUILD_MESSAGES,
    ]
});

const token = ""

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.username}`);

    client.setPresence({
        activities: [{
            name: 'Andromeda 1.0',
            type: 4,
        }],
        status: 'online',
        since: null,
        afk: false,
    });

    const commandsDir = path.join(__dirname, 'commands');

    try {
        const commandFiles = await fs.readdir(commandsDir);
        
        for (const file of commandFiles) {
            if (file.endsWith('.ts')) {
                const commandName = file.replace('.ts', '');
                const commandPath = path.join(commandsDir, file);
                try {
                    await client.modules.loadCommand(commandName, commandPath);
                } catch (error) {
                    console.error(`Failed to load command "${commandName}":`, error);
                }
            }
        }
    } catch (error) {
        console.error('Failed to read commands directory:', error);
    }

});

client.login(token);