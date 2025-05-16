const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { IDClient, IDGuild, APPToken } = require('./config.json');

const commands = [];

const readCommandsFromDir = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            readCommandsFromDir(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(path.resolve(filePath));
            commands.push(command.data.toJSON());
        }
    }
};

readCommandsFromDir(path.join(__dirname, 'source', 'commands'));

const rest = new REST({ version: '10' }).setToken(APPToken);

(async () => {
    try {
        console.log('[WARNING]: Registrando novos comandos...');

        await rest.put(
            Routes.applicationGuildCommands(IDClient, IDGuild),
            { body: commands }
        );

        console.log('[SUCESS]: Comando novos registrado!');
    } catch (error) {
        console.error('[ERROR]: Error em registrar o comando:', error);
    }
})();