const Discord = require('discord.js');
const myBot = new Discord.Client({fetchAllMembers: true, partials: ['MESSAGE', 'REACTION']});
const config = require("./config.json");
const fs = require('fs');

myBot.commandes = new Discord.Collection();

async function getNickname(member) {
    if (member.nickname) {
        return member.nickname;
    } else {
        return member.user.username;
    }
}

myBot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.id !== config.channelDarkChat) return;

    let messageArray = message.content.split(" ");
    let args = messageArray.slice(0);

    message.delete();

    let member = await message.guild.members.fetch(message.author.id);
    let nickname = await getNickname(member);

    let EmbedDark = new Discord.MessageEmbed()
        .setColor('#0000')
        .setAuthor('Message anonyme', config.imgDarkChat)
        .setDescription(`**${args.join(" ")}**`)
        .setThumbnail(config.imgDarkChat2)
        .setFooter(`Darkchat`);

    message.channel.send(EmbedDark);
    message.guild.channels.cache.get(config.logsIdChannel).send(`🔐 → **${nickname}** viens de post le message darknet suivant : **${message}**`);
});

myBot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.id !== config.channelLbc) return;

    let messageArray = message.content.split(" ");
    let args = messageArray.slice(0);

    message.delete();

    let member = await message.guild.members.fetch(message.author.id);
    let nickname = await getNickname(member);

    let embedLbc = new Discord.MessageEmbed()
        .setColor('#e28743')
        .setAuthor('Le bon coin', config.imgLeBonCoin)
        .setDescription(args.join(" "))
        .setFooter(`Annonce créé par ${nickname}`);

    message.channel.send(embedLbc);
});

myBot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.id !== config.channelTwitter) return;

    let messageArray = message.content.split(" ");
    let args = messageArray.slice(0);

    message.delete();

    let member = await message.guild.members.fetch(message.author.id);
    let nickname = await getNickname(member);

    let embedTwitter = new Discord.MessageEmbed()
        .setColor('#00acee')
        .setAuthor('Twitter', config.imgTwitter)
        .setDescription(args.join(" "))
        .setFooter(`Post created by ${nickname}`);

    message.channel.send(embedTwitter).then(m => {
        m.react('❤️');
        m.react('🔁');
    });
});

myBot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.id !== config.channelSuggestion) return;

    let messageArray = message.content.split(" ");
    let args = messageArray.slice(0);

    message.delete();

    let member = await message.guild.members.fetch(message.author.id);
    let nickname = await getNickname(member);

    let EmbedSugg = new Discord.MessageEmbed()
        .setColor('#00BCE3')
        .setAuthor(`📀 Suggestion`)
        .setDescription(`**${args.join(" ")}**`)
        .setFooter(`Suggestion créé par ${nickname}`);

    message.channel.send(EmbedSugg).then(m => {
        const arrow_up = message.guild.emojis.cache.find(emoji => emoji.name === config.reactionUp);
        const arrow_down = message.guild.emojis.cache.find(emoji => emoji.name === config.reactionDown);

        m.react('✅');
        m.react('❌');
    });
});

myBot.login(config.token);