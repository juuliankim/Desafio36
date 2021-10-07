const options = require('../config/mysql.js')
const knex = require('knex')(options)
const productos = require('./productoSql')

class Carrito {
    
    constructor() {
        this.validacionTabla()
    }

    validacionTabla() {
        try {
            await knex.schema.hasTable('carrito').then(function (exists) {
                if (!exists) {
                    return knex.schema.createTable('carrito', table => {
                        table.increments('id');
                        table.string('timestamp');
                        table.string('producto');
                    });

                }
            })
            console.log('Tabla carrito creada!');
        } catch (error) {
            console.log(error);
        }
    }

    async listar() {
        try {
            this.validacionTabla()
            let productos = await knex.from('carrito').select('*')
            return productos
        } catch(error) {
            throw error
        }
    }

    async listarPorId(idCarrito) {
        try {
            this.validacionTabla()
            let resultado = await knex('carrito').where({id: idCarrito})
        } catch(error) {
            throw error
        }
    }

    async guardar(idProducto) {
        try {
            this.validacionTabla()
            let carrito = {
                id: 0,
                timestamp: 'fecha',
                producto: { }
            }
            let idCarrito = await knex('carrito').count('*')
            let timestamp = new Date().toLocaleString()
            let producto = await productos.listarPorId(idProducto)
            carrito.id = idCarrito
            carrito.timestamp = timestamp
            carrito.producto = JSON.stringify(producto, null, 3)
            let resultado = await knex('carrito').insert(carrito)
            return resultado
        } catch(error) {
            throw error
        }
    }

    async actualizar(idProducto, nuevoProducto) {
        try {
            let producto = await productos.listarPorId(idProducto)
            let resultado = await knex('carrito').where({producto: producto}).update(nuevoProducto)
            return resultado
        } catch(error) {
            throw error
        }
    }

    async borrar(idCarrito) {
        try {
            let resultado = await knex('carrito').where({id: idCarrito}).del()
            return resultado
        } catch(error) {
            throw error
        }
    }
}

module.exports = new Carrito()