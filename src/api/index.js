const AuthRouter = require("./routes/api/authrouter.js");
const UiRouter = require("./routes/ui/uirouter.js");
const UsersRouter = require("./routes/api/usersrouter");
const WorldRouter = require('./routes/api/worldrouter');

const mongoose = require("mongoose");
const mongodb_host = process.env.MONGODB_HOST || "mongodb";
const mongodb_db_name = process.env.MONGODB_DB_NAME || "rptools";
mongoose.connect(`mongodb://${mongodb_host}/${mongodb_db_name}`, { useNewUrlParser: true });

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const uuidv4 = require('uuid/v4');
const passportConfig = require('./passport');
passportConfig.setupPassport();

const morgan = require('morgan');

let app = express();
const port = process.env.API_PORT || 3000;

app.use(morgan('tiny'));
app.use(session({ secret: uuidv4(), cookie: {maxAge: 1000 * 60 * 5} }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.redirect('/ui');
});
app.use("/ui", UiRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/users', passportConfig.loggedInMiddleware, UsersRouter);
app.use('/api/worlds', WorldRouter);

app.listen(port, () => console.log(`listening on port ${port}`));
