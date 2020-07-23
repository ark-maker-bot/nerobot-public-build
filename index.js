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

client.on('ready', () => {
    console.log('ready');
});
client.on('messageReactionAdd', (reaction, user) => {
    let message = reaction.message, emoji = reaction.emoji;
    if(emoji.name == '👍'){
        let member = message.guild.members.cache.find(member => member.id === user.id);
        if(member){
            member.roles.add('733838178162704405');
            reaction.remove();
        }
    }
});
client.on('message', message => {
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
            message.channel.send(verifyEmbed).then(sentMessage => {
                sentMessage.react('👍');
            });

            // 👍
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