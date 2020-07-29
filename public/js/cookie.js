//script check cookies 
//it prevents from users to go back after logout
(((document.cookie.split("token=")[1]).split("; ")[0])===(''||null))?(window.location.pathname="/users/logout"):null;