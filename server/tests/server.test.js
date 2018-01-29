const expect = require('expect');
const request = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

// Will delete all documents to make sure that test will execute correctly
beforeEach((done) => {
	Todo.remove({}).then(() => done());
});

describe('Positive test server', () => {
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
				Todo.find().then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			});
	});

});

describe('Negative test server', () => {

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