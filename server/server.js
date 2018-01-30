const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose.js');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

const app = express();
var port = process.env.PORT || 3000;

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
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}
	Todo.findById(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send({ todo });
	}, (err) => {
		res.send(err);
	}).catch((e) => res.send(e));

});

app.delete('/todos/:id', (req, res) => {
	var id = req.params.id;
	console.log(id);
	if(!ObjectID.isValid(id)) {
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((todo) => {
		if(!todo) {
			return res.status(404).send();
		}
		res.send(todo);
	}, (err) => res.status(400).send(err));
}).catch((e) => res.send(e));

var server = app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`);
});

module.exports = { app: app, server: server };

//Run app, then load http://localhost:3000 in a browser to see the output.