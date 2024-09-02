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


const channelID = config.permidchannel;

client.once('ready', () => {
    
    setInterval(checkForNewBans, 60000);
});

function checkForNewBans() {
    db.query('SELECT * FROM baninfo WHERE is_sent = FALSE', (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'exécution de la requête:', err.stack);
            return;
        }

        if (results.length > 0) {
            const channel = client.channels.cache.get(channelID);
            if (!channel) {
                console.error('Salon non trouvé.');
                return;
            }

            results.forEach(banInfo => {
                let discordMention = 'Non disponible';
            
                if (banInfo.discord) {
                    const discordID = banInfo.discord.replace('discord:', '');
                    discordMention = `<@${discordID}>`;
                }

                const embed = new Discord.MessageEmbed()
                    .setTitle('Nouvelle Information de Bannissement')
                    .addField('ID Permanent', banInfo.id)
                    .addField('Nom du Joueur', banInfo.playername)
                    .addField('Discord', discordMention)
                    .setColor('RED');
                
                channel.send(embed);

                db.query('UPDATE baninfo SET is_sent = TRUE WHERE id = ?', [banInfo.id], (err) => {
                    if (err) {
                        console.error('Erreur lors de la mise à jour de la base de données:', err.stack);
                    }
                });
            });
        }
    });
}


client.login(config.token);
