const { channel } = require('diagnostics_channel');
const Discord = require('discord.js');
const mysql = require('mysql2');
const config = require("./config.json");
const client = new Discord.Client();

const pool = mysql.createPool({
        host: config.hostIp,
        user: config.UserId,
        password: config.Password,
        database: config.NomBdd,
        connectionLimit: 10
});

const db = pool.promise();

client.on('message', async (message) => {
    if (message.content.startsWith('!un')) {
        const args = message.content.split(' ');
        const searchTerm = args[1];

        if (!searchTerm) {
            return message.reply('Tu dois fournir un identifiant valide (license, nom, Discord ID, etc.).');
        }

        const requiredRole = config.autoriserole;

        if (!message.member.roles.cache.has(requiredRole)) {
            return message.reply('Tu n\'as pas les permissions nécessaires pour utiliser cette commande.');
        }

        try {
            let query;
            let params;


            if (/^\d+$/.test(searchTerm)) {
                query = 'SELECT * FROM banlist WHERE discord = ?';
                params = [`discord:${searchTerm}`];
            } else {
                query = `
                    SELECT * FROM banlist 
                    WHERE license = ? OR LOWER(targetplayername) = LOWER(?) OR discord = ?
                `;
                params = [searchTerm, searchTerm, `discord:${searchTerm}`];
            }

            const [rows] = await db.query(query, params);

            if (rows.length > 0) {

                const deleteParams = [rows[0].license, rows[0].targetplayername, rows[0].discord];
                await db.query('DELETE FROM banlist WHERE license = ? OR LOWER(targetplayername) = LOWER(?) OR discord = ?', deleteParams);
                message.reply(`L'utilisateur avec l'identifiant \`${searchTerm}\` a été débanni avec succès.`);

                const unbanchannel = message.guild.channels.cache.find(channel => channel.name === 'logs-ban-unban');
                unbanchannel.send(`L'utilisateur avec l'identifiant \`${searchTerm}\` a été débanni via discord par *<@${message.author.id}>*`)
            } else {
                message.reply(`Aucun utilisateur trouvé avec cet identifiant dans la banlist.`);
            }
        } catch (err) {
            console.error('Erreur lors de l\'exécution de la requête:', err.stack);
            message.reply(`Erreur lors de la recherche dans la banlist.`);
        }
    }
});

client.login(config.token);
