const Todos = require('../models/index').todos;

module.exports.getAllTodos = (query, order, userId)=> {
    return Todos.findAll({query,
        where:{
            userId : userId
        },
        order: [
            [order, 'DESC'],
        ]
    });
};

module.exports.createTodo = (title, id)=> {
    return Todos.create({
        title : title,
        status : 'false',
        userId : id
    });
};

module.exports.getOneTodo = (id, userId)=> {
    return Todos.findOne({
        where:{
            id : id,
            userId : userId
        }
    });
};

module.exports.updateTodo = (id, title, status, userId)=> {
    return Todos.findOne({
        where:{
            id : id,
            userId : userId
        }
    }).then(todo=>{
        if(todo) {
            return todo.update({
                title: title,
                status : status
            });
        }else return {message:'task not found'};

    });
};

module.exports.deleteTodo = (id, userId)=> {
    return Todos.destroy({
        where: {
            id: id,
            userId : userId
        }
    })
};
