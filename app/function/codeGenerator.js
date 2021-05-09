const randomString = require("randomstring");

const { randomGeneratorParameter } = require("../config");

/**
 * @description => code will generate a unique users id with first character 
 * users firstname & second character will be lastname first character
 * 
 * @param {Object} userObj 
 */
const inviteFriendUidGenerator = (userObj=null)=>{
    if (userObj == null) return ("MR_NOTES_"+randomString.generate(randomGeneratorParameter));
    return (userObj.firstName.slice(0,1) + userObj.lastName.slice(0,1) + "_" + randomString.generate(randomGeneratorParameter))
}


/**
 * @description => generate unqiue code for the cookie with  
 * COOKIE then unqiue id generated by randomstring
 */
const cookieUidGenerator = ()=>{
    return ("COOKIE_" + randomString.generate(randomGeneratorParameter));
}

module.exports = { inviteFriendUidGenerator, cookieUidGenerator};