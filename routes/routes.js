const bcrypt = require('bcrypt-nodejs');
const e = require('express');

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

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const makeID = length => {
    let result = "";
    for(let i = 0; i < length; i++){
        result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    return result;
}

// Redirects to sign in page if root page is called
exports.root = (req,res) => {
    res.redirect('/signIn')
};

// Get page for signing in
exports.signIn = (req,res) => {
    res.render('signIn', {
        title: "ECHOS Sign In"
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
                        req.session.user = {
                            isAuthenticated: true,
                            isTeacher: true,
                            mySqlId: queryResult.teacherId,
                            firstName: queryResult.firstName,
                            lastName: queryResult.lastName
                        }
                        res.redirect('teacher/home');
                    }
                    else{
                        req.session.user = {
                            isAuthenticated: true,
                            isTeacher: false,
                            mySqlId: queryResult.parentId,
                            firstName: queryResult.firstName,
                            lastName: queryResult.lastName
                        }
                        res.redirect('parent/selectStudent');
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
            res.redirect('/signIn');
        }
    })
};

exports.processSignUp = (req,res) => {
    //value is name value of selected radio button
    let whoIsSigningUp = req.body.signUpDescription;
    let queriedTable = "";
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
                    connection.query(`INSERT INTO Teacher (firstName,lastName,email,password,presetNotes) ` + 
                    `VALUES ('${fName}', '${lName}', '${email}', '${password}','${presetNotes}')`, (err, result) => {
                        if (err) throw err;
                    })
                }
                else{
                    connection.query(`INSERT INTO Parent (firstName,lastName,email,password) ` + 
                    `VALUES ('${fName}', '${lName}', '${email}', '${password}')`, (err, result) => {
                        if (err) throw err;
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

exports.logout = (req,res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
}

exports.teacherHome = (req,res) => {
    let currentDate = new Date();
    let month = months[currentDate.getMonth()];
    let day = String(currentDate.getDate()).padStart(2,'0');
    let year = currentDate.getFullYear();

    connection.query(`SELECT * FROM teacherandstudent WHERE teacherId=${req.session.user.mySqlId}`, (err,result) => {
        if(err) throw err;
        let idRange = "(";
        result.forEach(studentID => {
            idRange = `${idRange}${studentID.studentId},`
        });
        idRange = idRange.slice(0,-1)+')';
        connection.query(`SELECT * FROM student WHERE studentId IN ${idRange}`, (err,classResult,fields) => {
            if(err) throw err;
            // Might need to query for each student's ratings on that day
            res.render('teacherHome', {
                title: `${req.session.user.firstName}'s Home`,
                date: `${month} ${day}, ${year}`,
                myClass: classResult,
                isEmptyClass: (classResult == undefined ? true : false)
            })
        })
    })
}

exports.teacherAddStudent = (req,res) => {
    res.render('teacherAddStudent', {
        title: "Add Student"
    })
}

exports.teacherProcessAddStudent = (req,res) => {
    let firstName = req.body.fName;
    let lastName = req.body.lName;
    let parentCode = makeID(10);
    let uniqueCode = false;
    while(!uniqueCode){
        connection.query(`SELECT * FROM student WHERE parentCode='${parentCode}'`, (err,result) => {
            if(result.length == 0){ //Unique code
                uniqueCode = true;
            }
        })
    }
    connection.query(`INSERT INTO student (firstName,lastName,parentCode) ` + 
    `VALUES ('${firstName}', '${lastName}', '${parentCode}')`, (err,studentInsertResult) => {
        if(err) throw err;
        connection.query(`INSERT INTO teacherandstudent (teacherId,studentId) VALUES (${req.session.user.mySqlId}, LAST_INSERT_ID())`, (err,result) => {
            if(err) throw err;
            res.redirect('/teacher/home');
        })
    })
}

exports.teacherEditStudent = (req,res) => {
    let id = req.params.id;
    connection.query(`SELECT * FROM student WHERE studentId=${id}`, (err,studentResult) => {
        if(err) throw err;
        connection.query(`SELECT * FROM teacher WHERE teacherId=${req.session.user.mySqlId}`, (err,teacherResult) => {
            if(err) throw err;
            let presetNotes = JSON.parse(teacherResult[0].presetNotes);
            res.render('teacherEditStudent', {
                title: "Edit Student",
                student: studentResult[0],
                notes: presetNotes
            })
        })
    })
}

exports.teacherProcessEditStudent = (req,res) => {
    let id = req.params.id;
    let newFName = req.body.fName;
    let newLName = req.body.lName;
    let newNumber = req.body.rating;
    let newNote = req.body.note;
    let extraNotes = req.body.extraNotes;
    let dateNow = new Date();
    dateNow = dateNow.toISOString().split('T')[0];
    let useExtraNotes = (newNote == 'other') ? true : false;
    connection.query(`UPDATE student SET firstName='${newFName}', lastName='${newLName}' WHERE studentId=${id}`, (err,result) => {
        if(err) throw err;
        connection.query(
            `SELECT * FROM rating r ` + 
            `LEFT JOIN studentandrating sr ` +
            `ON r.ratingId = sr.ratingId ` +
            `WHERE (sr.studentId = ${id}) ` + 
            `AND (r.ratingDate = '${dateNow}')`, (err,ratingResult) => {
                if(err) throw err;
                if(ratingResult.length == 0){ // Rating for that date does not exist
                    connection.query(`INSERT INTO rating (numberRating,note,ratingDate) ` +
                    `VALUES (${newNumber},'${(useExtraNotes ? extraNotes : newNote)}','${dateNow}')`, (err,result) => {
                        if(err) throw err;
                        connection.query(`INSERT INTO studentandrating (studentId,ratingId) VALUES (${id},LAST_INSERT_ID())`,(err,result) => {
                            if(err) throw err;
                        })
                    })
                }
                else{ // Rating for that date does exist
                    connection.query(`UPDATE rating SET numberRating=${newNumber}, note='${(useExtraNotes ? extraNotes : newNote)}', '${dateNow}' WHERE ratingId=${ratingResult[0].ratingId}`, (err, updateResult) => {
                        if(err) throw err;
                    })
                }
                res.redirect('/teacher/home')
            })
    })
}

exports.teacherDeleteStudent = (req,res) => {
    let id = req.params.id;
    connection.query(`DELETE FROM student WHERE studentId=${id}`, (err,result) => {
        if(err) throw err;
        connection.query(`DELETE FROM teacherandstudent WHERE studentId=${id}`, (err,result) => {
            if(err) throw err;
            res.redirect('/teacher/home');
        })
    })
}

exports.teacherChatMenu = (req,res) => {
    connection.query(
        `SELECT p.parentId, p.firstName, p.lastName FROM parent p ` + 
        `LEFT JOIN parentandstudent ps ` + 
        `ON p.parentId = ps.parentId ` + 
        `LEFT JOIN student s ` + 
        `ON ps.studentId = s.studentId ` + 
        `LEFT JOIN teacherandstudent ts ` +
        `ON ts.studentId = s.studentId ` + 
        `WHERE ts.teacherId=${req.session.user.mySqlId}`, (err,result) => {
            if(err) throw err;
            console.log(result);
            res.render('teacherChatMenu', {
                title: "Choose Parent to Chat With",
                parents: result,
                studentsHaveParents: (result.length > 0 ? true : false)
            })
        })
}

exports.teacherChatroom = (req,res) => {
    res.render('teacherChatroom', {
        title: "Chatroom"
    })
}

exports.parentSelectStudent = (req,res) => {
    connection.query(`SELECT * FROM parentandstudent WHERE parentId=${req.session.user.mySqlId}`, (err,result) => {
        if(err) throw err;
        console.log(result);
        let idRange = "(";
        if(result.length > 0){
            result.forEach(studentID => {
                idRange = `${idRange}${studentID.studentId},`
            });
            idRange = idRange.slice(0,-1)+')';
        }
        else{
            idRange += ")";
        }
        connection.query(`SELECT * FROM student WHERE studentId IN ${idRange};`, (err,studentResult,fields) => {
            res.render('parentSelectStudent', {
                title: "Select Student",
                students: studentResult,
                isEmptyStudents: (studentResult == undefined ? true : false)
            })
        })
    })
}

exports.parentProcessSelectStudent = (req,res) => {
    let inputtedCode = req.body.studentCode;
    connection.query(`SELECT * FROM student WHERE parentCode='${inputtedCode}' LIMIT 1`,(err,getStudentWithCode) => {
        if(err) throw err;
        if(getStudentWithCode.length > 0) {
            connection.query(`INSERT INTO parentandstudent (parentId,studentId) VALUES (${req.session.user.mySqlId}, ${getStudentWithCode[0].studentId})`, (err,result) => {
                if(err) throw err;
                res.redirect('/parent/selectStudent');
            })
        }
        else{
            //Error message for student not found
            res.redirect('back');
        }
    })
}

exports.parentHome = (req,res) => {
    let id = req.params.id;
    let ratingAndDateArray = [];
    connection.query(`SELECT * FROM student WHERE studentId=${id} LIMIT 1`, (err, getStudentResult) => {
        if(err) throw err;
        connection.query(
            `SELECT * FROM rating r ` + 
            `LEFT JOIN studentandrating sr ` + 
            `ON r.ratingId = sr.ratingId ` +
            `WHERE (sr.studentId = ${id}) AND ` +
            `r.ratingDate = ` +
            `(SELECT max(r1.ratingDate) ` +
            `FROM rating r1 ` + 
            `WHERE r1.ratingId = r.ratingId) LIMIT 5;`, (err,getRatingsResult) => {
                if(err) throw err;
                if(getRatingsResult.length < 5){
                    let fillerAmt = 5 - getRatingsResult.length;
                    for(let i = 0; i < fillerAmt; i++){
                        ratingAndDateArray.push('N/A');
                    }
                }
                getRatingsResult.forEach(ratingAndDateResult => {
                    let dbRating = ratingAndDateResult.numberRating;
                    let jsDate = new Date(ratingAndDateResult.ratingDate);
                    let month = String(jsDate.getMonth() + 1);
                    let day = String(jsDate.getDate());
                    let inputValue = `${dbRating};${month}/${day}`;
                    ratingAndDateArray.push(inputValue);
                });
                console.log(ratingAndDateArray);
                res.render('parentHome', {
                    title: `${getStudentResult[0].firstName}'s Page`,
                    id: getStudentResult[0].studentId,
                    ratings: ratingAndDateArray
                })
            })
    })
}

exports.parentRecordLog = (req,res) => {
    let id = req.params.id;
    connection.query(
        `SELECT * FROM rating r ` +
        `LEFT JOIN studentandrating sr ` + 
        `ON r.ratingId = sr.ratingId ` +
        `WHERE sr.studentId=${id}`, (err,result) => {
            res.render('parentRecordLog', {
                title: "Student's Records",
                ratings: result,
                areAnySavedRatings: (result.length > 0 ? true : false),
                id: id
            })
        })
}

exports.parentEmailForm = (req,res) => {
    let id = req.params.id;
    connection.query(`SELECT * FROM parent WHERE parentId=${req.session.user.mySqlId} LIMIT 1`, (err,result) => {
        if(err) throw err;
        connection.query(
            `SELECT t.firstName, t.lastName, t.email FROM teacher t ` +
            `LEFT JOIN teacherandstudent ts ` + 
            `ON t.teacherId = ts.teacherId ` + 
            `LEFT JOIN student s ` + 
            `ON ts.studentId = s.studentId ` +
            `LEFT JOIN parentandstudent ps ` +
            `ON s.studentId = ps.studentId ` +
            `WHERE ps.parentId = ${req.session.user.mySqlId} LIMIT 1`, (err,teacherResult) => {
                console.log(result);
                console.log(teacherResult);
                res.render('parentEmailForm', {
                    title: `Send an Email To ${teacherResult[0].firstName} ${teacherResult[0].lastName}`,
                    id: id,
                    parent: result[0],
                    teacher: teacherResult[0]
                })
            })
    })
}

exports.parentProcessEmailForm = (req,res) => {
    let id = req.params.id;
    res.redirect(`/parent/home/${id}`);
}

exports.parentChatroom = (req,res) => {
    res.render('parentChatroom', {
        title: "Chatroom",
        id: id
    })
}