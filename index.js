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
    const reviewCollection = client.db('swiftDelivery').collection('reviews')
    //-------------------------------------//

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
  //----------------------------------------//

  //------------------------------------------//
    // review colletion api 

    // get review from client and send to database 
    app.post('/reviews',async(req,res)=>{
        const review = req.body
        const result = await reviewCollection.insertOne(review)
        res.send(result)
    })

    // // get review from database and send to client 
    // app.get('/reviews',async (req,res) => {
    //   console.log(req.query.name)
    //   let query = {};
    //   if(req.query.name){
    //     query = {
    //       serviceName : req.query.name
    //     }
    //   }
    //   const cursor = reviewCollection.find(query);
    //   const reviews = await cursor.toArray()
      
    //   res.send(reviews)
    // })

 

    // get a specific user data from database and send to client 
    app.get('/reviews', async (req,res)=> {
      let query = {}
      console.log(req.query.email)
      if(req.query.email){
        query = {          
          reviewerEmail : req.query.email
        }
      }
      const cursor = reviewCollection.find(query)
      const reviews = await cursor.toArray()
      res.send(reviews)
    })

    // delete specific item 
    app.delete('/reviews/:id',async(req,res)=>{
          const id = req.params.id
          const query = { _id: ObjectId(id)}
          const result = await reviewCollection.deleteOne(query)
          res.send(result)
        })

  //--------------------------------------------//
  }
  finally{
    
  }

}
run().catch(err=>console.log(err))

app.listen(port,()=>{
  console.log(`COOL SERVER IS RUNNING ON ${port}`)
})