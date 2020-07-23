const discord = require('discord.js');
const moment = require('moment');
module.exports = {
	name: 'links',
    description: `send all of the owners links`,
    type: 'user',
	execute(message, args) {
        console.log('links command has started');
        if(!args[0]){
            var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
            var links = [["discord","https://discord.gg/JpEHy8B"],["youtube","https://www.youtube.com/channel/UCoUVy4pC85ggsc6LyQ85wuw"]];
            var completeLink = "";
            links.forEach(link => {
                completeLink += '`' + link[0] + '`: `' + link[1] + "`\n";
            });
            const linksEmbed = new discord.MessageEmbed()
            .setTitle('`LINKS` `(' + links.length + ')`')
            .setDescription(completeLink)
            .setColor(rgb)
            .setTimestamp(moment().format());
            message.channel.send(linksEmbed);
        }
	},
};