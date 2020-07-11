const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
	 
	id:{
		type:Number,
		required:true 
	},
	name:{
		type:String,
		required:true
	},
	age:{
		type:Number, 
		required:true 
	},
	gender:{
		type:String,
		required:true 
	},
	state:{
		type:String,
		required:true 
	},
	district:{
		type:String,
		required:true 
	},
	city:{
		type:String,
		required:true 
	},
	latitude:{
		type:String,
		required:true 
	},
	longitude:{
		type:String,
		required:true
	}

})


mongoose.model("AllReports",userSchema);