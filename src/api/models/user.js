const sha256 = require('js-sha256');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setPassword = (password) => {
	return sha256.sha256(password);
};

const userSchema = Schema({
	email: {
		type: String,
		required: [true, 'email field required']
	},
	displayName: {
		type: String,
		required: [true, 'displayName field required']
	},
	password_hash: {
		type: String,
		required: [true, 'password_hash missing'],
		set: setPassword},
	currentWorld: {
		type: mongoose.Schema.ObjectId,
		ref: 'World'
	}
});

userSchema.methods.validPassword = function (password) {
	return sha256.sha256(password) === this.password_hash;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
