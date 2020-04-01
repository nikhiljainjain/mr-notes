//script check cookies 
//it preventing from users to go back after logout
let cookies = document.cookie.split('=');
if (cookies[1] == null || cookies[1] == '')
    window.location.pathname = "/logout";