const discord = require('discord.js');
module.exports = {
	name: 'verify',
    description: `applies verification to have access to the server`,
    type: 'admin',
	async execute(message, args) {
        console.log('verify command has started');
        var rgb_verify = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
        message.delete();
        const verifyEmbed = new discord.MessageEmbed()
        .setTitle('REACT TO VERIFY')
        .setDescription('CLICK THE REACTION DOWN BELOW TO VERIFY')
        .setColor(rgb_verify);
        let verify = await message.channel.send(verifyEmbed);
        await verify.react('👍');
	},
};