const crypto = require('crypto');

module.exports.userPresave = async(req, res, next) => {
	//  creamos variable pwd que será igual al password tecleado en la pagina

	console.log('middleware called');
	let pwd = req.body.password;
	if(!pwd) {
		return res.status(422).send({ message: 'Error, password is obligatory' }); 
	}

	let password = this.hashPassword(pwd);
	req.body.password = password;
	next();
};

module.exports.authenticate = (passwordBody, password) => {
	return password === this.hashPassword(passwordBody);
};

module.exports.hashPassword = (pwd) => {
	if(process.env.SECRET_SALT && pwd) {
	  return crypto.pbkdf2Sync(pwd, new Buffer(process.env.SECRET_SALT, 'base64'), 10000, 64, 'SHA1').toString('base64');
	}
};
//this.userPresave({ body: { password: '123456' } });