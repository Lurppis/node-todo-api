var mongoose = require('mongoose');
const dbName = 'TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/${dbName}`);


// In future move it to Shemas folder and use it 
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		require: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

var newTodo = new Todo({
	text: 'Cook dinnet'
});

var newTodo2 = Todo({
	text: 'Test',
	completed: false,
	completedAt: 0
});

newTodo.save().then((res) => {
	console.log(res);
}, (err) => {
	console.log('Unable to save task', err);
});

newTodo2.save().then((res) => {
	console.log('Saved ', JSON.stringify(res,undefined,2));
}, (err) => {
	console.log('Unable to save', err);
});

//mongoose.disconnect();