const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const connection = require("../MySQL/y_connectMySQL.js");

const J_CHANNEL_LOGGER = "1372798123025633381"; // Canal de logs de whitelits
const J_RULES_ID = "1372798898455707761"; // {#} Cargo que o jogador irá receber após realizar sua whitelist
const J_RULES_OLD_ID = "1372798951581028445"; // {#} Cargo que será removido do jogador após realizar sua whitelist
const INVALID_CHARS_REGEX = /[.,%#@!?=\-~^<>:;*%$[\]{}\\\/|()'`"&+ ]/;

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    try {
      if (interaction.isButton() && interaction.customId === "teste") {
        try {
          const modal = new ModalBuilder()
            .setCustomId("whitelist_modal")
            .setTitle("LIBERAÇÃO");

          const ignInput = new TextInputBuilder()
            .setCustomId("ign")
            .setLabel("NOME A LIBERAR:")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

          const row = new ActionRowBuilder().addComponents(ignInput);
          modal.addComponents(row);

          await interaction.showModal(modal);
        } catch (error) {
          console.error("✖ Error showing modal:" .red, error);
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              embeds: [
                new EmbedBuilder()
                .setDescription(`✖ Ocorreu um erro inesperado ao abrir um formulário. Por favor, tente novamente.`)
                .setColor('Red')
                ], ephemeral: true
            }).catch(console.error);
          }
        }
        return;
      }

      if (interaction.isModalSubmit() && interaction.customId === "whitelist_modal") {
        try {
          await interaction.deferReply({ ephemeral: true });
          
          const name = interaction.fields.getTextInputValue("ign");
          const discordId = interaction.user.id;

          if (INVALID_CHARS_REGEX.test(name)) {
            const errorEmbed = new EmbedBuilder()
              .setColor('Red')
              .setTitle(`Liberação • Erro na Whitelist`)
              .setDescription(`**-** O nome que você está tentando liberar contem características inválidas ou inesperadas, sigla o exemplo abaixo.
### Características Permitidas:
**-** Letras: (A-Z, a-z)
**-** Números: (0-9)`);

            return await interaction.editReply({ 
              embeds: [errorEmbed] 
            }).catch(console.error);
          }

          const query = (sql, params) => new Promise((resolve, reject) => {
            connection.query(sql, params, (err, results) => {
              if (err) reject(err);
              else resolve(results);
            });
          });

          try {
            const [tableInfo] = await query(`
              SELECT COLUMN_NAME 
              FROM INFORMATION_SCHEMA.COLUMNS 
              WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'whitelist' 
              AND COLUMN_NAME = 'whitelist_id'
            `);

            if (!tableInfo || tableInfo.length === 0) {
              await query(`ALTER TABLE whitelist ADD COLUMN whitelist_id INT`);
              await query(`UPDATE whitelist SET whitelist_id = id`);
              await query(`ALTER TABLE whitelist MODIFY whitelist_id INT NOT NULL`);
              await query(`ALTER TABLE whitelist ADD UNIQUE (whitelist_id)`);
            }

            const [existingEntries, currentWhitelist] = await Promise.all([
              query(`SELECT * FROM whitelist WHERE username = ? AND status = 1`, [name]),
              query(`SELECT * FROM whitelist WHERE discord_id = ?`, [discordId])
            ]);
          
            if (existingEntries.length > 0 && existingEntries[0].discord_id !== discordId) {
              const conflictEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle(`Liberação • Conflito`)
                .setDescription(`<:Icon_Required:1370571272010072130> ${interaction.user} o nome digitado já está liberado em nosso servidor!`)

              return await interaction.editReply({
                embeds: [conflictEmbed]
              }).catch(console.error);
            }

            const alreadyWhitelisted = currentWhitelist.length > 0 && currentWhitelist[0].status === 1;
            const finalName = alreadyWhitelisted ? currentWhitelist[0].username : name;

            let whitelistId;
            if (alreadyWhitelisted) {
              whitelistId = currentWhitelist[0].whitelist_id;
            } else {
              const [maxIdResult] = await query(`SELECT MAX(whitelist_id) as max_id FROM whitelist`);
              whitelistId = (maxIdResult.max_id || 0) + 1;
            }

            await query(
              `INSERT INTO whitelist (discord_id, username, status, whitelisted_at, whitelist_id) 
               VALUES (?, ?, 1, NOW(), ?)
               ON DUPLICATE KEY UPDATE 
                 username = VALUES(username), 
                 status = VALUES(status), 
                 whitelisted_at = VALUES(whitelisted_at),
                 whitelist_id = VALUES(whitelist_id)`,
              [discordId, finalName, whitelistId]
            );

            const [wlEntry] = await query(`
              SELECT whitelist_id 
              FROM whitelist 
              WHERE discord_id = ?`, 
              [discordId]
            );

            if (!wlEntry) throw new Error("Failed to retrieve whitelist ID");
            
            const nickname = `${finalName} #${wlEntry.whitelist_id}`;

            const username = `${finalName}`;
            const userid = `${wlEntry.whitelist_id}`;

            try {
              await interaction.member.setNickname(nickname);
            } catch (err) {
              console.warn(`Failed to update nickname:` .red, err.message);
            }

            try {
              await interaction.member.roles.remove(J_RULES_OLD_ID);
              await interaction.member.roles.add(J_RULES_ID);
            } catch (err) {
              console.warn(`Failed to update roles:` .red, err.message);
            }

            const successEmbed = new EmbedBuilder()
              .setTitle(`Liberação - Liberação`)
              .setDescription(
                alreadyWhitelisted
                  ? [
                      `**-** Olá, **${interaction.user}**! Você já possui uma **whitelist** em nosso servidor, infos:`,
                      "",
                      `> **Nickname Account:** \`${username}\``,
                      `> **ID Account:** \`${userid}\``,
                      "",
                      "\`* Seus dados forma sicronizados novamente!\`"
                    ].join("\n")
                  : [
                      `**-** Olá, **${interaction.user}**! Sua **whitelist** foi aprovada em nosso servidor, infos:`,
                      "",
                      `> **Nickname Account:** \`${username}\``,
                      `> **ID Account:** \`${userid}\``,
                    ].join("\n")
              )
              .setFooter({ text: "By aguiarZ ❣️" });

            await interaction.editReply({ embeds: [successEmbed] }).catch(console.error);

            if (!alreadyWhitelisted) {
              try {
                const logChannel = await interaction.client.channels.fetch(J_CHANNEL_LOGGER).catch(console.error);
                if (logChannel?.isTextBased()) {
                  const logEmbed = new EmbedBuilder()
                    .setTitle("Liberação - Loggs Liberação")
                    .setThumbnail(interaction.user.displayAvatarURL())
                    .setDescription([
                      `> **Usuário:** ${interaction.user.username} (\`${interaction.user.id}\`)`,
                      `> **Nickname:** \`${username}\``,
                      `> **ID:** \`${wlEntry.whitelist_id}\``,
                      `> **Data:** <t:${Math.floor(Date.now() / 1000)}:F>`
                    ].join("\n"))
                    .setFooter({ text: `By aguiarZ ❣️` });

                  await logChannel.send({ embeds: [logEmbed] }).catch(console.error);
                }
              } catch (err) {
                console.error("✖ Failed to send log:" .red, err);
              }
            }
          } catch (error) {
            console.error("Database error:" .red, error);
            const dbErrorEmbed = new EmbedBuilder()
              .setColor("#FF0000")
              .setDescription(`✖ Ocorreu um erro inesperado ao abrir um formulário. Por favor, tente novamente.`)

            await interaction.editReply({ 
              embeds: [dbErrorEmbed],
              ephemeral: true
            }).catch(console.error);
          }
        } catch (error) {
          console.error("Modal processing error:" .red, error);
          const errorEmbed = new EmbedBuilder()
            .setColor("#FF0000")
            .setDescription(`✖ Ocorreu um erro inesperado ao abrir um formulário. Por favor, tente novamente.`)

          if (interaction.deferred || interaction.replied) {
            await interaction.editReply({ 
              embeds: [errorEmbed],
              ephemeral: true 
            }).catch(console.error);
          } else {
            await interaction.reply({ 
              embeds: [errorEmbed],
              ephemeral: true 
            }).catch(console.error);
          }
        }
        return;
      }
    } catch (error) {
      console.error("Global interaction error:" .red, error);
      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        const globalErrorEmbed = new EmbedBuilder()
          .setColor("#FF0000")
          .setDescription(`✖ Ocorreu um erro inesperado ao abrir um formulário. Por favor, tente novamente.`)

        await interaction.reply({ 
          embeds: [globalErrorEmbed],
          ephemeral: true 
        }).catch(console.error);
      }
    }
  }
};