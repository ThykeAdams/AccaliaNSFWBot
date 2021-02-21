const chalk = require('chalk')
const Discord = require('discord.js')
module.exports = (client, message) => {
    if (message.channel.type === 'dm') {
        require('../AVS/DM')(client, message)
    } else {
        var prefix = '~'
        var escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        var prefixRegex = new RegExp(`^(<@!?${client.user.id}> |<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`)
        if (!prefixRegex.test(message.content)) return
        var [, matchedPrefix] = message.content.match(prefixRegex)
    
                //console.log(matchedPrefix.length)
    
        console.log(chalk.yellow(`(${message.author.id} || ${message.author.tag}) Checking client to see if command`))
            
        var cmdCall = message.content.slice(matchedPrefix.length).split(' ').shift().toLowerCase()
        var command = client.commands.get(cmdCall) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdCall))
        var args = message.content.split(' ')
        if (RegExp(`^(<@!?${client.user.id}>)\\s*`).test(message.content)) {
            args = args.slice(1)
        }
        if (command) {
            console.log(chalk.greenBright(`(${message.author.id} || ${message.author.tag}) Has used command: ${command.name}`))
            args = args.slice(1)
            try {
                command.execute(client, message, args)
            } catch (e) {
                console.log(e)
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription('I am broken, My Dev Team has been notified of this issue')
                    .setTitle('Error')
                )
            }
        }
    }
}