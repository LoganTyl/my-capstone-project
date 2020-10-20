const bcrypt = require('bcrypt-nodejs');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "capstone_db",
    port: 3308
});
connection.connect(err => {
    if(err) throw err;
});

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
    connection.query(`SELECT * FROM ${whoIsSigningIn} WHERE email='${req.body.email}'`, (err, result, fields) => {
        if (err) throw err;
        if (result.length > 0) {
            queryResult = result[0];
            bcrypt.compare(`${req.body.password}`, queryResult.password, (err,response) => {
                // Add similar response to one above
                if(response){
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
                    // Incorrect password
                    res.redirect('/signIn');
                }
            })
        }
        else{
            // Incorrect email
        }
    })
};

exports.processSignUp = (req,res) => {
    //value is name value of selected radio button
    let whoIsSigningUp = req.body.signUpDescription;
    let queriedTable = "";
    let queryResult;
    let fName;
    let lName;
    let email;
    let password;
    let myHash;
    if(whoIsSigningUp === "teacher"){
        queriedTable = "Teacher"
    }
    else if(whoIsSigningUp === "parent"){
        queriedTable = "Parent"
    }
    else {
        // Error should never be thrown unless name values on signUp page are altered
        throw new Error("Invalid Sign Up");
    }
    connection.query(`SELECT * FROM ${whoIsSigningUp} WHERE email='${req.body.email}'`, (err, result, fields) => {
        if (err) throw err;
        console.log(result);
        if(result.length == 0){
            bcrypt.hash(req.body.password, null, null, (err,hash) => {
                myHash = hash;
                fName = req.body.fName;
                lName = req.body.lName;
                email = req.body.email;
                password = myHash;
                if(queriedTable === "Teacher"){
                    let presetNotes = ["Good day", "Did not get much work done", "Had trouble listening"];
                    presetNotes = JSON.stringify(presetNotes);
                    connection.query(`INSERT INTO Teacher (firstName,lastName,email,password,classOfStudents,presetNotes) ` + 
                    `VALUES ('${fName}', '${lName}', '${email}', '${password}', '[]', '${presetNotes}')`, (err, result) => {
                        if (err) throw err;
                        console.log("Teacher inserted");
                        queryResult = result;
                    })
                }
                else{
                    connection.query(`INSERT INTO Parent (firstName,lastName,email,password,savedStudents) ` + 
                    `VALUES ('${fName}', '${lName}', '${email}', '${password}', '[]')`, (err, result) => {
                        if (err) throw err;
                        console.log("Parent inserted");
                        queryResult = result;
                    })
                }
                res.redirect('/signIn')
            })
        }
        else{
            // Account with that email already exists
            res.redirect('/signIn')
        }
    })
};