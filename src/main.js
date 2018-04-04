const Discord = require('discord.js')
const Zcash = require("zcash")

const settings = require('./settings')
const Commands = require('./commands')

var emotip = require('./commands/emotip')

// Init the Discord client
const client = new Discord.Client()

const giphyApiKey = settings.GIPHY_KEY

client.on('ready', () => {
  client.user.setPresence({ status: 'online', game: { name: 'Do -koto help!' } });
  console.log('I am ready!')
})

client.on('message', message => {

  // If message has been emitted by a bot do nothing
  if (message.author.bot) return

  if (message.content.startsWith('-exchange')) {
    var args = message.content.substring(1).split(' ')
    var command = args[1]

    switch (command) {
      case 'help':
        Commands.help(message)
        break
      case 'register':
        Commands.balance(message, Zcash)
        break
      case 'address':
        Commands.address(message, Zcash)
        break
      case 'tip':
        Commands.tip(message, Zcash, args[2], args[3])
        break
      case 'withdraw':
        Commands.withdraw(message, Zcash, args[2], args[3])
        break
      default:
        message.reply('Kotoooooo')
    }
  }
})

client.login(settings.DISCORD_TOKEN)
