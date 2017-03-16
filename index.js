var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoose= require('mongoose');
var logger = require('morgan');
var jwt = require('jsonwebtoken');
var config= require('./config');
app.use(logger('dev'));
Mongodb=require('./model/mongo');

app.use(bodyParser.json());
app.set('superSecret',config.secret);

//route without any authentication
app.get("/",function(req,res){
    res.send("Hello World");
});

//login available for everyone
app.post('/auth',function(req,res){
	var name= req.body.name;
	Mongodb.getUserByName(name,function(err,user){
		if(err){
			throw err
		}
		if(!user){
			res.json({success:false,message:'Authentication failed. User not found'});
		}
		else if(user && req.body.password!=null){
			if(user.userPassword != req.body.password){
				res.json({success:false,message:'Authentication failed. Wrong password'});
			}
			else{
				var token=jwt.sign(user,app.get('superSecret'),{
					expiresIn :1440 //expires in 24 hours
				});
				res.json({
					success:true,
					token:token
				});			
			}
		}else{
			res.json({success:false,message:"Something went wrong"});
		}
		
	});
});

//From this point onward it requires authorized token to access  further API
app.use(function(req,res,next){
	var token=req.body.token || req.query.token || req.headers['x-access-token'] ;
	if(token){
		jwt.verify(token,app.get('superSecret'),function(err,decoded){
			if(err){
				return res.json({success:false,message:"Failed to Authenticate"});
			}else{
				req.decoded=decoded['_doc'];
				app.set('userObj',req.decoded);
				 console.log(JSON.stringify(app.get('userObj')));
				// res.json(jwt.decode(token, {complete: true}));
				//res.send({success:true,message:JSON.stringify(req.decoded)});
				next();
			}
		});
	}else{
		return res.status(403).send({
			success:false,
			message:"No token was provided"
		});
	}
});

app.get("/company",function(req,res){
	Mongodb.getCompanies(function(err,companies){
		if(err){
			throw err;
		}
		res.json(companies);
	});	
});

//Checking for level of authorization. Only Analyst and Admin will have access from this point 
app.use(function(req,res,next){
	var user=app.get('userObj');
	if(user.authenticationLevel.toLowerCase()=="admin" || user.authenticationLevel.toLowerCase()=="analyst"){
		next();
	}else{
			res.json({
			success:false,
			message:"Access Denied"
			});	
		}
});

app.get("/company/:rankCategory/:topRank",function(req,res){
	var rankCategory=req.params.rankCategory;
	var topRank=req.params.topRank;
	Mongodb.getCompaniesByRank(rankCategory,topRank,function(err,companies){
		if(err){
			throw err;
		}
		res.json(companies);
	});	
});

//Again checking for level of authorization. Normal user and Analyst have access till this point 
app.use(function(req,res,next){
	var user=app.get('userObj');
	if(user.authenticationLevel.toLowerCase()=="admin"){
		next();
	}else{
			res.json({
			success:false,
			message:"Access Denied"
			});	
		}
});

app.get("/users",function (req,res) {
	Mongodb.getUsers(function(err,users){
		if(err){
			throw err;
		}
		res.json(users);
	});
});

app.get("/users/:_id",function(req,res){
	Mongodb.findById(req.params._id,function(err,user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

app.post("/users",function(req,res){
	var user=req.body;
	Mongodb.addUser(user,function(err,user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});

//Update User
app.put("/users/:_id",function(req,res){
	var user=req.body;
	var id=req.params._id;
	Mongodb.updateUser(id,user,{},function(err,user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});


app.delete("/users/:_id",function(req,res){
	var id=req.params._id;
	Mongodb.deleteUser(id,function(err,user){
		if(err){
			throw err;
		}
		res.json(user);
	});
});



app.post("/company",function(req,res){
	var company=req.body;
	Mongodb.addCompany(company,function(err,company){
		if(err){
			throw err;
		}
		res.json(company);
	});
});
//updateCompany
app.put("/company/:_id",function(req,res){
	var company=req.body;
	var id=req.params._id;
	Mongodb.updateCompany(id,company,{},function(err,company){
		if(err){
			throw err;
		}
		res.json(company);
	});
});

app.delete("/company/:_id",function(req,res){
	var id=req.params._id;
	Mongodb.deleteCompany(id,function(err,company){
		if(err){
			throw err;
		}
		res.json(company);
	});
});

app.listen(3000);
console.log("Listening to PORT 3000");