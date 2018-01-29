const { MongoClient, ObjectID } = require('mongodb');
const dbName = 'Todos';
MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
	if (err) {
		return console.log('Unable to connect MongoDB server.');
	}
	console.log('Connected to MongoDB');

	// Access to collection find only completed task
	client.db(dbName).collection(dbName).find({ completed: false }).toArray()
		.then((docs) => {
			console.log('Todos');
			console.log(JSON.stringify(docs, undefined, 2));
		}, (err) => {
			console.log('Unable to fetch docs', err);
		});

	// Access to collection to find task with specified ID
	client.db(dbName).collection(dbName).find({
		_id: new ObjectID('5a6edceeb3e1c9fb8a91d4b0')
	}).toArray()
		.then((docs) => {
			console.log('Todos');
			console.log(JSON.stringify(docs, undefined, 2));
		}, (err) => {
			console.log('Unable to fetch docs', err);
		});

	client.close();
});