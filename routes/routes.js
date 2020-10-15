const bcrypt = require('bcrypt-nodejs');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "capstone_db"
})

// connection.connect() to start
// connection.end() to end

// Redirects to sign in page if root page is called
exports.root = (req,res) => {
    res.redirect('/signIn')
};

// Get page for signing in
exports.signIn = (req,res) => {
    res.render('signIn', {
        title: "Sign In"
    })
};

// Get page for signing up
exports.signUp = (req,res) => {
    res.render('signUp', {
        title: "Create An Account"
    })
};

exports.processSignIn = (req,res) => {
    //value is name value of selected radio button
    let whoIsSigningIn = req.body.signInDescription;
    let queriedTable = "";
    let queryResult;
    let isValidSignIn = false;
    if(whoIsSigningIn === "teacher"){
        queriedTable = "Teacher"
    }
    else if(whoIsSigningIn === "parent"){
        queriedTable = "Parent"
    }
    else {
        // Error should never be thrown unless name values on signIn page are altered
        throw new Error("Invalid Sign In");
    }
    connection.connect();
    connection.query(`SELECT * FROM ${whoIsSigningIn} WHERE email='${req.body.email}'`, (err, result, fields) => {
        queryResult = result[0];
        bcrypt.compare(`${req.body.password}`, queryResult.password, (err,response) => {
            if(response){
                isValidSignIn = true;
            }
        })
    })
    connection.end();
    if(isValidSignIn){
        if(queriedTable === "Teacher"){
            res.render('signIn', {
                title: "Teacher" + queryResult
            })
        }
        else{
            res.render('signIn', {
                title: "Parent" + queryResult
            })
        }
    }
    else{
        res.redirect('/signIn');
    }
};

exports.processSignUp = (req,res) => {

};