const express = require('express');
const bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose.js');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

const app = express();

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
		res.send({todos});
	}, (err) => {
		res.send(err);
	});
});

var server = app.listen(3000, () => {
	console.log('Example app listening on port 3000!');
});

module.exports = { app: app, server: server };

//Run app, then load http://localhost:port in a browser to see the output.