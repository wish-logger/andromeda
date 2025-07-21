# Andromeda

Andromeda is a fast, asynchronous, and type-safe Discord API wrapper built with TypeScript, designed for Wish Logger.

## Features (1.0)

*   **Client:** A robust client for interacting with the Discord API.
*   **Gateway Management:** Efficient WebSocket connection handling with Discord's Gateway, including heartbeat and event dispatching.
*   **REST API:** Dedicated manager for making HTTP requests to the Discord API.
*   **Presence Management:** Easily set your bot's online status and activities, including custom statuses.
*   **Interaction Handling:** Comprehensive support for Discord Interactions, including:
    *   Slash Commands (`/`)
    *   Ephemeral replies (messages visible only to the invoker)
*   **Modular Structure (Modules):** Organize your bot's commands, event listeners, and other functionalities into reusable modules, inspired by `discord.py`'s cogs.
    *   `Module` base class for easy extension.
    *   `ModuleManager` for dynamic loading and unloading of modules.
*   **Type-Safe:** Built with TypeScript for a better development experience and fewer runtime errors.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/wishlogger/andromeda.git
    cd andromeda
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file:**
    In the root directory of your project, create a file named `.env` and add your Discord bot token:
    ```
    DISCORD_TOKEN=YOUR_BOT_TOKEN_HERE
    ```
    Replace `YOUR_BOT_TOKEN_HERE` with your actual bot token.

## Usage

Here's a basic example of how to use Andromeda to create a simple Discord bot that logs in, sets a custom status, and responds to a `/ping` slash command.

**`tests/index.ts` (Your main bot file):**

```typescript
import { Client } from './src/client/Client';
import { ActivityType } from './src/types/Presence';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new Client();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.username}!`);
    console.log('Setting presence...');

    client.setPresence({
        activities: [{
            name: 'Andromeda 1.0',
            type: ActivityType.CUSTOM,
            state: 'Developing a wrapper',
        }],
        status: 'online',
        since: null,
        afk: false,
    });

    console.log('Presence set!');

    // Load your modules
    try {
        await client.modules.loadModule('PingModule', './tests/commands/ping.ts');
    } catch (error) {
        console.error('Failed to load PingModule:', error);
    }
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
    throw new Error('DISCORD_TOKEN not found in .env file');
}

client.login(token);
```

**`tests/commands/ping.ts` (An example module with a slash command):**

```typescript
import { Module } from '../../src/structures/Module';
import { Client } from '../../src/client/Client';

export default class PingModule extends Module {
    constructor(client: Client) {
        super(client);

        this.addSlashCommand({
            name: 'ping',
            description: 'Replies with Pong!',
            execute: async (interaction) => {
                await interaction.reply({ content: 'Pong!', ephemeral: true });
            },
        });
    }
}
```

### Running Your Bot

To run your bot, use `ts-node`:

```bash
npx ts-node tests/index.ts
```

This will compile and run your TypeScript code.