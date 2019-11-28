import {Router} from '../common/router'
import * as restify from 'restify'
import {User} from './users.model'

class UsersRouter extends Router {

    constructor(){
        super()
        this.on('beforeRender', document=>{
            document.password = undefined
        })
    }

    applyRoutes(application: restify.Server){
        application.get('/users', (req, resp, next)=>{
            User.find().then(this.render(resp,next))
        })

        application.get('/users/:id', (req, resp, next)=>{
            User.findById(req.params.id).then(this.render(resp,next))
        })

        application.post('/users', (req, resp, next)=>{
            let user = new User(req.body)
            user.save().then(this.render(resp,next))
        })

        application.put('/users/:id', (req, resp, next)=>{
            User.replaceOne({_id:req.params.id}, req.body)
                .exec().then(result=>{
                    if(result.n){
                        return User.findById(req.params.id)
                    }else{
                        resp.send(404)
                    }
            }).then(this.render(resp,next))
        })

        application.del('/users/:id',(req, resp, next)=>{
            User.deleteOne({ _id: req.params.id })
                .then((cmdResult: any)=>{
                    if(cmdResult){
                        resp.send(204)
                    } else{
                        resp.send(404)
                    }
                    return next()
                })
        })
    }
}

export const usersRouter = new UsersRouter()