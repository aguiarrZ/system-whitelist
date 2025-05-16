const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`✖ Nenhum comando encontrado correspondente a: ${interaction.commandName}!` .red);
                    return;
                }

                await command.execute(interaction);
            }

            else if (interaction.isButton()) {
                const command = interaction.client.commands.find(cmd => typeof cmd.handleButton === 'function');

                if (command) {
                    await command.handleButton(interaction);
                } else {
                    console.error('✖ Nenhum comando com handler de botão encontrado!'.red);
                }
            }

            else if (interaction.isModalSubmit()) {
                const command = interaction.client.commands.find(cmd => typeof cmd.handleModalSubmit === 'function');

                if (command) {
                    await command.handleModalSubmit(interaction);
                } else {
                    console.error('✖ Nenhum comando com handler de modal encontrado!'.red);
                }
            }

        } catch (error) {
            console.error(error);

            const errorMessage = {
                content: '✖ Ocorreu um erro ao executar esta interação!'.red,
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};