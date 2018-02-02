const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const dummyTodos = [
	{
		_id: new ObjectID(),
		text: 'First test todo',
		_creator: userOneId
	}, {
		_id: new ObjectID(),
		text: 'Second test todo',
		_creator: userTwoId
	}, {
		_id: new ObjectID(),
		text: 'Third test todo',
		completed: true,
		completedAt: 123456789,
		_creator: userOneId
	}
];

const users = [{
	_id: userOneId,
	email: 'marcin@example.com',
	password: 'password123',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}, {
	_id: userTwoId,
	email: 'jen@example.com',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString()
	}]
}];

const populateTodos = (done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(dummyTodos);
	}).then(() => done());
};

const populateUsers = (done) => {
	User.remove({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();
		
		return Promise.all([userOne, userTwo]);
	}).then(() => { done(); });
};

module.exports = {dummyTodos, populateTodos, users, populateUsers};