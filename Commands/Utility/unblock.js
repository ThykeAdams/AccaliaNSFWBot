let verificationSchema = require('../../Models/VerificationSchema')
let Discord = require('discord.js')
module.exports = {
    name: 'unblock',
    aliases: ['unblacklist'],
    async execute(client, message, args) {
        
        if (message.guild.owner.user.id !== message.author.id) return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${message.author}, you do not have permission to run this command`))

        
        let user = message.mentions.members.first() || message.guild.members.cache.find(r => r.id == args[0])

        if (!user) return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription('You need to provide a user'))

        verificationSchema.findOne({ UserID: user.id }, async (err, verification) => {
            if (!verification) {
                message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${user} is not blacklisted`))

            } else {
                verification.delete()

            }
             
            message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${user}'s records have been deleted, they are now able to use the system`))
        })

    }
}