const mongoose = require("mongoose");
const mongodb_host = process.env.MONGODB_HOST || "mongodb";
const mongodb_db_name = process.env.MONGODB_DB_NAME || "worldforge";
mongoose.connect(`mongodb://${mongodb_host}/${mongodb_db_name}`, { useNewUrlParser: true });

const express = require("express");
const session = require("express-session");
const fileUpload = require('express-fileupload');
const RedisStore = require('connect-redis')(session);
const bodyParser = require("body-parser");
const passport = require("passport");
const uuidv4 = require('uuid/v4');
const passportConfig = require('./passport');
passportConfig.setupPassport();

const morgan = require('morgan');

let app = express();
const port = process.env.API_PORT || 3000;

const redisHost = process.env.REDIS_HOST || 'redis';

app.use(morgan('tiny'));
app.use(session({ store: new RedisStore({host: redisHost}), secret: 'super secret', cookie: {maxAge: 1000 * 60 * 5} }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

app.get('/', (req, res) => {
	res.redirect('/ui');
});

const AuthRouter = require("./routes/api/authrouter");
const UiRouter = require("./routes/ui/uirouter");
const UsersRouter = require("./routes/api/usersrouter");
const WorldRouter = require('./routes/api/worldrouter');
const WikiPageRouter = require('./routes/api/wikipagerouter');
const ImageRouter = require('./routes/api/imagerouter');
const ChunkRouter = require('./routes/api/chunkrouter');
const WikiFolderRouter = require('./routes/api/wikifolderrouter');

app.use("/ui", UiRouter);
app.use('/api/auth', AuthRouter);
app.use('/api/users', UsersRouter);
app.use('/api/worlds', WorldRouter);
app.use('/api/wikiPages', WikiPageRouter);
app.use('/api/images', ImageRouter);
app.use('/api/chunks', ChunkRouter);
app.use('/api/wikiFolders', WikiFolderRouter);

app.listen(port, () => console.log(`listening on port ${port}`));
