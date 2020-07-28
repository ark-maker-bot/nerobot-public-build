const discord = require('discord.js'),
    moment = require('moment');
module.exports = {
	name: 'webhook',
    description: `send a edited webhook, ch = channel, pfp = avatar, name = username`,
    params: '<edit/send> <ch/name/pfp> ',
    type: 'admin',
	execute(message, args, webhookClient) {
        console.log('webhook command has started');
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
	},
};