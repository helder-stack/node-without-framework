const userController = require('../user/user.controller')
class RoutesHandler {

    handler(req, res){
        if(req.url.includes("/user")){
            userController.routeHandler(req, res)
        }
    }

}

module.exports = new RoutesHandler()