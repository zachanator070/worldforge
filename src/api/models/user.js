const sha256 = require('js-sha256');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setPassword = (password) => {
	return sha256.sha256(password);
};

const userSchema = Schema({
	email: String ,
	password_hash: { type: String, set: setPassword},
	currentWorld: String
});

userSchema.methods.validPassword = function (password) {
	return sha256.sha256(password) === this.password_hash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
