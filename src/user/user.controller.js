const userService = require("./user.service")
const { errorStatusCodeHandler } = require('../../utils')
class UserController {

    constructor(){
        this.service = userService
    }

    routeHandler(req, res){
        if(req.method == 'POST'){
            this.postHandler(req, res)
        }else if(req.method == 'GET'){
            this.getHandler(req, res)
        }else if(req.method == 'PATCH'){
            this.patchHandler(req, res)
        }else if(req.method == 'DELETE'){
            this.deleteHandler(req, res)
        }
    }

    postHandler(req, res){
        const url = req.url.replace('/user', '')
        if(!url){
            this.service.create({req, res})
        }
        if(url == '/login'){
            this.service.login({req, res})
        }
    }

    getHandler(req, res){
        const url = req.url.replace('/user', '')
        if(!url){
            this.service.findAll({req, res})
        }else{
            this.service.findOne({req, res}, url)
        }
    }

    patchHandler(req, res){
        const url = req.url.replace('/user', '')
        if(!url){
            errorStatusCodeHandler(res, 500, "Send an id")
        }else{
            this.service.update({req, res}, url)
        }
    }

    deleteHandler(req, res){
        const url = req.url.replace('/user', '')
        if(!url){
            errorStatusCodeHandler(res, 500, "Send an id")
        }else{
            this.service.delete({req, res}, url)
        }
    }

}

module.exports = new UserController()