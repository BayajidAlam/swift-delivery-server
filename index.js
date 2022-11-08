const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@myclaster-1.wxhqp81.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
  try{

    const serviceCollection = client.db('swiftDelivery').collection('services')
    // get data of all services 
    app.get('/services',async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    // get data of 3 services for home 
    app.get('/servicesOfHome',async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query)
      const result = await cursor.limit(3).toArray()
      res.send(result)
    })
    // get a specific data of service 
    app.get('/services/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id: ObjectId(id)}
      const serivice = await serviceCollection.findOne(query)
      res.send(serivice) 
    })
  }
  finally{
    
  }

}
run().catch(err=>console.log(err))

app.listen(port,()=>{
  console.log(`COOL SERVER IS RUNNING ON ${port}`)
})