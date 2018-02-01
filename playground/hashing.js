const {SHA256} = require('crypto-js');

var message = 'Im user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`, `Hash: ${hash}`);

var data = {
	id: 4
};
var token = {
	data,
	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();  // Salting data with secret phrase

if(resultHash === token.hash) {
	console.log('Data was not changed');
	console.log(token.data);
} else {
	console.log('Data was changed!!!');
}

token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();
if(resultHash === token.hash) {
	console.log('Data was not changed');
	console.log(token.data);
} else {
	console.log('Data was changed!!!');
}

// All this is called Json Web Toket (JWT) !!!