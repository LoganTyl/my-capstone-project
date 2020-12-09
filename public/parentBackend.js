//Side Nav Access and Controls
const burgerIcon = document.getElementsByClassName("burgerIcon");
const closeBtn = document.getElementsByClassName("closeBtn");
const sideNav = document.getElementById("parentSideNav");
const mainContent = document.getElementById("parentMain");

const openNav = () => {
    sideNav.style.width = "10%";
    mainContent.style.marginLeft = "10%";
}

const closeNav = () => {
    sideNav.style.width = "0%";
    mainContent.style.marginLeft = "0%";
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
        Host : "smtp.gmail.com",
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

//Graph Set Up
let ctx = document.getElementById('myGraph').getContext('2d');
let ratingInputs = document.getElementsByClassName('ratingInput');
let finalDateArray = [];
let finalNumberArray = [];
for(rating of ratingInputs){
        if(rating.value == 'N/A'){
            finalNumberArray.push('0');
            finalDateArray.push('N/A')
        }
        else{
            let ratingArray = rating.value.split(';');
            finalNumberArray.push(ratingArray[0]); //Number Rating
            finalDateArray.push(ratingArray[1]); //Date
        }
        // 0: 01, 1: 23, 2: 45, 3: 67, 4: 89
}

let lineGraph = new Chart(ctx, {
    type: 'line',
    data: {
        labels: finalDateArray,
        datasets: [
            {
                label: "Student Rating",
                data: finalNumberArray,
                borderColor: ['#00f4'],
                pointBackgroundColor: '#00f4',
                backgroundColor: ['#fff0']
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: 'Behavior of Student in Last 5 School Days'
        },
        scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 10
                }
            }]
        }
    }
})
