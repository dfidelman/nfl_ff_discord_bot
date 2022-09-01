const fs = require('node:fs');
const path = require('node:path');
//  Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const { token, prefix } = require('./config.json');
const config = require('./config.json');
const { maxHeaderSize } = require('node:http');

//  Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ] });

client.prefixCommands = new Collection();
client.slashCommands = new Collection();
const prefixCommandsPath = path.join(__dirname, 'prefix_commands');
const slashCommandsPath = path.join(__dirname, 'slash_commands');
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// for (const file of eventFiles) {
// 	const filePath = path.join(eventsPath, file);
// 	const event = require(filePath);
// 	if (event.once) {
// 		client.once(event.name, (...args) => event.execute(...args));
// 	} else {
// 		client.on(event.name, (...args) => event.execute(...args));
// 	}
// }

module.exports = client;

for (const file of slashCommandFiles) {
	const filePath = path.join(slashCommandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.slashCommands.set(command.data.name, command);
}

for (const file of prefixCommandFiles) {
  let pull = require(`./prefix_commands/${file}`);
	const filePath = path.join(prefixCommandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
  if (pull.config.name) {
	  client.prefixCommands.set(pull.config.name, pull);
    console.log(`Loaded a file ${pull.config.name} - test`);
  } else {
    console.log(`did not load file - test`);
    continue;
  }
}

//  When the client is ready, run this code (only once)
client.once('ready', () => {
  console.log('Ready!');
  
});

client.on('messageCreate', async message => {

  if (message.channel.type !== 0) return;
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);

  console.log(client.prefixCommands.get(message.content));
  const command = client.prefixCommands.get(message.content);

  if (!command) return;

  try {
    await command.execute(client, message, config);
  } catch (error) {
    console.error(error);
    await message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  };

});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.slashCommands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//  Login to Discord with your client's token
client.login(token);