let mongoose = require("mongoose");

let emailSent = new mongoose.Schema({
    //email address of user
    email: {
        type: String,
        default: null,
        require: true,
        trim: true
    },
    //for what email send to specific user
    purpose: {
        type: String,
        default: "email verification"
    },
    //if email sent successfully to the user
    success: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true
});

module.exports = new mongoose.model("emailsents", emailSent);