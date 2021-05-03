const path = require('path');
const express = require('express');
const expbs = require('express-handlebars');
const cors = require('cors');
const sequelize = require('./config/connection');
const db = require('./config/connection');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const { passport } = require('./auth');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const hbs = expbs.create({
    defaultLayout: 'index',
    layoutsDir: path.join(__dirname, 'views'),
    partialsDir: path.join(__dirname, 'views/partials'),

    helpers: {}
});
dotenv.config();
app.use(require('cookie-parser')());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({ path: path.join(__dirname, 'sessions') }),
}));
app.use(passport.initialize());
app.use(passport.session());


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use('/bootstrap', express.static((__dirname + '/node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname + '/public')));
// app.use(require('./registration.js'));

app.use(require('./routes/blog'));
app.use(require('./routes/user'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Now listening'));