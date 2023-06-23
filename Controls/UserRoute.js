const express=require("express")
const { userModel } = require("../Models/UserModel")
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const userRouter=express.Router()

userRouter.get("/",async(req,res)=>{
    try{
        const data=await userModel.find()
        res.status(200).json({"data":data})
    }catch(err){
        res.status(200).json({msg:"something going wrong"})
    }
})
userRouter.post("/register",async(req,res)=>{

    const {email,password}=req.body
    const data=await userModel.findOne({email})
    if(data){
        res.status(400).json({msg:"Already Regitered user"})
    }
    else{
        try{
            bcrypt.hash(password,5, async(err, hash)=> {
                if(err){
                    res.status(400).json({msg:"something going wrong"})
                }else{
                    const userdata=new userModel({email,password:hash})
                    await userdata.save()
                    res.status(200).json({msg:"Registerd Successfully"})
                }
               
            });
       
        }catch(err){
            res.status(400).json({msg:"something going wrong"})
        }
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    const userdata=await userModel.findOne({email})
    if(userdata){
        try{
            bcrypt.compare(password,userdata.password, function(err, result) {
            if(result){
                var token = jwt.sign({ authorId:userdata._id }, 'sonu',{ expiresIn: 60 * 30 });
                res.cookie("userjwt",token,{expires:new Date(Date.now()+1800000),httpOnly:true})
                res.status(200).json({msg:"Login successfully","token":token,username:userdata.name,useremail:userdata.email})
            }else{
                res.status(400).json({msg:"password mistmatch"})
            }
            });
          }catch(err){
            res.status(400).json({msg:"something going wrong"})
          }
    }else{
        res.status(400).json({msg:"No data found with this email"})
    }
  

})
module.exports={userRouter}