const ObjectID = require('mongodb').ObjectID;

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');

var id = '5a6f5ae2d396311bd8d2103d';

if(!ObjectID.isValid(id)) {
	console.log('Id not valid');
}

// Return array of object in our case one object.
Todo.find({
	_id: id
}).then((todos) => {
	console.log('Todos', todos);
});

// Return one object
Todo.findOne({
	_id: id
}).then((todo) => {
	console.log('Todo', todo);
});

Todo.findById(id).then((todo) => {
	if (!todo) { return console.log('Id not found'); }
	console.log('Todo', todo);
}, (err) => {
	console.log(err);
}).catch((e) => console.log(e));
