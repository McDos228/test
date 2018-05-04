const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const Users = require('../../services/index').usersService;

router.post('/login', (req, res)=>{
    req.checkBody('username').notEmpty().withMessage('username is required')
    req.checkBody.isLength({ min: 4, max: 20 }).withMessage('username must be at least 4 characters');
    req.checkBody('password').notEmpty().withMessage('password is required');
    let errors = req.validationErrors();
    if(errors){
        let errorArray = errors.map(error=>{
            return error.msg;
        });
        res.send({message: errorArray});
    }else{
        let user = {username: req.body.username, password: req.body.password};
        Users.signIn(user).then(data=>{
            if(data){
                res.json({
                    message:'user successful log in',
                    token: jwt.sign({
                        id: data.id,
                        username: data.username,
                        password: data.password
                    }, config.secret)
                });
            }else{
                res.json({message: 'user not found'});
            }
        });
    }
})

.post('/register', (req, res)=>{
    req.checkBody('username').notEmpty().withMessage('username is required')
    req.checkBody.isLength({ min: 4, max: 20 }).withMessage('username must be at least 4 characters');
    req.checkBody('password').notEmpty().withMessage('password is required');
    let errors = req.validationErrors();
    if(errors){
        let errorArray = errors.map(error=>{
            return error.msg;
        });
        res.json({message: errorArray});
    }else{
        let user = {username: req.body.username, password: req.body.password};
        Users.signUp(user).then(user=>{
            res.json(user);
        });
    }
});

module.exports = router;