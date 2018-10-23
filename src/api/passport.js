const User = require('./models/user.js');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

function setupPassport(){
	passport.use('local-login', new LocalStrategy(
		{
			usernameField : 'email',
			passwordField : 'password'
		},
		function(email, password, done) {
			User.findOne({ email: email }, function (err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { error: 'Incorrect username.' });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { error: 'Incorrect password.' });
				}
				return done(null, user);
			});
		}
	));

	passport.use('local-signup', new LocalStrategy(
		{
			usernameField : 'email',
			passwordField : 'password',
		},
		function(email, password, done) {

			// asynchronous
			// User.findOne wont fire unless data is sent back
			process.nextTick(function() {

				// find a user whose email is the same as the forms email
				// we are checking to see if the user trying to login already exists
				User.findOne({ 'email' :  email }, function(err, user) {
					// if there are any errors, return the error
					if (err)
						return done(err);

					// check to see if theres already a user with that email
					if (user) {
						return done(null, false, { error: 'That email is already taken.' });
					} else {

						// if there is no user with that email
						// create the user
						var newUser = new User();

						// set the user's local credentials
						newUser.email = email;
						newUser.password_hash = password;

						// save the user
						newUser.save(function(err) {
							if (err)
								throw err;
							return done(null, newUser);
						});
					}

				});

			});

		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
}

function loggedInMiddleware(req, res, next) {
	if (req.user) {
		return next();
	} else {
		return res.status(403).json({error: 'Unauthorized, please log in to start a session'});
	}
}

module.exports.setupPassport = setupPassport;
module.exports.loggedInMiddleware = loggedInMiddleware;