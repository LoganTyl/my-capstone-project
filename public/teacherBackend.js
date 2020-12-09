//Side Nav Icon and Controls
const burgerIcon = document.getElementsByClassName("burgerIcon");
const closeBtn = document.getElementsByClassName("closeBtn");
const sideNav = document.getElementById("teacherSideNav");
const mainContent = document.getElementById("teacherMain");

const openNav = () => {
    sideNav.style.width = "10%";
    mainContent.style.marginLeft = "10%";
    // mainContent.style.backgroundColor = "#aaa";
}

const closeNav = () => {
    sideNav.style.width = "0%";
    mainContent.style.marginLeft = "0%";
    // mainContent.style.backgroundColor = "#fff";
}

burgerIcon[0].addEventListener("click", openNav);
closeBtn[0].addEventListener("click", closeNav);

//Edit Student Controls
const extraNotesInput = document.getElementById('extraNotes');
const noteSelect = document.getElementById('editStudentNote');

const checkColors = val => {
    if(val=='other'){
        extraNotesInput.style.display='block';
    }
    else{
        extraNotesInput.style.display='none';
    }
}