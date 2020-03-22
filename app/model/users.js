let mongoose = require("mongoose");

let user = new mongoose.Schema({
	//full name
    name: { type: String, default: "Mr. X"},
	//email id
	email: { type: String, default: "example@email.com"},
	//password
    password: { type: String, default: null },
    //cookie
    cookie: { type: String, default: null },
    //last login time
    registerTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('njnotesusers', user);