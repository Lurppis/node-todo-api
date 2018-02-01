const JWT = require('jsonwebtoken');

var data = {
	id: 10
};

var token = JWT.sign(data, 'secret');
console.log(token);

var decoded = JWT.verify(token, 'secret');
console.log(decoded);