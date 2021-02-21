const { Schema, model } = require("mongoose");
module.exports = model(
    "Verification",
    new Schema({
        InProgress: Boolean,
        Confirmation: Boolean,
        UserID: String,
        HandlerID: String,
        Verified: Boolean,
        VerificationDate: String,
        Birthdate: Date,
        Blocked: Boolean,
        Embed: Array,
        CPID: String
    })
);
