const mongoose = require('mongoose')
const url = require('../config/config.json').MONGO_ATLAS
require('../loggers/log4js')
const log4js = require('log4js')

const loggerConsola = log4js.getLogger('consola')
const loggerError = log4js.getLogger('error')

const connection = mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', () => {
    console.log('[Mongoose] - connected in:', url)
})

mongoose.connection.on('error', (err) => {
    console.log('[Mongoose] - error:', err)
})

module.exports = connection