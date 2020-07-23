const discord = require('discord.js');
const moment = require('moment');
module.exports = {
	name: 'purge',
    description: `deletes the amount of messages`,
    params: '<integer> ',
    type: 'admin',
	execute(message, args) {
        console.log('purge command has started');
        if(args[0]){
            var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
            if (message.member.hasPermission("MANAGE_MESSAGES")) {
                const deleteAmount = parseInt(args[0], 10);
                if(deleteAmount < 2 || deleteAmount > 100){
                    message.channel.send('`INVALID, A NUMBER BETWEEN 2 AND 100`');
                    return;
                }
                message.delete();
                message.channel.messages.fetch({limit: deleteAmount})
                .then(messages => {
                    message.channel.bulkDelete(messages);
                    const purgeEmbed = new discord.MessageEmbed()
                    .setTitle('`PURGE REPORT` ' + '`(' + deleteAmount + ' msgs)`')
                    .setDescription('`SUCCESSFULLY DELETED ' + deleteAmount + ' MESSAGES`\n`THIS MESSAGE WILL DELETE ITSELF AFTER 15 SECONDS`')
                    .setColor(rgb)
                    .setTimestamp(moment().format());
                    message.channel.send(purgeEmbed).then(sentMessage => {
                        sentMessage.delete({timeout: 15000}).then(() => {
                            console.log('MESSAGE HAS BEEN DELETED');
                        });
                    });
                }).catch(err => {
                    if(err)throw err;
                    message.channel.send("`ERROR: ERROR CLEARING CHANNEL.`");
                });
            }else{
                message.channel.send("`INVALID, YOU DON'T HAVE THE REQUIRED PERMISSIONS`");
            }
        }
	},
};