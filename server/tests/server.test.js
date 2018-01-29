const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const dummyTodos = [
	{
		_id: new ObjectID(),
		text: 'First test todo'
	}, {
		_id: new ObjectID(),
		text: 'Second test todo'
	}, {
		_id: new ObjectID(),
		text: 'Third test todo'
	}
];

// Will delete all documents to make sure that test will execute correctly
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(dummyTodos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('Should create new todo', (done) => {
		var text = 'Test todo text2';

		request(app)
			.post('/todos')
			.send({
				text
			})
			.expect(201)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
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
		var emptyText = '';
		request(app)
			.post('/todos')
			.send({
				text: emptyText
			})
			.expect(400)
			.end((err, res) => {
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
			.expect(200)
			.expect((res) => {
				expect(res.body.todos.length).toBe(dummyTodos.length);
			})
			.end(done);
	});
});

describe('GET /todos/:id', () => {

	it('Should return existed todo with valid ID', (done) => {
		var id = dummyTodos[0]._id.toHexString();
		request(app)
			.get(`/todos/${id}`)
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
			.expect(404)
			.end(done);
	});

	it('Should return 404 if id not valid', (done) => {
		var id = 'qwert123456';
		request(app)
			.get(`/todos/${id}`)
			.expect(404)
			.end(done);
	});
});