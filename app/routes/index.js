let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index', { lgbtn: true });
});


router.get('/login-signup', (req, res, next)=>{
	res.render('login-signup', { lgbtn: false });
});

router.post('/login', (req, res, next)=>{
	console.log(req.body);
	res.status(302).redirect('/dashboard');
	//res.render('dash')
});

router.post('/signup', (req, res, next)=>{
	console.log(req.body);
	res.status(302).redirect('/dashboard');
	//res.render('dashboard', { lgbtn: false });
});
	
router.get('/dashboard', (req, res, next)=>{
	res.send('<h1>Available soon</h1>');
});

module.exports = router;