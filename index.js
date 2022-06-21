// this is backend CRUD application . 
const express  = require('express')
const cors = require('cors')
const ObjectId = require("mongodb").ObjectId
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port =process.env.PORT || 5000;
const app = express()

app.use(cors())
app.use(express.json())

// mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wawxe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
      await client.connect();
      const database = client.db("foodProduct");
      const productCollection = database.collection("product");
      // create a post api
        app.post("/addProduct", async(req,res)=>{
             const product = req.body;
            //  console.log('added cprodut', product);
             const result = await productCollection.insertOne(product)
             res.json(result)
        })
    //   get api
        app.get("/addProduct",async(req,res)=>{
            const cursors = productCollection.find({})
            const product = await cursors.toArray()
            res.send(product)
        })
        // delete api 
          
           app.delete('/addProduct/:id',async(req,res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)}
                const result = await productCollection.deleteOne(query)
                res.json(result)
           })

        //    get api for find specific id whice will update data
           app.get('/manageProcut/update/:id',async (req,res)=>{
                    const id = req.params.id;
                    const query = {_id : ObjectId(id)}
                    const result = await productCollection.findOne(query)
                    res.send(result)
           })

        //    update product
        app.put("/manageProcut/update/:id", async(req,res)=>{
            const id = req.params.id;
            const updateProduct = req.body
            const filter = {_id : ObjectId(id)}
            const option = {upsert:true}
            const updateDoc = {
                $set:{
                     pdName : updateProduct.pdName,
                     price :  updateProduct.price,
                     quantity : updateProduct.quantity,

                }  
            }
            const result = await productCollection.updateOne(filter,updateDoc,option)
            res.json(result)
        })

    
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

// example get api
  app.get("/",(req,res)=>{
    res.send("hello CRUD , I am comming soon....ok lets get started")
  })

app.listen(port,()=>{
    console.log('lesting current runnig app',port);
})