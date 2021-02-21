let verificationSchema = require('../../Models/VerificationSchema')
let Discord = require('discord.js')
module.exports = {
    name: 'block',
    aliases: ['blacklist'],
    async execute(client, message, args) {
        
        if (message.guild.owner.user.id !== message.author.id) return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${message.author}, you do not have permission to run this command`))

        let user = message.mentions.members.first() || message.guild.members.cache.find(r => r.id == args[0])

        if (!user) return message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription('You need to provide a user'))

        verificationSchema.findOne({ UserID: user.id }, async (err, verification) => {
            if (!verification) {
                let newVer = new verificationSchema({
                    InProgress: false,
                    Confirmation: false,
                    UserID: user.id,
                    HandlerID: message.author.id,
                    Verified: false,
                    VerificationDate: Date.now(),
                    Birthdate: '',
                    Blocked: true,
                    Embed: [],
                    CPID: ''
                })
                newVer.save()

            } else {
                verification.Blocked = true
                verification.save()

            }
            user.roles.remove(message.guild.roles.cache.get('812505986715615303')) 
            message.channel.send(new Discord.MessageEmbed().setColor('RED').setDescription(`${user} is no longer able to use the age verification system`))
        })

    }
}