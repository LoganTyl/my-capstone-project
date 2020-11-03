const burgerIcon = document.getElementsByClassName("burgerIcon");
const sideNav = document.getElementById("teacherSideNav");
const mainContent = document.getElementById("teacherMain");

const openNav = () => {
    sideNav.style.width = "10%";
    mainContent.style.marginLeft = "10%";
}

burgerIcon[0].addEventListener("click", openNav);