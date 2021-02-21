let mongoose = require('mongoose')
require('dotenv').config()
var dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
}
module.exports = (client) => {
    console.log(`Logged in as ${client.user.tag}`)
    mongoose.connect(
        process.env.MongoDB,
        dbOptions,
        
    )
    mongoose.connection.once('connected', () => {
        console.log(`Connected to Database`)
    })
}