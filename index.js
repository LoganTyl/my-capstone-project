const express = require('express');
const pug = require('pug');
const path = require('path');
const route = require('./routes/routes.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors');
const { url } = require('inspector');

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

const checkTeacherAuth = (req,res,next) => {
    if(req.session.user && req.session.user.isAuthenticated && req.session.user.isTeacher) {
        next();
    } else {
        res.redirect('/');
    }
};

const checkParentAuth = (req,res,next) => {
    if(req.session.user && req.session.user.isAuthenticated && !req.session.user.isTeacher) {
        next();
    } else {
        res.redirect('/');
    }
};

let urlencodedParser = bodyParser.urlencoded({
    extended: false
});
//Basic Pages
app.get('/', route.root);
app.get('/signIn', route.signIn);
app.post('/signIn', urlencodedParser, route.processSignIn);
app.get('/signUp', route.signUp);
app.post('/signUp', urlencodedParser, route.processSignUp);
app.get('/logout', route.logout)

//Teacher Only Pages
app.get('/teacher/home', checkTeacherAuth, route.teacherHome);
app.get('/teacher/addStudent', checkTeacherAuth, route.teacherAddStudent);
app.post('/teacher/addStudent', urlencodedParser, route.teacherProcessAddStudent);
app.get('/teacher/editStudent/:id', checkTeacherAuth, route.teacherEditStudent);
app.post('/teacher/editStudent/:id', urlencodedParser, route.teacherProcessEditStudent);
app.get('/teacher/deleteStudent/:id', urlencodedParser, route.teacherDeleteStudent);
app.get('/teacher/chatMenu', checkTeacherAuth, route.teacherChatMenu);
app.get('/teacher/chatroom/:parentId', checkTeacherAuth, route.teacherChatroom);

//Parent Only Pages
app.get('/parent/selectStudent', checkParentAuth, route.parentSelectStudent);
app.post('/parent/selectStudent', urlencodedParser, route.parentProcessSelectStudent)
app.get('/parent/home/:id', checkParentAuth, route.parentHome);
app.get('/parent/recordLog/:id', checkParentAuth, route.parentRecordLog);
app.get('/parent/emailForm/:id', checkParentAuth, route.parentEmailForm);
app.post('/parent/emailForm/:id', urlencodedParser, route.parentProcessEmailForm)
app.get('/parent/chatroom/:id', checkParentAuth, route.parentChatroom);

//Catch Statements
// app.get('/:excess', route.root);
app.listen(3000);