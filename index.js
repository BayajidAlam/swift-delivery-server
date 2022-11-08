const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@myclaster-1.wxhqp81.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const serviceCollection = client.db('swiftDelivery').collection('services')
async function run(){

app.get('/services',async(req,res)=>{
  const query = {}
  const cursor = serviceCollection.find(query)
  const result = await cursor.toArray()
  res.send(result)
})

}
run().catch(err=>console.log(err))

app.listen(port,()=>{
  console.log(`COOL SERVER IS RUNNING ON ${port}`)
})