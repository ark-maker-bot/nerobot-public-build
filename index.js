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

const webhookClient = new discord.WebhookClient(process.env.WEBID, process.env.WEBTOKEN);
client.on('ready', () => {
    client.fetchWebhook(process.env.WEBID, process.env.WEBTOKEN)
    .then(webhook => console.log('collected webhook with name:' + webhook.name))
    .catch(console.error);
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
            client.cmds.get('poll').execute(message, args); // maybe another time but who knows - nero
        }break;
        case "webhook":{
            if(!args[0])return;
            let argsLower = args[0].toLowerCase();
            if(!argsLower)return;

            let avatarurl = '';
            let correctString = '';

            switch(argsLower) {
            case "edit":{
                let editLower = args[1].toLowerCase();
                switch (editLower){
                case "channel":{
                    let channelid = parseInt(args[2].toLowerCase(), 10);
                    if(!channelid)return;
                    webhookClient.edit({
                        channel: channelid
                    }).then(webhook => console.log('edited channel in webhook ' + webhook.channelID)).catch(console.error);
                }break;
                case "avatar":{
                    if(args[2])avatarurl = args[2];
                    else avatarurl = client.user.displayAvatarURL();
                    webhookClient.edit({
                        avatar: avatarurl
                    }).then(webhook => console.log('edited avatar in webhook ' + webhook.avatar)).catch(console.error);
                }break;
                case "username":{
                    if(!args[2])return;
                    correctString = args[2].toString();
                    webhookClient.edit({
                        name: correctString
                    }).then(webhook => console.log('edited name in webhook ' + webhook.name)).catch(console.error);
                }break;
                }
            }break;
            case "send":{
                var rgb_webhook = [Math.random() * 256, Math.random() * 256, Math.random() * 256];

                const webhookEmbed = new discord.MessageEmbed()
                .setTitle('`WEBHOOK TESTING`')
                .setDescription('`UHH OK`')
                .setColor(rgb_webhook)
                .setImage(message.author.displayAvatarURL())
                .setTimestamp(moment().format());

                webhookClient.send('', {
                    username: correctString,
                    avatarURL: avatarurl,
                    embeds: [webhookEmbed]
                });
            }break;
            }
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