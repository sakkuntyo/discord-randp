import {
  REST,
  Routes,
  GatewayIntentBits,
  Client,
  Partials,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
const { joinVoiceChannel } = require('@discordjs/voice');
import dotenv from 'dotenv';

// アプリケーション情報
import * as fs from 'fs'
const appname = JSON.parse(
  fs.readFileSync("./package.json", "utf8")
).name;
const homepage = JSON.parse(
  fs.readFileSync("./package.json", "utf8")
).homepage;
const version = JSON.parse(
  fs.readFileSync("./package.json", "utf8")
).version;

dotenv.config();

const rcommands = [
  new SlashCommandBuilder()
    .setName('record')
    .setDescription('record voice channel'),
  new SlashCommandBuilder()
    .setName('disconnect')
    .setDescription('disconnect this voice channel'),
  new SlashCommandBuilder().setName('version').setDescription('show version'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: rcommands
    });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

const rclient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution
  ],
  partials: [Partials.Message, Partials.Channel]
});

rclient.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  await interaction.deferReply();

  switch (interaction.commandName) {
    case 'record':
      interaction.editReply("record");
      //この辺が参考になりそう https://qiita.com/Mori-chan/items/2df4ad15adc79cf2a167
      break;
    case 'disconnect':
      interaction.editReply("discord");
      break;
    case 'version':
      interaction.editReply(`name: ${appname}\nversion: ${version}\n${homepage}`);
      break;
  }
});

rclient.login(process.env.TOKEN);
