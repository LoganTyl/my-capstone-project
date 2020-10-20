// Sign In Page
const emailSignIn = document.getElementById("signInEmail");
const passwordSignIn = document.getElementById("signInPassword");
const teacherSignIn = document.getElementById("signInAsTeacher");
const parentSignIn = document.getElementById("signInAsParent");
// Sign Up Page
const fNameSignUp = document.getElementById("signUpFName");
const lNameSignUp = document.getElementById("signUpLName");
const passwordSignUp = document.getElementById("signUpPassword");
const passwordConfirmSignUp = document.getElementById("signUpPasswordConfirm");
const emailSignUp = document.getElementById("signUpEmail");
const teacherSignUp = document.getElementById("signUpAsTeacher");
const parentSignUp = document.getElementById("signUpAsParent");


const checkSignIn = () => {
    if(emailSignIn.value.trim() === "" || passwordSignIn.value.trim() === "" || !(teacherSignIn.checked || parentSignIn.checked)){
        return false;
    }
    return true;
};

const checkSignUp = () => {
    if(fNameSignUp.value.trim() === "" || lNameSignUp.value.trim() === "" || passwordSignUp.value.trim() === "" || 
    passwordConfirmSignUp.value.trim() === "" || emailSignUp.value.trim() === "" || !(teacherSignUp.checked || parentSignUp.checked)){
        console.log("Empty field");
        return false;
    }
    if(passwordSignUp.value !== passwordConfirmSignUp.value){
        console.log(`Passwords don't match ${passwordSignUp} and ${passwordConfirmSignUp}`);
        return false;
    }
    return true;
};