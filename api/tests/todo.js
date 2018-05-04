const Models = require('../models/index');
let chai = require('chai');
const bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(10);
let chaiHttp = require('chai-http');
let server = require('../../server');
chai.use(chaiHttp);
chai.should();

let user = {
    username: 'ttttest',
    password: 'test'
};

describe('Tests', () => {

    let taskId = 0;
    let userId = 0;
    let token = 0;

    before(done=>{

        // Models.todos.destroy({where: {}}).then(()=>{
        //     return Models.todos.create({
        //         title: "Read the book",
        //         status: false,
        //         userId
        //     })
        // }).then(task=>{
        //     taskId = task.dataValues.id;
        //     Models.user.create({
        //         username: user.username,
        //         password:  bcrypt.hashSync(user.password, salt)
        //     }).then(data=>{
        //         userId = data.dataValues.id;
        //     })
        // });
        // done();
        Models.sequelize.sync({ force: true}).then(()=>{
            return Models.user.create({
                    username: user.username,
                    password:  bcrypt.hashSync(user.password, salt)
                }).then(user=>{
                    console.log('user id', user.dataValues.id, 'строка 46');
                    userId = user.dataValues.id;
                });
        }).then(()=>{
            done();
        })
    });

    describe('/register user', () => {
        it('it should register new user', (done) => {

            let user2 = {
                username: "test user",
                password: 'test'
            };
            chai.request(server)
                .post('/api/user/register')
                .send(user2)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username');
                    res.body.should.have.property('password');
                    done();
                });
        });

    });

    describe('/login user', () => {
        it('it should login user', (done) => {

            chai.request(server)
                .post('/api/user/login')
                .send(user)
                .end((err, res) => {
                    token = res.body.token;
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    describe('/POST task', () => {
        it('it should POST a task', (done) => {
            console.log('new task user id', userId);
            let task = {
                title: "Learn programming",
                status: false,
                userId: userId
            };
            chai.request(server)
                .post('/api/todos/tasks/')
                .send(task)
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    taskId = res.body.id;
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('status');
                    done();
                });
        });

    });

    describe('/GET tasks', () => {
        it('it should GET all the tasks', (done) => {
            chai.request(server)
                .get('/api/todos/tasks/')
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });
    //
    describe('/GET/:id task', () => {
        it('it should GET a task by the given id', (done) => {
            console.log('sds', taskId, 'user', userId);
            chai.request(server)
                .get('/api/todos/tasks/' + taskId)
                .set('authorization', token)
                .end((err, res) => {
                    if(err) console.error(err);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('status');
                    res.body.should.have.property('id').eql(taskId);
                    done();
                });
        })
    });
    //
    describe('/PUT/:id task', () => {
        it('it should UPDATE a task given the id', (done) => {

            chai.request(server)
                .put('/api/todos/tasks/' + taskId)
                .send({title: 'Make something', status:true})
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('status');
                    done();
                });

        });
    });

    describe('/DELETE/:id task', () => {
        it('it should DELETE a task given the id', (done) => {
            chai.request(server)
                .delete('/api/todos/tasks/' + taskId)
                .set('authorization', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('Task successfully deleted');
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

});
