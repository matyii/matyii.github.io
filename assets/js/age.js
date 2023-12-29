const birthdate = new Date("2004-11-26");
const currentDate = new Date();
let age = currentDate.getFullYear() - birthdate.getFullYear();

if (
  currentDate.getMonth() < birthdate.getMonth() ||
  (currentDate.getMonth() === birthdate.getMonth() && currentDate.getDate() < birthdate.getDate())
) {
  age--;
}

document.getElementById("age").innerText = age;