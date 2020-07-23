module.exports = {
	name: 'howgay',
	description: `gay meter`,
	type: 'user',
	execute(message) {
		console.log('howgay command has started');
		var gayPercent = Math.random() * 100;
		message.reply('`YOU ARE ' + gayPercent.toFixed(0) + '% GAY`');
	},
};