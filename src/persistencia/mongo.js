const mongo = require('../config/config.json')
const mongoose = require('mongoose')
require('./loggers/log4js')
const log4js = require("log4js")

const loggerConsola = log4js.getLogger('consola')

async function connectDB() {
    let uri = mongo.MONGO_ATLAS
    // let uri = mongo.MONGO_LOCAL
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    loggerConsola.info(`mongoose conectado en ${uri}`)
    return
}

connectDB()