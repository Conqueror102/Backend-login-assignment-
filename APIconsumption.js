const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
// const { createLogger } = require("vite")
const app = express()
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5175", // Allow frontend requests
    methods: "GET, POST, PUT, DELETE",
    credentials: true
  }));
  

require("dotenv/config")

const Port = process.env.Port

const connectDb = async ()=>{
    try{
        await
        mongoose.connect("mongodb://localhost:27017/productDB");
        console.log("connected successfull")
    }catch(err){
        console.log("connection unsuccessfull", err.message);
        process.exit(1)
    }
}
connectDb();

const productSchema = new mongoose.Schema({
    img:String,
    description:String,
    price:Number,
    name:String
});

const productModel = mongoose.model("products", productSchema)


app.get('/get-product', async(req,res)=>{
    try{
      const product = await productModel.find();
        res.status(200).json({product});
    }catch(err){
        res.status(500).json({message:"internal server error", error:err.message})
    }
});

app.post("/post-Product", async (req,res)=>{
    try{
        const {img, description, price,name }=req.body
        const postProduct = await productModel.create({img, description, price, name });
       res.status(201).json({status:true, postProduct})
    }catch(err){
        res.status(500).json({status:false,error:err.message, message:"internal ser error"})
    }
})

app.listen(Port,()=>{
    console.log(`server is running at ${Port}`);
})