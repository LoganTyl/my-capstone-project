const express = require('express');
const pug = require('pug');
const path = require('path');
const route = require('./routes/routes.js');
const bodyParser = require('body-parser');
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
//Basic Pages
app.get('/', route.root);
app.get('/signIn', route.signIn);
app.post('/signIn', urlencodedParser, route.processSignIn);
app.get('/signUp', route.signUp);
app.post('/signUp', urlencodedParser, route.processSignUp);

//Teacher Only Pages
app.get('/teacher/home', route.teacherHome);
app.get('/teacher/addStudent', route.teacherAddStudent);
app.post('/teacher/addStudent', urlencodedParser, route.teacherProcessAddStudent);
app.get('/teacher/editStudent', route.teacherEditStudent);
app.post('/teacher/editStudent', urlencodedParser, route.teacherProcessEditStudent);
app.delete('/teacher/editStudent', urlencodedParser, route.teacherDeleteStudent);
app.get('/teacher/chatMenu', route.teacherChatMenu);
app.get('/teacher/chatroom', route.teacherChatroom);

//Parent Only Pages

app.listen(3000);