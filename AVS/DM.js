const verificationSchema = require('../Models/VerificationSchema')
module.exports = (client, message) => {
    verificationSchema.findOne({ UserID: message.author.id }, async (err, verification) => {
        if (verification) {
            
        }
    })
}