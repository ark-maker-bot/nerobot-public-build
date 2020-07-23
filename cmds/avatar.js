const discord = require('discord.js'),
    moment = require('moment');
module.exports = {
	name: 'avatar',
    description: `send a user's avatar`,
    params: '<mention> (optional) ',
    type: 'user',
	execute(message) {
        console.log('avatar command has started');
        var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
        if(message.content.includes("@")){
            const user = message.mentions.users.first();
            if(!user){
                message.reply('`INVAILD MENTION`');
            }else{
                const avatarEmbed = new discord.MessageEmbed()
                .setTitle(user.username)
                .setImage(user.displayAvatarURL())
                .setTimestamp(moment().format())
                .setColor(rgb);
                message.reply(avatarEmbed);
            }
        }else{
            const localAvatarEmbed = new discord.MessageEmbed()
            .setTitle(message.author.username)
            .setImage(message.author.displayAvatarURL())
            .setTimestamp(moment().format())
            .setColor(rgb);
            message.reply(localAvatarEmbed);
        }
	},
};