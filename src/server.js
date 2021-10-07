require('dotenv').config()
const express = require('express')
const app = express()
const passport = require('passport')
const handlebars = ('express-handlebars')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
require('./loggers/log4js')
const log4js = require('log4js')

const loggerConsola = log4js.getLogger('consola')
const loggerError = log4js.getLogger('error')

require('./database/connection')

const modoCluster = false

if (modoCluster == true && cluster.isMaster) {
    loggerConsola.info('num CPUs', numCPUs)
    loggerConsola.info(`PID MASTER ${process.pid}`)

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }
    cluster.on('exit', worker => {
        loggerConsola.info('Worker', worker.process.pid, 'murió')        
    })
}

const productosRouter = require('./routes/productos')
const carritoRouter = require('./routes/carrito')
const usuariosRouter = require('./routes/usuarios')

app.use('/api', productosRouter)
app.use('/api', carritoRouter)
app.use('/api', usuariosRouter)

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))

app.engine('hbs', handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts'
}))

app.set("view engine", "hbs")
app.set("views", "./views")

app.use((err, req, res, next) =>{
    console.error(err.message)
    res.status(500).send('Algo se rompio')
})

const server = app.listen(process.env.PORT, () => {
    loggerConsola(`servidor corriendo en http://localhost:${process.env.PORT}`)
})

server.on('error', error => {
    loggerError('Error de servidor: ', error)
})

module.exports = server