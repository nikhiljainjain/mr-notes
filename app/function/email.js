//refer this link -> https://codeforgeek.com/send-e-mail-node-js/

//installed packages
const mailjet = require ('node-mailjet').connect(process.env.EMAIL_API_KEY, process.env.EMAIL_SECRET_KEY);

//packages made for this project
let EmailSent = require("../database/model/emailSent"); 

//sending email & save email log in database
const sendAndSendEmail = (name, email, subject, textContent, htmlContent, purpose)=>{
    const request =  mailjet.post("send", {'version': 'v3.1'})
        .request({ "Messages": [
            {
            "From": {
                "Email": "no-reply@mrnotes.me",
                "Name": "Mr. Notes"
            },
            "To": [
                {
                "Email": email,
                "Name": name
                }
            ],
            "Subject": subject,
            "TextPart": textContent,
            "HTMLPart": htmlContent,
            }
        ]
	});
	
	let emailSentData = new EmailSent({
		email,
		purpose: "email verification",
		success: null 
	});

	//sending email 
	request.then((result) => {
		console.log(result);
		emailSentData.success = (result.body.Messages[0].Status == 'success');
  	}).catch((err) => {
		console.log(err.statusCode);
		emailSentData.success = false;
	});
	 
	//saving email data
	emailSentData.save();
}


//function will call to send email to verify email
const emailVerification = (name, email, verificationCode) =>{
    //generating email content for email verification and send email to user
    //sending response of email send to the user for email verification
	const htmlContent = `Hey ${name},
		<br>
		<br>
		Thank you for signup up on Mr. Notes.
		<br>
		<p><b>Please click the below given link to verify your account</b></p>
		<br>
		<a href="https://www.mrnotes.me/email/verification/${verificationCode}">https://www.mrnotes.me/email/verification/${verificationCode}</a>	
		<br>
		<p><i>If the above link does not seem clickable, copy & paste the link in any web browser</i></p>
		<br>
		<h3><b>Team Mr. Notes</b></h3>`;

	const subject = "Email Verification";	
	sendAndSendEmail(name, email, subject, null, htmlContent, subject.toLowerCase());

}

//sending email invitation for new member of team
const memberInvitation = (name, email, invitatorName, specialCode, notesUid) => {
    const htmlContent = `<html><body>
        Hey ${name},
		<br>
		<br>
		${invitatorName} invite you to join Team on Mr. Notes. 
		<br>
		<p><b>Please click the below given link to accept the request</b></p>
		<br>
		<a href="https://www.mrnotes.me/teams/invitation/${specialCode}/confirmation/${notesUid}">https://www.mrnotes.me/users/invitation/${specialCode}/confirmation/${notesUid}</a>	
		<br>
		<p><i>If the above link does not seem clickable, copy & paste the link in any web browser</i></p>
		<br>
        <h3><b>Team Mr. Notes</b></h3>
        </body></html>`;

	const subject = "Email Verification";	
	sendAndSendEmail(name, email, subject, null, htmlContent, subject.toLowerCase());
};

//sending email invitation for new member of team
const sendOTPEmail = ({ name, email, otp }) => {
    const textContent = `Hello ${name || "User"}
    \n
    Use OTP Number ${otp.number} to access your Mr. Notes account.
    \n
    \n
    Thank You
    \n
    Happy Day
    \n
    Team Mr Notes`;

	const htmlContent = `<html><body>
    Hello ${name || "User"},
    <br>
    <br>
    Use OTP Number ${otp.number} to access your Mr. Notes account.
    <br>
    <p>
        Thank You
        <br>
        Happy Day
    </p>
    <br>
    <h3><b>Team Mr. Notes</b></h3>
    </body></html>`;

	const subject = "OTP Verification";	
	sendAndSendEmail(name, email, subject, textContent, htmlContent, subject.toLowerCase());
};

module.exports = { emailVerification, memberInvitation, sendOTPEmail };