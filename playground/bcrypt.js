const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
	bcrypt.hash(password, salt, (err, hash) => {
		console.log(hash);
	});
});

var hashedPassword = '$2a$10$XIWLI073.2X71yMiWSsj0.ZykufdAvasr5Jzho45EddLxMIHUt/OK';

bcrypt.compare(password, hashedPassword, (err, result) => {
	console.log('Is password correct', result);
});