import { Client } from '../src/client/Client';

const client = new Client();

const token = ""

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
    console.log('Setting presence...');

    client.setPresence({
        activities: [{
            name: 'Andromeda 1.0',
            type: 4,
        }],
        status: 'online',
        since: null,
        afk: false,
    });

    console.log('Presence set!');

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

    // client.setPresence({
    //     activities: [{
    //         name: 'making an game', // Custom status text
    //         type: 4,               // Type 4 means "Custom Status"
    //     }],
    //     status: 'online',          // You can also set status online/idle/dnd etc.
    // });

});

client.on('messageCreate', (message) => {
    console.log(`New message in #${message.channel_id}: ${message.content}`);
});

if (!token) {
    throw new Error('DISCORD_TOKEN not found in .env file');
}

client.login(token);