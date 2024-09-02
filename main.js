const Discord = require("discord.js");
const client = new Discord.Client({
  ws: {
    intent: ['GUILDS', 'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_BANS']
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER']
});
const authorizedUserIds = config.authorizedUserIds;
const fs = require('fs');
const config = require("./config.json");

client.on('ready', () => {

  const statuses = [

    () => `Statut 1`,

    () => `Statut 2`,

    () => `Statut 3`

  ];

  let i = 0;

  setInterval(() => {

    client.user.setActivity(statuses[i](), {type: 'STREAMING', url: "https://www.twitch.tv/nauxyy77"});

    i = ++i % statuses.length;

  }, 20000); //temps en ms (20000 = 20sec) changement de statut

});

client.on('ready', () => {

    const channelId = config.LogsBotOn;
    const targetChannel = client.channels.cache.get(channelId);

    if (targetChannel && targetChannel.type === 'text') {
      const embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Information du BOT')
        .setDescription("Bot redémarré !")
        .setFooter('By Nauxyy')
        .setTimestamp();

      targetChannel.send(embed);
    } else {
      console.log('Channel not found or not a text channel.');
    }
  });

  client.on('message', (message) => {
    if (message.author.bot || message.channel.type === 'dm') {
      return;
    }

    // Vérif id

    if(authorizedUserIds.includes(message.author.id)) {

    if (message.content.toLowerCase() === '!ping') {
      console.log('Commande !ping détectée.');
      message.reply('Pong !');
    }

    if (message.content.toLowerCase().startsWith('!say ')) {
        const content = message.content.slice('!say '.length);
        message.channel.send(content);
        message.delete();
      }

    }
  });


  // Liste des fichiers que tu veux charger
  const filesToLoad = ['permid.js', 'permidh24.js', 'social.js', 'unban.js', 'user.js'];
  
  filesToLoad.forEach((file) => {
      fs.readFile(file, 'utf8', (err, data) => {
          if (err) {
              console.error(`Erreur lors de la lecture de ${file}:`, err);
              return;
          }
  
          console.log(`💻〃${file} loaded`);
      });
  });
  

  client.login(config.token);