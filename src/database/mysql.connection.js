const mysql = require('mysql')

class DatabaseSettings {
    constructor() {
        this.host = "localhost"
        this.user = "root"
        this.password ="###############"
        this.database = "###############"
        this.connection = ""
    }

    async startConnection() {
        try {
            this.connection = await mysql.createConnection({
                host: this.host,
                user: this.user,
                password: this.password,
            })
            await this.connection.connect()
            await this.runDefaultScript()
            console.log("💽 Database connected 💽")
        } catch (e) {

        }
    }

    async runDefaultScript() {
        console.log("⌛️ Running default SQL scripts ⌛️")
        await this.connection.query(`CREATE DATABASE IF NOT EXISTS ${this.database}`)
        await this.connection.query(`CREATE TABLE IF NOT EXISTS ${this.database}.user(id INT NOT NULL AUTO_INCREMENT, name VARCHAR(200), age INT, email VARCHAR(100), password VARCHAR(200),  CONSTRAINT userPK PRIMARY KEY ( id ))`)
    }
}

module.exports = new DatabaseSettings()