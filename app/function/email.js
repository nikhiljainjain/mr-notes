//refer this link -> https://codeforgeek.com/send-e-mail-node-js/

//installed packages
const mailjet = require ('node-mailjet').connect(process.env.EMAIL_API_KEY, process.env.EMAIL_SECRET_KEY)

//packages made for this project
let User = require("../database/model/users");

const createEmailRequest = (name, email, subject, textContent, htmlContent)=>{
    return mailjet.post("send", {'version': 'v3.1'})
        .request({ "Messages": [
            {
            "From": {
                "Email": "info@mrnotes.me",
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

	const request = createEmailRequest(name, email, 'Email Verification', null, htmlContent);

	//sending email 
	request.then((result) => {
    	console.log(result.body)
  	}).catch((err) => {
    	console.log(err.statusCode)
  	});
}

module.exports = { emailVerification };