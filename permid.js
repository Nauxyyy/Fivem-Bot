const Discord = require('discord.js');
const mysql = require('mysql2');
const config = require("./config.json");


const db = mysql.createConnection({
    host: config.hostIp,
    user: config.UserId,
    password: config.Password,
    database: config.NomBdd
});

db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.stack);
        return;
    }
});


const client = new Discord.Client();


client.on('message', (message) => {
    if (message.content.startsWith('!permid')) {
        const args = message.content.split(' ');
        const searchTerm = args[1];

        if (!searchTerm) {
            return message.reply('Tu dois fournir un identifiant valide (license, nom, Discord ID, etc.).');
        }

        const requiredRole = config.autoriserole;

        if (!message.member.roles.cache.has(requiredRole)) {
            return message.reply('Tu n\'as pas les permissions nécessaires pour utiliser cette commande.');
        }

        let query;
        let params;
        if (/^\d+$/.test(searchTerm)) {
            query = 'SELECT * FROM baninfo WHERE discord = ?';
            params = [`discord:${searchTerm}`];
        } else {
            query = `
                SELECT * FROM baninfo 
                WHERE license = ? OR LOWER(playername) = LOWER(?) OR discord = ?
            `;
            params = [searchTerm, searchTerm, searchTerm];
        }

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête:', err.stack);
                return message.reply('Erreur lors de la récupération des informations.');
            }

            if (results.length > 0) {
                const banInfo = results[0];
                const embed = new Discord.MessageEmbed()
                    .setTitle('Perm Id')
                    .addField('ID Permanent', banInfo.id)
                    .addField('Nom du Joueur', banInfo.playername)
                    .addField('Discord', banInfo.discord)
                    .setColor('RED');
                
                message.channel.send(embed);
            } else {
                message.reply('Aucune information de bannissement trouvée pour cet identifiant.');
            }
        });
    }
});


client.login(config.token);
