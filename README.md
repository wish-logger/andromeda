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

**`tests/commands/ping.ts` (An example module with a slash command):**

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

### Running Your Bot

To run your bot, use `ts-node`:

```bash
npx ts-node tests/index.ts
```

This will compile and run your TypeScript code.