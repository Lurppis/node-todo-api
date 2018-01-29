const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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


app.listen(3000, () => {
	console.log('App listening on port port!');
});

//Run app, then load http://localhost:port in a browser to see the output.