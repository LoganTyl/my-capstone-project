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