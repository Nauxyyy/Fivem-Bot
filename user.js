const Discord = require('discord.js');
const mysql = require('mysql2');
const config = require("./config.json");

const db = mysql.createConnection({
    host: config.hostIp,
    user: config.UserId,
    password: config.Password,
    database: config.NomBdd
});;


db.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err.stack);
        return;
    }
});


const client = new Discord.Client();

client.once('ready', () => {
    console.log('Bot prêt.');
});

client.on('message', (message) => {
    if (message.content.startsWith('!info')) {
        const args = message.content.split(' ');
        const searchTerm = args[1];

        if (!searchTerm) {
            return message.reply('Tu dois fournir un identifiant valide (pseudo, licence, prénom, etc.).');
        }

        const requiredRole = config.autoriserole;

        if (!message.member.roles.cache.has(requiredRole)) {
            return message.reply('Tu n\'as pas les permissions nécessaires pour utiliser cette commande.');
        }

        const query = `
            SELECT * FROM users 
            WHERE license = ? OR LOWER(name) = LOWER(?) OR LOWER(firstname) = LOWER(?)
        `;
        const params = [searchTerm, searchTerm, searchTerm];

        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête:', err.stack);
                return message.reply('Erreur lors de la récupération des informations.');
            }

            if (results.length > 0) {
                const userInfo = results[0];
                const embed = new Discord.MessageEmbed()
                    .setTitle('Informations de l\'Utilisateur')
                    .setTimestamp()
                    .setThumbnail(message.guild.iconURL())
                    .setFooter('By nauxyy')
                    .addField('Pseudo', userInfo.name)
                    .addField('License', userInfo.license)
                    .addField('Coins', userInfo.points)
                    .addField('--', '--')
                    .addField('Prénom et nom', `${userInfo.firstname} ${userInfo.lastname}`)
                    .addField('Naissance, sexe et taille', `${userInfo.dateofbirth} ${userInfo.sex} ${userInfo.height}`)
                    .addField('Argent', userInfo.money)
                    .addField('Banque', userInfo.bank)
                    .addField('Job', `${userInfo.job}, Grade : ${userInfo.job_grade}`)
                    .addField('Job illégal', `${userInfo.job2}, Grade : ${userInfo.job2_grade}`)
                    .addField('Arme', userInfo.loadout)
                    .addField('Dernière position', userInfo.position)
                    .addField('Groupe', userInfo.group)
                    .setColor('BLUE');

                message.channel.send(embed);
            } else {
                message.reply('Aucun utilisateur trouvé avec cet identifiant.');
            }
        });
    }
});

client.login(config.token);
