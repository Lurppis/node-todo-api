const MongoClient = require('mongodb').MongoClient;


MongoClient.connect('mongodb://localhost:27017/', (err, client) => {
	if (err) {
		return console.log('Unable to connect MongoDB server.');
	}
	console.log('Connected to MongoDB');
	client.close();
});