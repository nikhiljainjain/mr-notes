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
    //register time
    registerTime: { type: Date, default: Date.now },
    //email verification code (code valid for 48 hours after generation)
    verificationCode: { type: String, default: null },
    //user verified
    verified: { type: Boolean, default: false },
	//notes id
	notes: [{ type: mongoose.Schema.ObjectId, ref: 'njnotes' }],
});

module.exports = mongoose.model('njnotesusers', user);