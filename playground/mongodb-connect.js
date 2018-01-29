const MongoClient = require('mongodb').MongoClient;
const dbName = 'Todos';
MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
	if (err) {
		return console.log('Unable to connect MongoDB server.');
	}
	console.log('Connected to MongoDB');

	var col = client.db(dbName).collection('Todos');
	// col.insert({
	// 	text: 'Something to do',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('Unable to insert Todo');
	// 	}
	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	// client.db(dbName).collection('Users')
	// 	.insert({
	// 		name: 'Marcin',
	// 		age: 25,
	// 		location: 'Poland'
	// 	}, (err, result) => {
	// 		if (err) {
	// 			return console.log('Unable to insert User');
	// 		}
	// 		console.log(JSON.stringify(result.ops, undefined, 2));
	// 	});

	client.close();
});