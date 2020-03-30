//json response of invalid request
let invalidRes = {
    msg: "NOT OK", 
    data: "invalid request",
};

//json response of valid request
let validRes = {
    msg: "OK", 
    data: "ALL is WELL",
};

//cookies age for 300 days
let COOKIES_AGE = (1000*60*60*24*300);

//snack bar
let ERROR_MSG = null;

module.exports = { invalidRes, validRes, COOKIES_AGE, ERROR_MSG };