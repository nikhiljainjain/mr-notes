let mongoose = require("mongoose");

let user = new mongoose.Schema({
	//full name
    name: { type: String, default: "Mr. X" },
	//email id
	email: { type: String, default: "example@email.com", unique: true },
	//password
    password: { type: String, default: null },
    //cookie
    cookie: { type: String, default: null },
    //last login time
    registerTime: { type: Date, default: Date.now },
    //user verified
    verified: { type: Boolean, default: false },
	//notes id
	notes: [{ type: mongoose.Schema.ObjectId, ref: 'njnotes', unique: true }],
});

module.exports = mongoose.model('njnotesusers', user);