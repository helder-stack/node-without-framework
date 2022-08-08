const server = require('./Server.settings')
const databaseSettings = require("./src/database/mysql.connection")

databaseSettings.startConnection()
server.startServer()
