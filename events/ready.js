module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
    // console.log("The command prefix is " + config.prefix);
	},
};