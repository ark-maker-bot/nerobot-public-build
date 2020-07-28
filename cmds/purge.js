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
            const deleteAmount = parseInt(args[0], 10);
            if(deleteAmount < 2 || deleteAmount > 100){
                message.channel.send('`INVALID, A NUMBER BETWEEN 2 AND 100`');
                return;
            }
            message.channel.messages.fetch({limit: deleteAmount})
            .then(messages => {
                let count = 5;
                message.channel.bulkDelete(messages);
                const purgeEmbed = new discord.MessageEmbed()
                .setTitle('`PURGE REPORT` ' + '`(' + deleteAmount + ' msgs)`')
                .setDescription('`SUCCESSFULLY DELETED ' + deleteAmount + ' MESSAGES`')
                .setColor(rgb)
                .setTimestamp(moment().format())
                .setFooter('TIME LEFT: ' + count);
                message.channel.send(purgeEmbed).then(sentMessage => {
                    let countMill = count * 1000;
                    var curTime = new Date().getTime();
                    var endTime = curTime + countMill;

                    var timer = setInterval(function () {
                        var currTime = new Date().getTime();
                        var remainingTime = endTime - currTime;
                        console.log(remainingTime);
                        if(remainingTime >= 0){
                            let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                            //if(seconds < 10)seconds = "0" + seconds;
                            //var remainingTimeToText = seconds;
                            console.log(seconds);
                            var purgeEdit = new discord.MessageEmbed()
                            .setTitle('`PURGE REPORT` ' + '`(' + deleteAmount + ' msgs)`')
                            .setDescription('`SUCCESSFULLY DELETED ' + deleteAmount + ' MESSAGES`')
                            .setColor(rgb)
                            .setTimestamp(moment().format())
                            .setFooter('TIME LEFT: ' + seconds);
                            sentMessage.edit(purgeEdit).catch((err) => {
                                console.error(err);
                            });
                        }else {
                            clearInterval(timer);
                        }
                    }, 1000);

                    sentMessage.delete({timeout: 5000}).then(() => {
                        console.log('purge complete');
                    });
                });
            }).catch(err => {
                if(err)throw err;
                message.channel.send("`ERROR: ERROR CLEARING CHANNEL.`");
            });
        }
	},
};