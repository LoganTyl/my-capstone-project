//Side Nav Access and Controls
const burgerIcon = document.getElementsByClassName("burgerIcon");
const closeBtn = document.getElementsByClassName("closeBtn");
const sideNav = document.getElementById("parentSideNav");
const mainContent = document.getElementById("parentMain");

const openNav = () => {
    sideNav.style.width = "10%";
    mainContent.style.marginLeft = "10%";
    mainContent.style.backgroundColor = "#aaa";
}

const closeNav = () => {
    sideNav.style.width = "0%";
    mainContent.style.marginLeft = "0%";
    mainContent.style.backgroundColor = "#fff";
}

burgerIcon[0].addEventListener("click", openNav);
closeBtn[0].addEventListener("click", closeNav);

//Email Form Controls
const emailFormBtn = document.getElementById("emailBtn");
const parentEmail = document.getElementById("emailFormEmail");
const teacherEmail = document.getElementById('emailFormTeacherEmail');
const emailFormSubject = document.getElementById("emailFormSubject");
const emailBody = document.getElementById("emailFormBody");

const processingEmail = () => {
    alert('Email has been sent successfully');
    return true;
}

const sendEmail = () => {
    Email.send({
        Host : "smtp.gmail.com", //now deleted
        Username : "echos.noreply@gmail.com", //sender email
        Password : "FphFZ$my26!nWSU9", //sender password
        To : `${teacherEmail.value}`,
        From : `echos.noreply@gmail.com`,
        Subject : `${emailFormSubject.value}`,
        Body : `${emailBody.value}`
    }).then(
        processingEmail()
    );
}