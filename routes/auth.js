const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model("User");
const bcrypt=require('bcrypt');


router.get('/', (req, res) => {
  res.render('pages/index', {
    name: 'Covid Tracker',
  });
});

router.post('/signin',(req,res)=>{
	const {email,password}=req.body
	if(!email||!password){
		return res.status(422).json({error:"please enter mail and passowrd"});
	}
	User.findOne({email:email})
	.then(savedUser=>{
		if(!savedUser){
			return res.status(422).json({error:"Invalid passowrd or email"})
		}
		bcrypt.compare(password,savedUser.password)
		.then(doMatch=>{
			if(doMatch){
				
				const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
				res.json({token})
			}
			else {
				return res.status(422).json({error:"Invalid passowrd or email"})	
			}
		})
		.catch(err=>{
			console.log(err);
		})
	})
})

router.post('/signup',(req,res)=>{
	//console.log(req.body);
	const {name,email,password}=req.body;
	if(!name||!email||!password){
		return res.status(422).json({error:"please enter all the fields"});
	}
	User.findOne({email:email})
	.then((savedUser)=>{
		if(savedUser){
			return res.status(422).json({error:"alrready"})
		}
		bcrypt.hash(password,12)
		.then(hashedpassword=>{
				const user=new User({
				email:email,
				password:hashedpassword,
				name:name
			})

			user.save()
			.then(user=>{
				res.json({message:"saved success"});
			})
			.catch(err=>{
				console.log(err);
			})
		})
		

	})
	.catch(err=>{
		console.log(err);
	})


})

module.exports =router;