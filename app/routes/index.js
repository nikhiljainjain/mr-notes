let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index');
});


router.get('/login-signup', (req, res, next)=>{
	res.render('login-signup');
});
module.exports = router;