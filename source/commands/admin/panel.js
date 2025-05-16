const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const agora = new Date();
const dataFormatada = agora.toLocaleString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Configuração do painel beta'),

  async execute(interaction) {
    try {
      const ruleAdmin = interaction.guild.roles.cache.get('1372773708510265444');

      if (!interaction.member.roles.cache.has(ruleAdmin?.id)) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('**Acesso Negado**')
              .setDescription(`Você não tem permissão para usar este comando sem o cargo ${ruleAdmin?.name || 'desconhecido'}!`)
          ],
          ephemeral: true
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('LIBERAÇÃO')
        .setDescription(`> 👋 Olá **usuário(a)** !
            **-** Clique no botão para iniciar sua **whitelist**, após sua aprovação você estará liberado para jogar em nosso servidor.
          
          > **Observações:**
          • Lembre-se: seu **nickname** **não pode** conter **caracteres especiais**, **letras modificadas**, **acentos** ou **espaços**.`)
        .setFooter({ text: `By aguiarZ ❣️` });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('teste')
          .setLabel('Liberar ID')
          .setEmoji('🆔')
          .setStyle('2')
          .setDisabled(false)
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });

    } catch (error) {
      console.error('✖ Erro ao executar o comando /panel:' .red, error);

      try {
        await interaction.reply({
          content: '✖ Ocorreu um erro ao tentar configurar o painel.' .red,
          ephemeral: true
        });
      } catch (replyError) {
        console.error('✖ Erro ao enviar resposta de erro:' .red, replyError);
      }
    }
  },
};