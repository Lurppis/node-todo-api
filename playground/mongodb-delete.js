const { MongoClient } = require('mongodb');

const dbName = 'Todos';
const collectionName = 'Todos';

MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
	if (err) {
		return console.log('Unable to connecto to database: ' + err);
	}
	console.log('Connected to database');

	// Prepare database
	var data = [];
	for (let i = 0; i < 10; i++) {
		data.push({
			name: 'Marcin',
			age: 25 + i,
			location: 'Poland',
			complited: false
		});
	}
	console.log('Preparing database');
	client.db(dbName).collection(collectionName).insertMany(data);

	//Delete one search for first and delete it
	client.db(dbName).collection(collectionName).deleteOne({ location: 'Poland' })
		.then((res) => {
			console.log('Yeah we did it: ' + res);
		}, (err) => {
			console.log('Unable to delete that task' + err);
		});

	// Find one and delete
	client.db(dbName).collection(collectionName).findOneAndDelete({ name: 'Marcin' })
		.then((res) => {
			console.log('Yeah we did it: ' + JSON.stringify(res, undefined, 2));
		}, (err) => {
			console.log('Unable to delete:' + err);
		});
		
	// Delete many
	client.db(dbName).collection(collectionName).deleteMany({ name: 'Marcin' })
		.then((res) => {
			console.log(res);
		}, (err) => {
			console.log('Unable to delete as many as you want' + err);
		});
	client.close();
});