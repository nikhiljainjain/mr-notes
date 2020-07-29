const { calculateTimeDurationInDays } = require("./time");

/**
 * @description -> checking otp generated as per funtion defined in index file
 * @param {*} otp -> otp number
 */
const validOTPNumber = (OTP=null) =>{
    return (!isNaN(OTP) && OTP.length === 6);
}

//otp creation function
const otpGeneration = () => {
    return Math.floor(Math.random() * 899999 + 100000).toString();
};

/**
 * @description => checking if the otp received by the user is
 * valid or not
 *  
 * @param {*} userData 
 * @param {*} otpReceived 
 * 
 * @param {*} it will return either false or userDataObject based on user Schema
 */
const verifyOTPNumber = async (userData=null, otpReceived=null)=>{
    try{
        const noOfDays = await calculateTimeDurationInDays(userData.otp.lastAttempt,
         Date.now()); 

        //checking invalid condition of a otp number
        if (!validOTPNumber(otpReceived) || userData.otp.number != otpReceived){
            return false;
        }else if (userData.otp.attempts > 3 && noOfDays < 1){
            return "Try Again After 24Hour";
        }else if (userData.otp.number == otpReceived){
            userData.otp.number = null;
            userData.otp.attempts = 0;
            userData.otp.lastAttempt = null;

            return userData;
        }else return false;
    }catch(error){
        console.error("OOPS!!!", error);
    }
};

/**
 * @description => checking if user not reached to its maxium 
 * limit of attempts of a day & if not then create new otp
 * 
 * @param {*} userData 
 */
const createOTPAgain = async(userData=null) =>{
    try{
        const noOfDays = await calculateTimeDurationInDays(userData.otp.lastAttempt,
            Date.now());

        //checking if user not reached to maximum attempts of a day
        if (!userData || (userData.otp.attempts > 3 && noOfDays < 1)) return false;
        else{
            //otp generation
            userData.otp.number = otpGeneration();
            userData.otp.lastAttempt = Date.now();
            
            //to limit the number of user attempt
            userData.otp.attempts++;

            return userData;
        }
    }catch(error){
        console.error("OOPS!!!", error);
    }
}

module.exports = { verifyOTPNumber, otpGeneration, validOTPNumber, createOTPAgain };