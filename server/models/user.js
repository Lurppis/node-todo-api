const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
	email: {
		type: String,
		require: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: (value) => {
				return validator.isEmail(value);
			},
			message: '{VALUE} is not valid'
		},
	},
	password: {
		type: String,
		require: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			require: true
		},
		token: {
			type: String,
			require: true
		}
	}]

});

module.exports = {User};