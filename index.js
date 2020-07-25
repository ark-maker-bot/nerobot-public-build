require('dotenv').config();
const discord = require('discord.js'),
    fs = require('fs'),
    moment = require('moment');
var {prefix} = require('./config.json');
const client = new discord.Client();

client.cmds = new discord.Collection();
const commandFiles = fs.readdirSync('./cmds').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./cmds/${file}`);
    client.cmds.set(command.name, command);
    console.log(command.name);
}

let maxInts = [1,2,3,4,5,6,7,8,9];

client.on('ready', () => {
    console.log('ready');
});
client.on('messageReactionAdd', (reaction, user) => {
    let message = reaction.message, emoji = reaction.emoji;
    if(emoji.name == '👍'){
        let member = message.guild.members.cache.find(member => member.id === user.id);
        if(member){
            member.roles.add('733838178162704405');
        }
    }
});
client.on('message', async (message) => {
    if(message.content.startsWith(prefix)){
        console.log('command used ' + message.content.slice(prefix.length));

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        switch(command){
        case "avatar":{
            client.cmds.get('avatar').execute(message);
        }break;
        case "verify":{
            var rgb_verify = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
            message.delete();
            const verifyEmbed = new discord.MessageEmbed()
            .setTitle('REACT TO VERIFY')
            .setDescription('CLICK THE REACTION DOWN BELOW TO VERIFY')
            .setColor(rgb_verify);
            let verify = await message.channel.send(verifyEmbed);
            await verify.react('👍');

            // 👍 👎
        }break;
        case "poll":{
            //client.cmds.get('poll').execute(message, args); maybe another time but who knows - nero
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
        }break;
        case "howgay":{
            client.cmds.get('howgay').execute(message);
        }break;
        case "links":{
            client.cmds.get('links').execute(message, args);
        }break;
        case "kick":{
            client.cmds.get('kick').execute(message, args);
        }break;
        case "ban":{
            client.cmds.get('ban').execute(message, args);
        }break;
        case "purge":{
            client.cmds.get('purge').execute(message, args);
        }break;
        case "help":{
            const helpEmbed = new discord.MessageEmbed();
            var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
            helpEmbed.setColor(rgb);
            helpEmbed.setTimestamp(moment().format());
            if(args[0]){
                const nextParam = args[0].toLowerCase();
                const foundCorrect = client.cmds.has(nextParam);
                if(foundCorrect){
                    helpEmbed.setTitle('`HELP PAGE FOR ' + args[0].toUpperCase() + '`');
                    const descriptionElement = client.cmds.get(nextParam).description;
                    let paramElement = client.cmds.get(nextParam).params;
                    if(!paramElement)paramElement = "";
                    helpEmbed.setDescription('`' + nextParam + ' ' + paramElement + '- ' + descriptionElement + '`');
                    message.channel.send(helpEmbed);
                }else{
                    message.reply('`THIS IS NOT A VALID FEATURE`');
                }
            }else{
                helpEmbed.setTitle('`HELP PAGE`');
                var cmdList = "";var cmdListAdmin = "";var index = 1;var indexAdmin = 1;
                client.cmds.forEach(cmd => {
                    if(cmd.type == 'user'){
                        cmdList += "`" + index + '. ' + cmd.name + '`\n';
                        index++;
                    }else if(cmd.type == 'admin'){
                        cmdListAdmin += "`" + indexAdmin + '. ' + cmd.name + '`\n';
                        indexAdmin++;
                    }
                });
                var completeCommandList = '`USER COMMANDS`\n' + cmdList + '\n`ADMIN COMMANDS`\n' + cmdListAdmin;
                helpEmbed.setDescription(completeCommandList);
                message.channel.send(helpEmbed);
            }
        }break;
        }
    }
});

client.login(process.env.BOTKEY);