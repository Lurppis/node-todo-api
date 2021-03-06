const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('./../models/user');
const { dummyTodos, populateTodos, populateUsers, users } = require('./seed/seed');

// Will delete all documents to make sure that test will execute correctly
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('Should create new todo', (done) => {
		var text = 'Test todo text2';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({
				text
			})
			.expect(201)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err) => {
				if (err) {
					return done(err);
				}
				Todo.find({ text }).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should not create new todo with bad data', (done) => {
		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.send({ text: '' })
			.expect(400)
			.end((err) => {
				if (err) return done(err);

				Todo.find((todos) => {
					expect(todos).toBe(null);
					done();
				}).catch((e) => done(e));
			});
	});

});

describe('GET /todos', () => {

	it('Should return all todos', (done) => {
		request(app)
			.get('/todos')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(2);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {

	it('Should return existed todo with valid ID', (done) => {
		var id = dummyTodos[0]._id.toHexString();
		request(app)
			.get(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(dummyTodos[0].text);
			})
			.end(done);
	});

	it('Should return 404 if todo not found', (done) => {
		var id = new ObjectID().toHexString();
		request(app)
			.get(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should return 404 if id not valid', (done) => {
		var id = 'qwert123456';
		request(app)
			.get(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});

	it('Should not return todo doc created by other user', (done) => {
		var id = dummyTodos[1]._id.toHexString();
		request(app)
			.get(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('Should remove todo', (done) => {
		var id = dummyTodos[0]._id.toHexString();

		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(id);
			})
			.end((err) => {
				if (err) {
					return done(err);
				}
				Todo.findById(id).then((todo) => {
					expect(todo).toNotExist();
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should return 404 if todo not found', (done) => {
		var id = new ObjectID().toHexString();

		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end((err) => {
				if (err) {
					return done(err);
				}
				done();
			});
	});

	it('Should return 404 if id not valid', (done) => {
		var id = 'qwerty123456';

		request(app)
			.delete(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end((err) => {
				if (err) {
					return done(err);
				}
				done();
			});
	});
});

describe('PATCH /todos/:id', () => {
	it('Should update the todo', (done) => {
		var id = dummyTodos[0]._id.toHexString();
		var updatedText = 'Updated text';

		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				text: updatedText,
				completed: true
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(updatedText);
				expect(res.body.todo.completed).toBe(true);
				expect(res.body.todo.completedAt).toBeA('number');
			})
			.end(done);
	});

	it('Should clear completedAt when todo is false', (done) => {
		var id = dummyTodos[2]._id.toHexString();

		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				completed: false
			})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.completedAt).toBe(null);
				expect(res.body.todo.completed).toBe(false);
			})
			.end(done);
	});

	it('Should not update completedAt by force when completed false', (done) => {
		var id = dummyTodos[0]._id.toHexString();

		request(app)
			.patch(`/todos/${id}`)
			.set('x-auth', users[0].tokens[0].token)
			.send({
				completedAt: 123
			})
			.expect((res) => {
				expect(res.body.todo.completedAt).toBe(null);
				expect(res.body.todo.completed).toBe(false);
			})
			.expect(200)
			.end(done);
	});
});

describe('GET /users/me', () => {
	it('Should return user if authenticate', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('Should return 401 if no authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done);
	});
});

describe('POST /users', () => {
	it('Should create user', (done) => {
		var newUser = {
			email: 'newUser@example.com',
			password: 'test12345'
		};
		request(app)
			.post('/users')
			.send(newUser)
			.expect(200)
			.expect((res) => {
				expect(res.body.email).toBe(newUser.email);
				expect(res.headers['x-auth']).toExist();
				expect(res.body._id).toExist();
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findOne({ email: newUser.email }).then((user) => {
					expect(user).toExist();
					expect(user.password).toNotBe(newUser.password);
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should return validation error if request invalid', (done) => {
		var newUser = {
			email: 'newUser@example.com',
			password: 'test'
		};

		request(app)
			.post('/users')
			.send(newUser)
			.expect(400)
			.expect((res) => {
				expect(res.body.errors.password.name).toBe('ValidatorError');
				expect(res.body.errors.password.message).toInclude('is shorter than the minimum allowed length');
			})
			.end(done);
	});

	it('Should not create user if email is used', (done) => {
		var newUser = users[0];

		request(app)
			.post('/users')
			.send(newUser)
			.expect(400)
			.expect((res) => {
				expect(res.body.errmsg).toInclude('duplicate key error collection');
			})
			.end(done);
	});
});

describe('POST /users/login', () => {
	it('Should login and return auth token', (done) => {
		var user = {
			email: users[0].email,
			password: users[0].password
		};
		request(app)
			.post('/users/login')
			.send(user)
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens[0].access).toBe('auth');
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should reject invalid login if user not found', (done) => {
		var user = {
			email: users[0].email + '1',
			password: users[0].password
		};
		request(app)
			.post('/users/login')
			.send(user)
			.expect(400)
			.end(done);
	});

	it('Should reject invalid login if password is incorrect', (done) => {
		var user = {
			email: users[0].email,
			password: users[0].password + '1'
		};
		request(app)
			.post('/users/login')
			.send(user)
			.expect(400)
			.end(done);
	});
});

describe('DELETE /users/me/token', () => {
	it('Should remove auth token on logout', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});

	it('Should remove auth token on logout, and return 401 if user ry to remove one more time same token', (done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((err) => {
				if (err) {
					return done(err);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				}).catch((e) => done(e));
			});
	});
});