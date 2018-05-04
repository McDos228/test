const express = require('express');
const router = express.Router();
const todos = require('../../services/index').todosService;

//list all tasks 

router.get('/tasks', (req, res)=>{
    let key = req.query.key;
    let order = req.query.order;
    let query = {
        limit: req.query.limit,
        offset: req.query.offset
    };
    if(key){
        query.where = {
            title: {
                $iLike: '%' + key + '%'
            }
        };
    }
    if(!order){
        order = 'id';
    }
    let userId = req.user.id;
    todos.getAllTodos(query, order, userId).then(tasks=>{
        if(tasks){
            let todoList = tasks.map((task)=>{
                return task.dataValues
            });
            res.json(todoList);
        }else {
            res.json({message:'task list not found'});
        }
    }).catch(err=>{
        if (err) res.json(err);
    });

})

//create task

.post('/tasks', (req, res)=>{
    req.checkBody('title').notEmpty().withMessage('title is required');
    let errors = req.validationErrors();
    if(errors) res.json({message: errors[0].msg});

    let title = req.body.title;
    let userId = req.user.id;
    todos.createTodo(title, userId).then(task=>{
        if(task) res.json(task);
        res.json({message: 'task not found'});
    }).catch(error=>{
        res.json(error);
    });

})

// get one task

.get('/tasks/:id', (req, res)=>{
    req.checkParams('id').notEmpty().withMessage('id is required');
    let errors = req.validationErrors();
    if(errors) res.send({message: errors[0].msg});

    let userId = req.user.id;
    let id = +req.params.id;
    todos.getOneTodo(id, userId).then(task=>{
        res.json(task.dataValues);
    }).catch(error=>{
        // console.log(error);
        res.json({message : error.message});
    });

})

// update task

.put('/tasks/:id', (req, res)=>{
    req.checkBody('title')
        .notEmpty().withMessage('title is required')
        .isLength({ min: 5, max: 50 }).withMessage('title must be at least 5 characters');
    req.checkBody('status')
        .notEmpty().withMessage('status is required');
    let errors = req.validationErrors();
    if(errors){
        let errorArray = errors.map(error=>{
            return error.msg;
        });
        res.send({message: errorArray});
    }else{
        let id = +req.params.id;
        let title = req.body.title;
        let status = req.body.status;
        let userId = req.user.id;
        todos.updateTodo(id, title, status, userId).then((data) => {
            res.json(data);
        }).catch(err=>{
            res.json({message : err});
        })
    }
})

// delete task

.delete('/tasks/:id', (req, res)=>{
    req.checkParams('id', 'id is required').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        res.send({message: errors[0].msg});
    }else{
        let userId = req.user.id;
        let id = +req.params.id;
        todos.deleteTodo(id, userId).then((data)=> {
            if(data===1){
                res.json({message: 'Task successfully deleted'});
            }else if(data===0){
                res.json({message: 'Task not found'});
            }
        }).catch(error=>{
            res.json({message: error})
        });
    }

});

module.exports = router;