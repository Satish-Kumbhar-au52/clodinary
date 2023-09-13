const express=require('express')
const multer=require('multer')
const dotenv = require('dotenv')
dotenv.config()

const app=express()
const cloudinary = require('cloudinary').v2
const base64= require('js-base64')

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

const multerUpload=multer({
    storage:multer.memoryStorage({

    })
})

app.use(express.urlencoded())
app.use(express.json())

app.use(express.static('public'))

const products=[]

app.post('/products',multerUpload.single('productImage'),async (request,response)=>{

    try{
        const fileData=request.file
        let cloudinaryResponse
    if(fileData){
    
        const base64String=base64.encode(fileData.buffer)
    
        const cloudinaryResponse=await cloudinary.uploader.upload(`data:${fileData.mimetype};base64,${base64String}`)
    }
        const productData=request.body
        productData.imageUrl=cloudinaryResponse ? cloudinaryResponse: ' '
        products.push(productData)
        response.send({status:'success',msg:'product Added successfully !'})
    }
    catch(err){
        response.status(500).send({status:'error',msg:'Error adding product !'})
    }
})
app.get("/products",(req,res)=>{
    res.send(products)
})

const PORT=process.env.PORT || 8000;

console.log("Port Number",PORT)
app.listen(PORT,()=>{
    console.log("Server Started Successfully")
    console.log(process.env)
})