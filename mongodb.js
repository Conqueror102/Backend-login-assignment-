const express = require("express")
const app = express()
const mongoose = require("mongoose")
app.use(express.json())
require("dotenv/config")

const Port = process.env.Port

const connectDb = async ()=>{
    try{
        await
        mongoose.connect("mongodb://localhost:27017/booksDB")
        console.log("database connected")
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
connectDb();

const bookSchema = mongoose.Schema({
    title:String,
    author:String,
    publishedYear:Number,
    genre:String,
    available:Boolean,
});

const bookModel = mongoose.model("books",bookSchema);

app.get("/getAllBook", async (req,res)=>{
    try{
        const findAll= await bookModel.find();
        res.status(200).json({status:true, findAll})
    }catch(err){
        res.status(500).json({status:false, message:"internal server err",error:err.message})
    }
})

app.get("/getOneBook/:id",async (req,res)=>{
    try {
        const findOneBook = await bookModel.findById(req.params.id);
        if(!findOneBook){
            res.status(404).json({status:false, message:"user does not exist"})
        }
        res.status(200).json({status:true, findOneBook})
    } catch (err) {
        res.status(500).json({status:false, message:"internal server error", error:err.message})
    }
})

app.post("/postBook", async (req, res)=>{
    try {
        const {title, author, publishedYear, genre, available} = req.body

        const createBook = await bookModel.findOne({title})
        if(createBook){
            res.status(409).json({status:false, message:"book already exist"})
        }
        res.status(201).json({status:true, message:"book created successfully"})
        bookModel.create({title,author, publishedYear, genre, available})

    } catch (err) {
        res.status(500).json({status:false, error:err.message})
    }
})

app.patch("/updateBook/:id",async (req,res)=>{
    try {
        const {title,author, publishedYear, genre, available}=req.body
        const updateBook = await bookModel.findByIdAndUpdate(req.params.id)

        if(!updateBook){
            res.status(404).json({status:false, message:"user not found"})
        }
        res.status(200).json(req.params.id,{title,author, publishedYear, genre, available}, {new:true})

    } catch (err) {
        res.status(500).json({status:false, error:err.message, message:"internal server error"})
    }
});

app.all("/deleteAll", async (req,res)=>{
    try{
     await bookModel.deleteMany()
     res.status(200).json({message:"all books deleted"})
        
    }catch(err){
        res.status(500).json({status:false, error:err.message})
    }
})

app.delete("/deleteOneBook/:id", async (req,res)=>{
    try {
        const deleteOne = await bookModel.findByIdAndDelete(req.params.id)
        if(!deleteOne){
            res.status(404).json({status:false, message:"book not found"})
        }
        res.status(200).json({status:true, message:"user deleted", })
    } catch (err) {
        res.status(500).json({status:false, error:err.message})
    }
})

app.patch("/toggleAvailability/:id", async (req, res)=>{
   try{
    const {available} = req.body
    const findAndUpdate = await bookModel.findByIdAndUpdate(req.params.id,{available},{new:true})
    

    if(!findAndUpdate){
        res.status(400).json({message:"bad request"})
    }
    res.status(200).json({status:true, message:"user updated", available});
   }catch(err){
    res.status(500).json({status:false, error:err.message})
   }
})



app.listen(Port, ()=>{
    console.log(`server is running ${Port}`)
})