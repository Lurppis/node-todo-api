require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json()); // Setting up our middleware

// POST /todos		!!! AUTHENTICATE !!!
app.post('/todos', authenticate, (req, res) => {
	var newTodo = new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	newTodo.save().then((doc) => {
		res.status(201).send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

// GET /todos		!!! AUTHENTICATE !!!
app.get('/todos', authenticate, (req, res) => {
	Todo.find({
		_creator: req.user._id
	}).then((todos) => {
		res.send({ todos });
	}, (err) => {
		res.send(err);
	});
});

// GET /todos/:id		!!! AUTHENTICATE !!!
app.get('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findOne({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({ todo });
	}, (err) => {
		res.send(err);
	}).catch((e) => res.send(e));

});

// DELETE /todos/:id		!!! AUTHENTICATE !!!
app.delete('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findOneAndRemove({
		_id: id,
		_creator: req.user._id
	}).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({ todo });
	}, (err) => {
		res.status(400).send(err);
	}).catch((e) => res.send(e));
});

// PATCH /todos/:id		!!! AUTHENTICATE !!!
app.patch('/todos/:id', authenticate, (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({
		_id: id,
		_creator: req.user._id
	}, { $set: body }, { new: true })
		.then((todo) => {
			if (!todo) {
				return res.status(404).send();
			}
			res.send({ todo });
		}).catch((e) => {
			res.status(404).send(e);
		});
});

// POST /users
app.post('/users', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);
	var user = new User(body);

	user.save().then(() => {
		return user.generateAuthToken();
	}).then((token) => {
		res.header('x-auth', token).send(user);
	}).catch((e) => {
		res.status(400).send(e);
	});
});

// GET /users/me
app.get('/users/me', authenticate, (req, res) => {
	res.send(req.user);
});

// POST /users/login {email, password}
app.post('/users/login', (req, res) => {
	var body = _.pick(req.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			res.header('x-auth', token).send(user);
		});
	}).catch((e) => {
		res.status(400).send(e);
	});
});

// DELETE /users/me/token	!!! AUTHENTICATE !!!
app.delete('/users/me/token', authenticate, (req, res) => {
	req.user.removeToken(req.token).then(() => {
		res.status(200).send();
	}, () => {
		res.status(400).send();
	});
});

var server = app.listen(port, () => {
	console.log(`Example app listening on port: ${port}!`);
});

module.exports = { app: app, server: server };