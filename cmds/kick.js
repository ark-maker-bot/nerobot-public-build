const discord = require('discord.js'),
    moment = require('moment');
const { permCheck } = require('../permissionsCheck');
module.exports = {
	name: 'kick',
    description: `kicks mentioned user`,
    params: "<@mention> <reason> ",
    type: 'admin',
	execute(message, args) {
        if(permCheck(message, message.author, "KICK_MEMBERS")){
            console.log('kick command has started');
            var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
            const user = message.mentions.users.first();
            if(user){
                const mentionedUser = message.guild.member(user);
                if(mentionedUser && mentionedUser.kickable){
                    let reason = args.slice(1).join(' ');
                    if(!reason)reason = 'No reason provided';
                    mentionedUser
                    .kick({reason: reason})
                    .then(() => {
                        const kickReportEmbed = new discord.MessageEmbed()
                        .setTitle('`KICK REPORT FOR USER ' + mentionedUser.displayName + '`')
                        .setDescription('`YOU HAVE SUCCESSFULLY KICKED ' + mentionedUser.displayName + ' FOR ' + reason + '`')
                        .setColor(rgb)
                        .setTimestamp(moment().format());
                        message.channel.send(kickReportEmbed).then(sentMessage => {
                            sentMessage.delete({timeout: 15000});
                        });
                    }).catch(err => {
                        const kickReportEmbed = new discord.MessageEmbed()
                        .setTitle('`KICK REPORT FOR USER ' + mentionedUser.displayName + '`')
                        .setDescription('`YOU HAVE TRIED TO KICK ' + mentionedUser.displayName + ' BUT FAILED`')
                        .setColor(rgb)
                        .setTimestamp(moment().format());
                        message.channel.send(kickReportEmbed).then(sentMessage => {
                            sentMessage.delete({timeout: 15000});
                        });
                        console.log(err);
                    });
                }
            }else{
                message.reply('`INVALID, PLEASE MENTION A USER`');
            }   
        }else{
            message.reply("`INVALID, YOU DON'T KICK PERMISSION`");
        }
	},
};