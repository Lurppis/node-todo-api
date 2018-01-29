const { MongoClient, ObjectID } = require('mongodb');

const dbName = 'Todos';
const collectionName = 'Todos';

MongoClient.connect('mongodb://localhost/', (err, client) => {
	if (err) return console.log('Unable to connect to database: ' + err);

	console.log('Successfully connected!');

	// Update document with id #5a6ed419cf2c4704608bb156
	client.db(dbName).collection(collectionName).findOneAndUpdate({
		_id: new ObjectID('5a6ed419cf2c4704608bb156')
	}, {
		$set: {
			text: 'Something to not to do'
		}
	}, {
		returnOriginal: false
	}).then((res) => {
		console.log(res);
	}, (err) => {
		console.log('Unable to update document' + err);
	});

	// Update document from Users where name is Marcin to Mariusz and increment his age by 2
	// also decrement dog -> bulldog by 3

	/**
	 * Structure:
	 * {
    		"_id" : ObjectId("5a6ed4c1b1cf4604954990f6"),
    		"name" : "Marcin",
    		"age" : 25,
    		"location" : "Poland",
    		"dogs" : {
    		    "bulldog" : 6
    		}
	}
	 */

	client.db(dbName).collection('Users').findOneAndUpdate({
		name: 'Marcin'
	}, {
		$set: { name: 'Mariusz' },
		$inc: { age: 2, 'dogs.bulldog': -3 }
	}).then((res) => {
		console.log(res);
	}, (err) => {
		console.log('Unable to update database' + err);
	});

	client.close();
});