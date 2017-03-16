var mongoose    =   require("mongoose");
mongoose.Promise = require('bluebird');
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
mongoose.connect('mongodb://localhost:27017/test');
var db=mongoose.connection;

var userSchema=mongoose.Schema({
	userName:{
		type:String,
		require:true,
		unique:true
	},

	userPassword:{
		type:String,
		require:true
	},
	authenticationLevel:{
		type:String,
		enum:["admin","analyst","normal"],
		default:"normal"
	},
	create_date:{
		type:Date,
		default:Date.now
	}
});

var companySchema=mongoose.Schema({
	id:{
		type:Number,
		unique:true
	},
	name:{
		type:String
	},
	num_employees:{
		type:Number
	},
	contact_email:{
		type:String
	},
	year_founded:{
		type:Number
	},
	contact_name:{
		type:String
	},
	rankings:[
		{
			financials:Number,
			team:Number,
			idea:Number
		}
	],
	create_date:{
		type:Date,
		default:Date.now
	}
});
// create model if not exists.
var Users=module.exports = mongoose.model('Users',userSchema);
var Companies=module.exports = mongoose.model('Company',companySchema);

//Get Users
module.exports.getUsers=function (callback,limit) {
	Users.find(callback).limit(limit);
}
module.exports.getUserById=function(id,callback){
	Users.findById(id,callback);
}
module.exports.getUserByName=function(name,callback){
	Users.findOne({'userName':name},callback);
}
module.exports.addUser=function(user,callback){
	Users.create(user,callback);
}

module.exports.updateUser=function(id,user,options,callback){
	var query={_id:id};

	var updatedObj={
		userName:user.userName,
		authenticationLevel:user.authenticationLevel
	}
	Users.findOneAndUpdate(query,updatedObj,options,callback)	
}

module.exports.deleteUser=function(id,callback){
	var query={_id:id};
	Users.remove(query,callback);
}

module.exports.getCompanies=function(callback,limit){
	Companies.find(callback).limit(limit);
}

module.exports.getCompaniesByRank=function(rankCategory,topRank,callback,limit){
	topRank=Number(topRank);
	Companies.find().sort('rankings.'+rankCategory).limit(topRank).exec(callback);
}

module.exports.addCompany=function(company,callback){
	Companies.create(company,callback);
}

module.exports.updateCompany=function(id,company,options,callback){
	var query={_id:id};
	var updatedObj={
		name:company.name,
		num_employees:company.num_employees,
		contact_email:company.contact_email,
		year_founded:company.year_founded,
		contact_name:company.contact_name,
		rankings:company.rankings
	}
	Companies.findOneAndUpdate(query,updatedObj,options,callback)
	//console.log(company);
}

module.exports.deleteCompany=function(id,callback){
	var query={_id:id};
	Companies.remove(query,callback);
}
// userSchema.pre('validate',function(next){
// 	next(Error('custom erro'));
// });

	// function validateFn(value){
	// 	return false;
	// }