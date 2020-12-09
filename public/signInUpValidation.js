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

const passwordWarning = document.getElementById("passwordWarning");
const passwordConfirmWarning = document.getElementById("passwordConfirmWarning");
const emailWarning = document.getElementById("emailWarning");

const passwordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$");
// Min 8 characters, one uppercase letter, one lowercase letter, one special character

const emailPattern = new RegExp("^\\S+@\\S+\\.\\S+$");
// Must have @ and .

let canSignUp = false;

const checkSignIn = () => {
    if(emailSignIn.value.trim() === "" || passwordSignIn.value.trim() === "" || !(teacherSignIn.checked || parentSignIn.checked)){
        return false;
    }
    return true;
};

const checkSignUp = () => {
    if(fNameSignUp.value.trim() === "" || lNameSignUp.value.trim() === "" || passwordSignUp.value.trim() === "" || 
    passwordConfirmSignUp.value.trim() === "" || emailSignUp.value.trim() === "" || !(teacherSignUp.checked || parentSignUp.checked)){
        return false;
    }
    if(passwordSignUp.value !== passwordConfirmSignUp.value){
        return false;
    }
    if(!canSignUp){
        return false;
    }
    return true;
};

const validateEmail = () => {
    let emailInput = emailSignUp.value;
    let result = emailPattern.test(emailInput);
    if(result){
        emailWarning.style.display = "none";
        canSignUp = true;
    }
    else{
        emailWarning.style.display = "block";
        canSignUp = false;
    }
}

const validatePassword = () => {
    let passInput = passwordSignUp.value;
    let result = passwordPattern.test(passInput);
    console.log(passInput)
    console.log(result)
    if(result){
        passwordWarning.style.display = "none";
        canSignUp = true;
    }
    else{
        passwordWarning.style.display = "block";
        canSignUp = false;
    }
}

const validateConfirmPassword = () => {
    let confirmInput = passwordConfirmSignUp.value;
    let passInput = passwordSignUp.value;
    if(confirmInput === passInput){
        passwordConfirmWarning.style.display = "none";
        canSignUp = true;
    }
    else{
        passwordConfirmWarning.style.display = "block";
        canSignUp = false;
    }
}

emailSignUp.addEventListener('input', validateEmail);
passwordSignUp.addEventListener('input', validatePassword);
passwordConfirmSignUp.addEventListener('input', validateConfirmPassword);