let mongoose = require("mongoose");

let user = new mongoose.Schema({
	//full name
    name: { 
        type: String, 
        default: "Mr. X",
        trim: true, 
    },
    //google id if login or signup do with google
    googleId: {
        type: String,
        default: null
    },
    //login with linkedin 
    linkedinId: {
        type: String,
        default: null
    },
    //github loing
    githubId: {
        type: String,
        default: null
    },
	//email id
	email: { 
        type: String, 
        default: "example@email.com", 
        unique: true,
        trim: true
    },
    //gender of the user value should be either m or f
    gender: {
        type: String,
        default: "M",
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
    //email verification code (code valid for 48 hours after generation)
    specialCode: { 
        type: String, 
        default: null,
        select: false 
    },
    //user verified
    verified: { 
        type: Boolean, 
        default: true,
        select: false 
    },
    //registering ip addres
    ipAddress: {
        type: String,
        default: null,
        select: false
    },
	//notes id
	notes: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'njnotes' 
        }
    ],
    //active status of user or we are not premitted the user
    activeStatus:{
        type: Boolean, 
        default: true,
        select: false
    }
},{
    timestamps: true
});

module.exports = mongoose.model('njnotesusers', user);