const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();
console.log(obj); // Has timestamp, machine, random number


MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
	if (err) {
		return console.log('Unable to connect MongoDB server.');
	}
	console.log('Connected to MongoDB');
	client.close();
});