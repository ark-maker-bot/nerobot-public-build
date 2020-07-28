require('dotenv').config();
const discord = require('discord.js'),
    fs = require('fs'),
    moment = require('moment');
var {prefix} = require('./config.json');
const client = new discord.Client();

const cooldown = new Map();
let cdSeconds = 3;

client.db = require('quick.db');
client.request = new (require('rss-parser'));

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
    // uploads(); // only uncomment if you have videos on your channel or i am just stupid, but who knows
    console.log('ready');
});
client.on('messageReactionAdd', (reaction, user) => {
    let message = reaction.message, emoji = reaction.emoji;
    if(emoji.name == '👍'){
        let member = message.guild.members.cache.find(member => member.id === user.id);
        if(member){
            member.roles.add(process.env.ROLEID);
        }
    }
});
client.on('message', async (message) => {
    if(message.content.startsWith(prefix)){
        console.log('command used ' + message.content.slice(prefix.length));

        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if(cooldown.has(message.author.id)){
            message.delete();
            message.reply('You have to wait 3 seconds between commands.');
            return;
        }

        if(!message.member.hasPermission('ADMINISTRATOR'))
            cooldown.set(message.author.id);

        if(client.cmds.has(command)){
            let permNeeded = '';
            let typeOfCommand = client.cmds.get(command).type.toLowerCase();
            switch(typeOfCommand){
            case "user":{
                permNeeded = 'SEND_MESSAGES';
            }break;
            case "admin":{
                permNeeded = 'ADMINISTRATOR';
            }break;
            default:
                break;
            }
            let correctMember = message.member.fetch(message.author.id);
            let hasPerm = (await correctMember).hasPermission(permNeeded);
            console.log(hasPerm);
            if(!hasPerm){message.delete()
                return;}
        }

        switch(command){
        case "avatar":{
            client.cmds.get('avatar').execute(message);
        }break;
        case "verify":{
            client.cmds.get('verify').execute(message);

            // 👍 👎
        }break;
        case "poll":{
            client.cmds.get('poll').execute(message, args); // maybe another time but who knows - nero
        }break;
        case "countdown":{
            let count = 5;
            let countMill = count * 1000;
            var curTime = new Date().getTime();
            var endTime = curTime + countMill;
            const countEmbed = new discord.MessageEmbed()
            .setTitle('`COUNTDOWN`')
            .setFooter('TIMER: ' + count);
            message.channel.send(countEmbed).then(sentMessage => {
                var timer = setInterval(function () {
                    var currTime = new Date().getTime();
                    var remainingTime = endTime - currTime;
                    if(remainingTime >= 0){
                        let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                        //if(seconds < 10)seconds = "0" + seconds;
                        //var remainingTimeToText = seconds;
                        console.log(seconds);
                        var countdownEdit = new discord.MessageEmbed()
                        .setTitle('`COUNTDOWN`')
                        .setFooter('TIMER: ' + seconds);
                        sentMessage.edit(countdownEdit).catch((err) => {
                            console.error(err);
                        });
                    }else {
                        clearInterval(timer);
                    }
                }, 1000);

                sentMessage.delete({timeout: countMill}).then(() => {
                    console.log('message deleted');
                });
            });
        }break;
        case "requests":{
            client.cmds.get('requests').execute(message, args);
        }break;
        case "webhook":{
            client.cmds.get('webhook').execute(message, args, webhookClient);
        }break;
        // case "messagecollecter":{
        //     let filter = msg => {
        //         if(msg.author.id === message.author.id){
        //             if(msg.content.toLowerCase() === 'done')collector.stop();
        //             else return true;
        //         }
        //         else return false;
        //     };
        //     let collector = message.channel.createMessageCollector(filter, {max: 4});
        //     let messages = await getMessages(collector);
        //     message.channel.send(messages.join('\n'));
        // }break;
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

        setTimeout(() => {
            cooldown.delete(message.author.id);
        }, cdSeconds * 1000);
    }
});

function getMessages(collector){
    return new Promise((resolve, reject) => {
        collector.on('end', collected => resolve(collected.map(m => m.content)));
    });
}

// credits go to ansonfoong on github, you need to have a least one youtube video on your channel or it will continue to throw you errors/warning
let messageTemplate = "Hello @everyone, **{author}** just now uploaded a video **{title}**!\n{url}"; // you can change where this goes or what it says
let channelid = client.channels.cache.find(ch => ch.id === process.env.ANNOUNCEMENTSCHANNELID);
function uploads(){
    if(client.db.fetch(`postedVideos`) === null)client.db.set(`postedVideos`, []);
    setInterval(() => {
        client.request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${process.env.YOUTUBECHANNELID}`)
        .then(data => {
            if (client.db.fetch(`postedVideos`).includes(data.items[0].link)) return;
            else {
                client.db.set(`videoData`, data.items[0]);
                client.db.push("postedVideos", data.items[0].link);
                let parsed = client.db.fetch(`videoData`);
                let channel = client.channels.cache.get(channelid);
                if (!channel) return;
                let message = messageTemplate
                    .replace(/{author}/g, parsed.author)
                    .replace(/{title}/g, discord.Util.escapeMarkdown(parsed.title))
                    .replace(/{url}/g, parsed.link);
                channel.send(message);
            }
        }).catch(console.error); // it was giving me a warning about it but oh well
    }), 30000; // every 30 seconds
}



client.login(process.env.BOTKEY);