//refer this link -> https://codeforgeek.com/send-e-mail-node-js/

//installed packages
const nodemailer = require("nodemailer");

//packages made for this project
let User = require("../database/model/users");
let emailContent = {
    from: `"Mr Notes" <${process.env.EMAIL_USERNAME}@gmail.com>`,
    to: null,
    subject: null,
    text: null
};

const sendMail = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth:{
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

const emailVerification = (req, res) =>{
    //generating email content for email verification and send email to user
    //sending response of email send to the user for email verification
}

module.exports = { emailVerification };