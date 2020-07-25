const discord = require('discord.js');
const moment = require('moment');
module.exports = {
	name: 'poll',
    description: `poll of yes and no`,
    type: 'admin',
	async execute(message, args) {
        console.log(args[0]);
        console.log(args[1]);
        message.delete();

        let title = args.slice(1).join(" ");
        if(!title)title = "no title";

        if(!args[0])return;
        let maxTime = parseInt(args[0], 10);
        console.log(maxTime);
        let maxTimeType = args[0].split('');
        console.log(maxTimeType);

        for(let i = 0; i < maxTimeType.length; i++){
            console.log(maxTimeType[i]);
            if(maxTimeType[i].includes('s'))maxTime *= 1000;
            else if(maxTimeType[i].includes('m'))maxTime *= 60000;
            else if(maxTimeType[i].includes('hr'))maxTime *= 3600000;
            else if(maxTimeType[i].includes('d'))maxTime *= 86400000;
        }
        console.log(maxTime);

        var rgb_poll = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
        const pollEmbed = new discord.MessageEmbed()
        .setTitle('`POLL`')
        .setDescription('`THIS IS A POLL FOR ' + title.toUpperCase() + '`')
        .setColor(rgb_poll)
        .setTimestamp(moment().format());

        let poll = await message.channel.send(pollEmbed);
        poll.react('✅');
        poll.react('❎');

        let checks = 0, crosses = 0;
        const filter = (reaction, user) => {
            return ['✅', '❎'].includes(reaction.emoji.name);
        };
        const collector = poll.createReactionCollector(filter, {time: maxTime});
        collector.on('collect', (reaction, reactionCollector) => {
            switch(reaction.emoji.name){
            case '✅':{
                checks += 1;
            }break;
            case '❎':{
                crosses += 1;
            }break;
            }
        });
        collector.on('end', (reaction, reactionCollector) => {
            //if(checks > crosses)message.channel.send('checkmarks win');
            //else if(crosses > checks)message.channel.send('crosses win');
            //else message.channel.send('draw');

            message.channel.send('`POLL FINISHED`');
        });
	},
};