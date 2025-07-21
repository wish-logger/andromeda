# Andromeda

Andromeda - fast, asynchronous, and type-safe Discord API wrapper built with TypeScript, designed for [Wish Logger](https://wishlogger.xyz/).

Andromeda is not built for any other Discord bots out there. Its purpose is to be a fast, type-safe, and memory-efficient wrapper. Since I just started developing it, it will take some time to add every feature that Wish needs to function.

## Simple index.ts

```typescript
import { Client } from './src/client/Client';

const client = new Client();

const token = ""

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.username}!`);

    client.setPresence({
        activities: [{
            name: 'Andromeda 1.0',
            type: 4,
        }],
        status: 'online',
        since: null,
        afk: false,
    });

    // Load your modules
    try {
        await client.modules.loadModule('Ping', './tests/commands/ping.ts');
    } catch (error) {
        console.error('Failed to load Ping', error);
    }
});

client.login(token);
```

## Simple ping.ts command

```typescript
import { Module } from '../../src/structures/Module';
import { Client } from '../../src/client/Client';

export default class Ping extends Module {
    constructor(client: Client) {
        super(client);

        this.addSlashCommand({
            name: 'ping',
            description: 'Pong?',
            execute: async (interaction) => {
                await interaction.reply({ content: 'Pong!', ephemeral: true });
            },
        });
    }
}
```