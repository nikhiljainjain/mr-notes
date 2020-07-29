let mongoose = require("mongoose");

let njnotes = new mongoose.Schema({
	//setting color for notes
	color: {
		type: String,
		default: "purple",
		trim: true,
		lowercase: true
	},
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
			type: mongoose.Schema.Types.ObjectId, 
			ref: 'njnotesusers',
			default: null				
		} 
	], 
	//ip address
	ipAddress: {
		type: String,
		default: null,
		select: false
	},
	//notes id
	lists: [ 
		{ 
			type: mongoose.Schema.ObjectId, 
			ref: 'njnoteslists' 
		} 
	],
	//view status or archive
	archive: {
		type: Boolean,
		default: false,
		select: false
	},
	//make this publicly available to all
	public: {
		type: Boolean,
		default: false
	}
},{
    timestamps: true
});

module.exports = mongoose.model('njnotes', njnotes);