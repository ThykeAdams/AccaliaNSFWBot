let verificationSchema = require('../../Models/VerificationSchema')
let Discord = require('discord.js')
module.exports = {
    name: 'verifyme',
    async execute(client, message, args) {
        verificationSchema.findOne({ UserID: message.author.id }, async (err, verification) => {
            if (!verification) return newVerification()
            if (verification.InProgress === true) return message.channel.send(new Discord.MessageEmbed().setColor('YELLOW').setDescription(`${message.member}, Please wait, you already have a Age Verification ticket open :p`))
            if (verification.Verified === true) return alreadyVerified()
            if (verification.Blocked === true) return blocked()
        })
        function newVerification() {

            // Start new Verification Process

            message.member.send(new Discord.MessageEmbed()
                .setColor('BLUE')
                .setTitle(`Welcome to the Age Verification System!`)
                .setDescription(`Welcome to the age verification system for ${message.guild.name}. To get started we need you to send a picture of your ID: \n> Drivers Licence\n> Passport\n> Diploma\nAlong with your Discord name and tag somewhere in the picture (Not edited onto it), You can use a piece of paper to show it!.\n\n**What we need to see:**\n> Your DOB (Date of Birth)\n **What we do not need to see:**\n> Your Picture\n> Your Name\n> Your Address\n> ETC\n\n Please wait untill one of our awesome staff DMs you and we will get you verified Right away!`)
                .setTimestamp()

            )
            let embed = new Discord.MessageEmbed()
                .setTitle('New Age Verification Request')
                .setThumbnail(message.author.avatarURL())
                .setDescription(`${message.author} wants to be age verified, please DM them and ask for their ID, if you are handling this user, please react below with the 👍`)
                .setTimestamp()
                .setColor('BLUE')
            client.channels.cache.get(process.env.VerificationChannel).send(embed).then(msg => {
                msg.react('👍')
                let newTicket = new verificationSchema({
                    InProgress: true,
                    Confirmation: false,
                    UserID: message.author.id,
                    VerificationDate: '',
                    HandlerID: 'None Yet',
                    Verified: false,
                    Birthdate: null,
                    Blocked: false,
                    Embed: [embed],
                    CPID: msg.id
                })
                newTicket.save()
            })
            
            
            
        }
        function alreadyVerified() {
            if (message.member.roles.cache.has(process.env.NSFWRole)) {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setTitle('Already Verified')
                    .setDescription(`Hmm!!~ It seems you already have the 18+ role? No need to reverify`)
                )
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('GREEN')
                    .setDescription(`Huh?? you alre already verified but you no has role? >w< Looks wike we has a probwem~ No wowwy, I gotchu. You has wole nows OwO`)
                ).then(msg => {
                    message.member.roles.add(message.guild.roles.cache.get(process.env.NSFWRole)) 
                })
                
            }
        }
        function blocked() {
            message.channel.send(new Discord.MessageEmbed()
                .setColor('RED')
                .setDescription('Seems you have been blocked from using our Age Verification System :(')
                .setTitle('Blocked')
            )
        }
    }
}