const { Events, MessageFlags } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  execute(message) {
    if (message.content === '!ping') {
      message.channel.send('Pong!');
    }
  }
};