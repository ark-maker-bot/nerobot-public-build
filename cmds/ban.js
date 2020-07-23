const discord = require('discord.js'),
    moment = require('moment'),
    permission = require('../permissionsCheck');
module.exports = {
	name: 'ban',
    description: `bans mentioned user`,
    params:"<@mention> <duration> <reason> ",
    type: 'admin',
	execute(message, args) {
        if(permission.permCheck(message, message.author, "BAN_MEMBERS")){
            console.log('ban command has started');
            var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
            console.log(args[1]);
            const user = message.mentions.users.first();
            if(user){
                const mentionedUser = message.guild.member(user);
                if(mentionedUser && mentionedUser.bannable){
                    let duration = parseInt(args[1], 10);
                    if(!duration)duration = 7;
                    let reason = args.slice(2).join(' ');
                    if(!reason)reason = 'No reason provided';
                    mentionedUser
                    .ban({days: duration, reason: reason})
                    .then(() => {
                        const banReportEmbed = new discord.MessageEmbed()
                        .setTitle('`BAN REPORT FOR USER ' + mentionedUser.displayName + '`')
                        .setDescription('`YOU HAVE SUCCESSFULLY BANNED ' + mentionedUser.displayName + ' FOR ' + reason + '`')
                        .setColor(rgb)
                        .setTimestamp(moment().format());
                        message.channel.send(banReportEmbed).then(sentMessage => {
                            sentMessage.delete({timeout: 15000});
                        });
                    }).catch(err => {
                        const banReportEmbed = new discord.MessageEmbed()
                        .setTitle('`BAN REPORT FOR USER ' + mentionedUser.displayName + '`')
                        .setDescription('`YOU HAVE TRIED TO BAN ' + mentionedUser.displayName + ' BUT FAILED`')
                        .setColor(rgb)
                        .setTimestamp(moment().format());
                        message.channel.send(banReportEmbed).then(sentMessage => {
                            sentMessage.delete({timeout: 15000});
                        });
                        console.log(err);
                    });
                }
            }else{
                message.reply('`INVALID, PLEASE MENTION A USER`');
            }
        }else{
            message.reply("`INVALID, YOU DON'T BAN PERMISSION`");
        }
	},
};