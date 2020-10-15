const express = require('express');
const pug = require('pug');
const path = require('path');
const route = require('./routes/routes.js');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');

let app = express();

app.use(cors());

app.set('view engine', 'pug');
app.set('views', __dirname+'/views');

app.use(express.static(path.join(__dirname+'/public')));
app.use(cookieParser(("pass")));
app.use(expressSession({
    secret:"pass",
    saveUninitialized: true,
    resave: true
}));

let urlencodedParser = bodyParser.urlencoded({
    extended: false
});

app.get('/', route.root);
app.get('/signIn', route.signIn);
app.get('/signUp', route.signUp);

app.listen(3000);