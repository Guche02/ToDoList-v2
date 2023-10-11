module.exports = getDay;
//Specifies what this module exports to the app.js
// Only gives the function, doesn't execute the function getDay.
// module is a JS object, we can add methods to it for different functions.


function getDay() {

let today = new Date();
let options = {
    weekday: 'long',  //long format of date.
    day: "numeric", 
    month: "long",
    year: "numeric"
}

let currentDay = today.toLocaleDateString("en-US", options)
   return currentDay;
}