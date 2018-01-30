require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose.js');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json()); // Setting up our middleware 

app.post('/todos', (req, res) => {
	var newTodo = new Todo({
		text: req.body.text
	});
	newTodo.save().then((doc) => {
		res.status(201).send(doc);
	}, (err) => {
		res.status(400).send(err);
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({ todos });
	}, (err) => {
		res.send(err);
	});
});

app.get('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findById(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({ todo });
	}, (err) => {
		res.send(err);
	}).catch((e) => res.send(e));

});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	if (!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if (!todo) {
			return res.status(404).send();
		}
		res.send({ todo });
	}, (err) => {
		res.status(400).send(err);
	}).catch((e) => res.send(e));
});

app.patch('/todos/:id', (req, res) => {
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

	Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
		.then((todo) => {
			if (!todo) {
				return res.status(404).send();
			}
			res.send({ todo });
		}).catch((e) => {
			res.status(404).send(e);
		});
});

var server = app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

module.exports = { app: app, server: server };

//Run app, then load http://localhost:3000 in a browser to see the output.