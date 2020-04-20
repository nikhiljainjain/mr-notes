let mongoose = require("mongoose");

let njnotes = new mongoose.Schema({
	//unique id generator
	uid: { 
		type: String, 
		default: null 
	},
	//board name
    name: { 
		type: String, 
		default: "Mr. X" 
	},
	//description
	desc: { 
		type: String, 
		default: null 
	},
	//creator
	creater: { 
		type: mongoose.Schema.ObjectId, 
		ref: "njnotesusers",
		select: false 
	},
	//team notes true if this will created for team
	teamWork: { 
		type: Boolean, 
		default: false 
	},
	//other members
	members: [ 
		{ 
			type: mongoose.Schema.ObjectId, 
			ref: 'njnotesusers'
		} 
	], 
	//last login time
    creationTime: { 
		type: Date, 
		default: Date.now 
	},
	//notes id
	lists: [ 
		{ 
			type: mongoose.Schema.ObjectId, 
			ref: 'njnoteslists' 
		} 
	]
});

module.exports = mongoose.model('njnotes', njnotes);