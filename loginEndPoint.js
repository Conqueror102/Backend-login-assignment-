const express = require("express")
const app = express()
const mongoose = require("mongoose")
app.use(express.json())
require("dotenv/config")

const Port = process.env.Port

const connectDb = async ()=>{
    try{
        await 
        mongoose.connect("mongodb://localhost:27017/signInEndPoint")
        console.log("connection successfully")
    }catch(err){
        console.log("connection unsuccessfull", err)
    }
};
connectDb();


const signInSchema =  new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    passWord:String

})

const signInModel = mongoose.model("signin", signInSchema)

app.get("/", async (req,res)=>{
    try{
       const findAll = await signInModel.find();
        res.status(200).json({ findAll})
    }catch(err){
        res.status(500).json({message:"internal server error", error:err.message})
    };
});

app.post("/post-user", async (req,res)=>{
    try {
        const {firstName, lastName, email,passWord}= req.body

        const checkIfUserExist = await signInModel.findOne({
            email:email
        })

        if(checkIfUserExist){
            res.status(409).json({message:"user already exist"})
        }
        const createUser = await signInModel.create({
            firstName, lastName, email,passWord});
            res.status(201).json({status:true, createUser})
    } catch (err) {
        res.status(500).json({status:false, error:err.message})
    }
})

app.get("/get-all-user", async (req,res)=>{
    try{
        const getAllUser = await signInModel.find();
        res.status(200).json({status:true, getAllUser});
    }catch(err){
        res.status(500).json({status:false, error:err.message});
    };
});


app.get("/get-one-user/:id", async (req,res)=>{
    try{
        const findOneuser = await signInModel.findById(req.params.id)

        if(!findOneuser){
            res.status(404).json({status:false, message:"user not found"});
        }
        res.status(200).json({status:true, findOneuser});
    }catch(err){
        res.status(500).json({status:false,error:err.message})
    };
});


app.patch("/update-user/:id",async (req,res)=>{
    try{
        const updateUser = await signInModel.findByIdAndUpdate(req.params.id,{firstName, lastName, email,passWord},{new:true})
        if(!updateUser){
            res.status(404).json({status:false, message:"user not found"});
        }
        res.status(200).json({status:true, message:"user update successfully"});
    }catch(err){
        res.status(500).json({status:false, error:err.message});
    }
});


app.post("/login", async (req,res)=>{
    try{
        const {email,passWord}=req.body
        const checkForPassword = await signInModel.findOne({passWord})
        const checkForEmail = await signInModel.findOne({email}) //can the email comming from request body be diffrent from the one in database? 

        if(!checkForEmail || !checkForPassword){
            res.status(404).json({status:false, message:"invalid email or password"})
        }
       
        res.status(200).json({message:"login successfull", name:checkForEmail.firstName, })
    }catch(err){
        res.status(500).json({status:false,error:err.message})
    }
    
})

app.delete("/delete-user/:id",async (req,res)=>{
    try{
        const deleteUser = await signInModel.findByIdAndDelete(req.params.id);
        if(!deleteUser){
            res.status(404).json({message:"user does not exist"});
        }
        res.status(200).json({message:"deleted successfully"})
    }catch(err){
        res.status(500).json({status:true, error:err.message})
    }
})

app.all("/delete-all", async(req,res)=>{
    try{
       await signInModel.deleteMany()
        res.status(200).json({status:true, message:"all user deleted"})
    }catch(err){
        res.status(500).json({status:false, error:err.message})
    }
})

app.all("*",(req,res)=>{
    res.status(404).json({status:false, message:"wrong route, are u lost?"})
})

app.listen(Port, ()=>{
    console.log(`port is running at ${Port}`)
})