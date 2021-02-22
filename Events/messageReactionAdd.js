let verificationSchema = require('../Models/VerificationSchema')
let Discord = require('discord.js')
module.exports = (client, reaction, user) => {
    if (user.bot) return
    let message = reaction.message
    verificationSchema.findOne({ CPID: message.id }, async (err, verification) => {
        if (!verification) return
        if (verification.InProgress === true && reaction.emoji.name === "👍") {
            // Claim
            let member = message.guild.members.cache.get(verification.UserID)
            if (!member) return message.edit(new Discord.MessageEmbed().setColor('RED').setDescription('Member Left Server'))
            message.edit(new Discord.MessageEmbed()
                .setTitle('Age Verification Request')
                .setColor('YELLOW')
                .setThumbnail(verification.Embed[0].thumbnail.url)
                .setDescription(`to accept the request: 🟢\nTo deny: 🔴`)
                .setTimestamp()
                .setFooter(`User is being handled: ${user.tag}`, user.avatarURL())
            )
            message.reactions.removeAll()
            message.react('🟢')
            message.react('🔴')
            verification.InProgress = false
            verification.Confirmation = true
            verification.HandlerID = user.id
            verification.save()
        } else if (verification.Confirmation === true && reaction.emoji.name === "🟢") {
            if (user.id !== verification.HandlerID) return reaction.users.remove(message.author.id).catch(e => {return console.log(chalk.redBright(e))})
            
            let member = message.guild.members.cache.get(verification.UserID)
            if (!member) return message.edit(new Discord.MessageEmbed().setColor('RED').setDescription('Member Left Server'))
            message.reactions.removeAll()
            message.edit(new Discord.MessageEmbed()
                .setTitle('~~Age Verification Request~~')
                .setColor('GREEN')
                .setThumbnail(verification.Embed[0].thumbnail.url)
                .setDescription(`${member} wuz verified`)
                .setTimestamp()
                .setFooter(`User was handled by: ${user.tag}`, user.avatarURL())
            )
            member.roles.add(message.guild.roles.cache.get(process.env.NSFWRole)) 
            
            verification.Confirmation = false
            verification.Verified = true
            verification.VerificationDate = Date.now()

            verification.save()
            
            member.send(new Discord.MessageEmbed()
                .setColor('GREEN')
                .setDescription('Welcome to the NSFW zone')
                .setTitle('Accepted')
            )


        } else if (verification.Confirmation === true && reaction.emoji.name === "🔴") {
            if (user.id !== verification.HandlerID) return reaction.users.remove(message.author.id).catch(e => {return console.log(chalk.redBright(e))})
            
            let member = message.guild.members.cache.get(verification.UserID)
            if (!member) return message.edit(new Discord.MessageEmbed().setColor('RED').setDescription('Member Left Server'))
            message.reactions.removeAll()
            message.edit(new Discord.MessageEmbed()
                .setTitle('~~Age Verification Request~~')
                .setColor('RED')
                .setThumbnail(verification.Embed[0].thumbnail.url)
                .setDescription(`${member} wuz not verified`)
                .setTimestamp()
                .setFooter(`User was handled by: ${user.tag}`, user.avatarURL())
            )
            
            
            verification.Confirmation = false
            verification.Verified = false
            verification.VerificationDate = Date.now()

            verification.save()
            
            member.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('Your Request has been denied')
                .setTitle('Denied')
            )


        }
    })
}