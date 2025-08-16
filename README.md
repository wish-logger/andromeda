# Andromeda

Andromeda - fast, asynchronous, and type-safe Discord API wrapper built with TypeScript, designed for [Wish Logger](https://wishlogger.xyz/).

## Documentation

You can find the full documentation [here](https://wish-logger.github.io/andromeda/).

Andromeda is not built for any other Discord bots out there. Its purpose is to be a fast, type-safe, and memory-efficient wrapper. Since I just started developing it, it will take some time to add every feature that Wish needs to function.

## Simple index.ts

```typescript
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
```

## Simple ping.ts command

```typescript
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
```