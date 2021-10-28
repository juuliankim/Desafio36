require('dotenv').config()
const path = require('path')
const express = require('express')
require('../account/usuarios')
const passport = require('passport')
const Ethereal = require('../mensajeria/emailEthereal')
const productos = require('../api/productosMongo')
const carrito = require('../api/carritoMongo')
const router = express.Router()

router.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
        var user = req.user;
        console.log(req.user)
        console.log('El usuario SI esta logueado')
        res.render('vista', { showLogin: false, showContent: true, bienvenida: user.nombre, showBienvenida: true })
    }
    else {
        console.log('El usuario NO está logueado');
        res.render('vista', { showLogin: true, showContent: false, showBienvenida: false })
    }
})

router.get('/faillogin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/failLogin.html'))
})

router.post('/login', passport.authenticate('login', { failureRedirect: '/users/faillogin' }), async (req, res) => {
    let listaProductos = await productos.listar()
    let vistaCarrito = await carrito.listar()
    res.render('vista', { showLogin: false, showContent: true, vistaCarrito: vistaCarrito, listaProductos: listaProductos, bienvenida: req.user.nombre, showBienvenida: true })
})

router.get('/logout', (req, res) => {
    req.logout()
    res.sendFile(path.join(__dirname, '../public/logout.html'))
})

router.get('/signup', (req, res) => {
    res.render('register', {})
})

router.post('/signup', passport.authenticate('signup', { failureRedirect: '/users/failsignup' }), async (req, res) => {
    var user = req.user;
    Ethereal.enviarMailLogIn(process.env.GMAIL_USER, req.user)
    console.log(req.user)
    let listaProductos = await productos.listar()
    res.render('vista', { showLogin: false, showContent: true, listaProductos: listaProductos, bienvenida: user.nombre, showBienvenida: true })
})

router.get('/failsignup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/failSignup.html'))
})

module.exports = router