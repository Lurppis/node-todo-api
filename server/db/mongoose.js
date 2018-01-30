var mongoose = require('mongoose');
const dbName = 'TodoApp';

let db = {
	localhost: `mongodb://localhost:27017/${dbName}`,
	mlab: 'mongodb://admin:Apd7id9w@ds219318.mlab.com:19318/todo-app'
};

mongoose.Promise = global.Promise;
mongoose.connect(db.mlab || db.localhost);

module.exports = {
	mongoose
};