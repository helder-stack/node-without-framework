const { bodyHandler, errorStatusCodeHandler, successStatusCodeHandler } = require('../../utils')
const { user } = require('../database/mysql.connection')
const database = require('../database/mysql.connection')
const passwordHandler = require('../password/index')

class UserService {

    constructor() {
        this.table = `${database.database}.user`
    }

    async create({ req, res }) {
        try {
            const { name, email, age, password } = await bodyHandler(req)
            const hashedPassword = passwordHandler.generatePassword(password)
            database.connection.query(`SELECT email FROM ${this.table} where email = "${email}"`, (error, result, fields) =>{
                if(!result.length){
                    const query = `INSERT INTO ${this.table} (name, email, age, password) VALUES ("${name}", "${email}", ${age}, "${hashedPassword}")`
                    database.connection.query(query)
                    successStatusCodeHandler(res)
                }else{
                    errorStatusCodeHandler(res, 500, "This email already exist")
                }
            })
        } catch (e) {
            console.error(e)
            errorStatusCodeHandler(res, 500, e.message)
        }
    }

    async findAll({ req, res }) {
        try {
            database.connection.query(`SELECT * FROM ${this.table}`, (error, result, fields) => {
                result.forEach(user => result.map(user => delete user.password))
                successStatusCodeHandler(res, JSON.stringify(result))
            })
        } catch (error) {
            console.error(error)
            errorStatusCodeHandler(res, 500)
        }
    }

    async findOne({ req, res }, url) {
        try {
            const id = url.replace(/\//g, '')
            database.connection.query(`SELECT * FROM ${this.table} WHERE id = ${id}`, (error, result, fields) => {
                if (error) throw new error
                if (result.length) {
                    [result] = result
                    delete result.password
                    successStatusCodeHandler(res, JSON.stringify(result))
                } else {
                    errorStatusCodeHandler(res, 404)
                }
            })
        } catch (error) {
            console.error(error)
            errorStatusCodeHandler(res, 500)
        }
    }

    async update({ req, res }, url) {
        try {
            const id = url.replace(/\//g, '')
            database.connection.query(`SELECT * FROM ${this.table} where id = ${id}`, async (error, result, fields) => {
                if (!result.length) {
                    errorStatusCodeHandler(res, 404)
                    return
                }
                const fieldsToUpdate = await this.updateFieldsHandler(req)
                database.connection.query(`UPDATE ${this.table} set ${fieldsToUpdate} where id = ${id}`, (error, result, fields) => {
                    if (error) console.error(error)
                    successStatusCodeHandler(res)
                })
            })
        } catch (error) {
            console.error(error)
            errorStatusCodeHandler(res, 500)
        }
    }

    async updateFieldsHandler(req) {
        const { name, email, age, password } = await bodyHandler(req)
        let query = ``
        if (name) {
            query += `name = "${name}",`
        }
        if (email) {
            query += `email = "${email}",`
        }
        if (age) {
            query += `age = "${age}",`
        }
        if (password) {
            query += `password = "${password}",`
        }
        return query.substring(0, query.length - 1)
    }

    delete({ req, res }, url) {
        try {
            const id = url.replace(/\//g, '')
            database.connection.query(`SELECT * FROM ${this.table} where id = ${id}`, (error, result, fields) => {
                if (!result.length) {
                    errorStatusCodeHandler(res, 404)
                    return
                }
                database.connection.query(`DELETE FROM ${this.table} where id = ${id}`, (error, result, fields) => {
                    successStatusCodeHandler(res)
                })
            })
        } catch (error) {
            console.error(error)
            errorStatusCodeHandler(res, 500)
        }
    }

    async login({ req, res }) {
        const { email, password } = await bodyHandler(req)
        database.connection.query(`SELECT email, password FROM ${this.table} where email = "${email}"`, (error, result, fields) => {
            if(!result.length){
                errorStatusCodeHandler(res, 404, "User not found")
            }else{
                [result] = result
                if(passwordHandler.compare(result, password)){
                    successStatusCodeHandler(res)
                }else{
                    errorStatusCodeHandler(res, 500, "Password incorrect")
                }
            }
        })
    }

}

module.exports = new UserService()