//json response of invalid request
let response = {
    msg: "NOT OK", data: "invalid request"
};
//json response of valid request
let validRes = {
    msg: "OK", data: "ALL is WELL"
};

//cookies age for 300 days
let COOKIES_AGE = (1000*60*60*24*300);

module.exports = { response, validRes, COOKIES_AGE };