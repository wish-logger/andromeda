import { Client } from '../src/client/Client';

const client = new Client();

const token = "MTM5NjkwNzEwNzQ4NzMxODEzNg.GE5ict.mFIkNgHtZxQIFQZnyfiNeIGXwIzjtFAKeuL9wc"

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.username}!`);

    client.setPresence({
        activities: [{
            name: 'Andromeda 1.0',
            type: 4,
        }],
        status: 'online',
        afk: false,
    });

    console.log('Presence set!');

    // Load the ping command
    try {
        await client.modules.loadModule('Ping', './commands/ping.ts');
    } catch (error) {
        console.error('Failed to load Ping:', error);
    }

    // Examples of setting status:

    // Setting only status (without activity)
    
    // client.setPresence({
    //     status: 'idle', // 'online', 'dnd', 'idle', 'invisible'
    // });
    

    // Setting status with empty activity (also without displayed activity)
    
    // client.setPresence({
    //     activities: [],
    //     status: 'dnd',
    // });

    // Setting custom status (e.g. "making an game")

    /*
    client.setPresence({
        activities: [{
            name: 'Custom Status', // To pole jest wymagane, ale może być ogólne
            type: ActivityType.CUSTOM,               // Typ 4 oznacza "Custom Status"
            state: 'making an game', // Tekst niestandardowego statusu
        }],
        status: 'online',          // Możesz również ustawić status online/idle/dnd itp.
    });
    */

});

client.on('messageCreate', (message) => {
    // TODO: Add channel ID and embeds
    // for now just send new stuff in terminal
    console.log(`New message in #${message.channel_id}: ${message.content}`);
});

client.login(token);