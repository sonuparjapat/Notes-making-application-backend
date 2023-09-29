const express=require("express")
const { UserpostModel } = require("../Models/UserPost")

const favouraterouter=express.Router()

favouraterouter.get("/favdata",async(req,res)=>{

       const {authorId}=req.body
    // console.log(authorId)

    try{
 const data=await UserpostModel.find({favourate:true,authorId})
 res.status(200).json({msg:data})
     }catch(err){
         res.status(400).json({"msg":"SomeThing going wrong"})
     }
})

module.exports={favouraterouter}