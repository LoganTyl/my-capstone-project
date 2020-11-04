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

const checkAuth = (req,res,next) => {
    if(req.session.user && req.session.user.isAuthenticated) {
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
app.get('/teacher/home', checkAuth, route.teacherHome);
app.get('/teacher/addStudent', checkAuth, route.teacherAddStudent);
// app.post('/teacher/addStudent', urlencodedParser, route.teacherProcessAddStudent);
app.get('/teacher/editStudent', checkAuth, route.teacherEditStudent);
// app.put('/teacher/editStudent', urlencodedParser, route.teacherProcessEditStudent);
// app.delete('/teacher/editStudent', urlencodedParser, route.teacherDeleteStudent);
app.get('/teacher/chatMenu', checkAuth, route.teacherChatMenu);
app.get('/teacher/chatroom', checkAuth, route.teacherChatroom);

//Parent Only Pages
app.get('/parent/selectStudent', checkAuth, route.parentSelectStudent);
app.get('/parent/home', checkAuth, route.parentHome);
app.get('/parent/recordLog', checkAuth, route.parentRecordLog);
app.get('/parent/emailForm', checkAuth, route.parentEmailForm);
app.get('/parent/chatroom', checkAuth, route.parentChatroom);
app.listen(3000);