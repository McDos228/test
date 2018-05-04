const Users = require('../models/index').user;
const bcrypt = require('bcrypt');

let salt = bcrypt.genSaltSync(10);

module.exports.signIn = (user)=>{

    return Users.findOne({
        where:{
            username: user.username
        }
    }).then(data=>{
        if (data){
            if(bcrypt.compare(user.password, data.dataValues.password)){
                return data.dataValues
            }else {
                return ({message:'password is not match'})
            }
        }
    }).catch(err=>{
        return err;
    })
};

module.exports.signUp = (user)=>{
    let pass = bcrypt.hashSync(user.password, salt);
    return Users.create({
        username: user.username,
        password: pass
    });
};