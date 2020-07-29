//installed packages
let express = require('express');
let router = express.Router();

//self-made 
let { invalidRes, validRes, ejsData } = require('../config');
const { validId, bodyDataValidJSON } = require('../function');
const { cookieValid } = require("../function/cookies");

//database schema
let User = require('../database/model/users');
let Notes = require('../database/model/notes');
let Visitor = require('../database/model/visitors');

router.get('/:notesUid/visit', (req, res, next)=>{
    //storing in database
    let vistiorData = {
        notesUid: req.params.notesUid,
        ipAddress: req.ip,
        unique: true,
        existedUser: null,
        cookies: req.cookies,
        session: req.session
    }

    List.find({ archive: false, notesUid: req.params.notesUid }, "name cards uid")
        .populate("cards").select({ _id: 0 }).exec((err, listData)=>{
		if (err) console.error.bind("DB errror ", err);
		data.forEach((i)=>{
			console.log(i);
		});
		validRes.data = listData;
		res.json(validRes);
    });
    
    next(()=>{
        console.log(vistiorData);        
    });
});

module.exports = router;