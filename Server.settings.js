const http = require("http")
const routerHandler = require('./src/routes/index')
class ServerSettings {

    constructor() {
        this.host = "localhost"
        this.port = 3001;
    }

    startServer() {
        this.server = http.createServer(this.requestListener)
        this.server.listen(this.port, () => {
            console.clear()
            console.log(`🚀 Server is running on http://${this.host}:${this.port} 🚀`)
        })
    }
    
    requestListener(req, res) {
        routerHandler.handler(req, res)
    }
}

module.exports = new ServerSettings()