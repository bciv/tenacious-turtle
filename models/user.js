var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var UserSchema=new Schema({
	//email: String,
	name: String //,
	//demographics: {
	//	addressLine1: String,
	//	addressLine2: String,
	//	City: String,
	//	State: String,
	//	ZipCode: Number,
	//	homePhone: String,
	//	workPhone: String,
	//	cellPhone: String	
	//},
	//creationDate: { type: Date, default: Date.now },
});

module.exports=mongoose.model('User',UserSchema);
