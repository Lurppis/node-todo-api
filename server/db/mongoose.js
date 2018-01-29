var mongoose = require('mongoose');
const dbName = 'TodoApp';


mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/${dbName}`);

module.exports = {
	mongoose
};