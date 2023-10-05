var birthdate = "2004-11-26";
var birthDateObj = new Date(birthdate);
var currentDate = new Date();
var age = currentDate.getFullYear() - birthDateObj.getFullYear();

if (currentDate.getMonth() < birthDateObj.getMonth() || (currentDate.getMonth() === birthDateObj.getMonth() && currentDate.getDate() < birthDateObj.getDate())) {
        age--;
}

document.getElementById("age").innerText = age;