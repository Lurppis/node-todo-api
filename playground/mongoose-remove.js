//const ObjectID = require('mongodb').ObjectID;

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

// Get first match and remove it
Todo.findOneAndRemove({}).then((res) => {
	console.log(res);
});

// Get one with ID and remove it
Todo.findByIdAndRemove(id).then((todo) => {
	console.log(todo);
});

// Remove all docs
Todo.remove({}).then((res) => {
	console.log(res);
});