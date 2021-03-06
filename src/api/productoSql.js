const options = require('../config/mysql')
const knex = require('knex')(options)

class Productos {

    constructor() {
        this.validacionTabla()
    }

    async validacionTabla() {
        try {
            await knex.schema.hasTable('productos').then(function (exists) {
                if (!exists) {
                    return knex.schema.createTable('productos', table => {
                        table.increments('id');
                        table.string('nombre');
                        table.string('descripcion');
                        table.string('codigo');
                        table.string('foto');
                        table.integer('precio');
                        table.integer('stock');
                        table.string('timestamp');
                    });
                }
            })
            console.log('Tabla productos creada!');
        } catch (error) {
            console.log(error);
        }
    }    

    async listar() {
        try {
            let resultado = await knex('productos').select('*')
            return resultado
        } catch(error) {
            throw error
        }
    }

    async listarPorId(idProducto) {
        try {
            let resultado = await knex('productos').where({id: idProducto})
            return resultado
        } catch(error) {
            throw error
        }
    }

    async guardar(producto) {
        try {
            let timestamp = new Date().toLocaleString()
            producto.timestamp = timestamp
            let resultado = await knex('productos').insert(producto)
            return resultado
        } catch(error) {
            throw error
        }
    }

    async actualizar(idProducto, nuevoProducto) {
        try {
            let resultado = await knex('productos').where({id: idProducto}).update(nuevoProducto)
            return resultado
        } catch(error) {
            throw new Error('No se pudo actualizar el producto')
        }
    }

    async borrar(idProducto) {
        try {
            let resultado = await knex('productos').where({id: idProducto}).del()
            return resultado
        } catch(error) {
            throw error
        }
    }
}

module.exports = new Productos()