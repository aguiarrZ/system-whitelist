const { red } = require('colors');
const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const statusBOT = [
            {
                name: '🔧 AGUIARZ',
                type: ActivityType.Listening,
                status: 'online'
            },
            {
                name: 'EM DESENVOLVIMENTO',
                type: ActivityType.Playing,
                status: 'online'
            }
        ]

        setInterval( () => {
            let random = Math.floor(Math.random() * statusBOT.length);
            client.user.setActivity(statusBOT[random]);
        }, 300);        

        console.log(`-------------------------------------------` .rainbow); 
        console.log(`✔ - [BOT] online!|${client.user.username}` .blue); 
        console.log(`-------------------------------------------` .rainbow); 
        console.log(`⚡Sistema criado por: aguiarZ `.yellow); 
        console.log(`⚡Discord: jdkaguiar `.blue); 
        console.log(`⚡GitHub: https://github.com/aguiarrZ`.green); 
    },
};