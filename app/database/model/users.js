let mongoose = require("mongoose");

let user = new mongoose.Schema({
	//full name
    name: { 
        type: String, 
        default: "Mr. X",
        trim: true, 
    },
	//email id
	email: { 
        type: String, 
        default: "example@email.com", 
        unique: true,
        trim: true
    },
	//password
    password: { 
        type: String, 
        default: null,
        select: false 
    },
    //cookie
    cookie: { 
        type: String, 
        default: null,
        select: false 
    },
    //register time
    registerTime: { 
        type: Date, 
        default: Date.now,
        select: false 
    },
    //email verification code (code valid for 48 hours after generation)
    verificationCode: { 
        type: String, 
        default: null,
        select: false 
    },
    //user verified
    verified: { 
        type: Boolean, 
        default: false,
        select: false 
    },
    //registering ip addres
    registerIP: {
        type: String,
        default: null,
        select: false
    },
	//notes id
	notes: [{ type: mongoose.Schema.ObjectId, ref: 'njnotes' }],
});

module.exports = mongoose.model('njnotesusers', user);