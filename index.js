const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
var jwt = require('jsonwebtoken');
const app = express()
const port = process.env.PORT || 5000

// middlewares
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@myclaster-1.wxhqp81.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


///------------jwt---------------///

function verityJWT(req,res,next){
    const authHeader = req.headers.authorization 

    if(!authHeader){
      return res.status(401).send({message : 'unauthorized access'})
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, function(err,decoded){
      if(err){
          return res.status(401).send({message: 'unauthorized access'})
      }
      req.decoded = decoded;
      next()
    })
}

///------------jwt---------------///

async function run(){
  try{

    const serviceCollection = client.db('swiftDelivery').collection('services')
    const reviewCollection = client.db('swiftDelivery').collection('reviews')

    //--------------------------------------//

      app.post('/jwt', (req,res)=>{
        const user = req.body
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6h' })
        res.send({token})
      })


    //---------------------------------------//


    //-------------------------------------//

    // get data of all services 
    app.get('/services',async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    // add services to database 
    app.post('/services',async (req,res)=> {
      const service = req.body 
      const result = await serviceCollection.insertOne(service)
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

    // // get name specific review from database and send to client 

    app.get('/reviews',async(req,res)=>{
      let query = {}
      if(req.query.name){
        query = {
          serviceName : req.query.name
        }
      }
      const cursor = reviewCollection.find(query)
      const reviews = await cursor.toArray()
      res.send(reviews)
    })

    // get a user specific user data by query from database and send to client 
    app.get('/reviewsquery', verityJWT, async (req,res)=> {
      const decoded = req.decoded 
      if(decoded.email !== req.query.email){
        res.status(403).send({message: 'unathorized access'})
      }
     let query = {};
     if(req.query.email){
        query = {
          reviewerEmail : req.query.email
        }
     }
     const cursor = reviewCollection.find(query);
     const result = await cursor.toArray();
     res.send(result)
    })

    // delete specific item 
    app.delete('/reviews/:id',async(req,res)=>{
          const id = req.params.id
          const query = { _id: ObjectId(id)}
          const result = await reviewCollection.deleteOne(query)
          res.send(result)
        })

    // get a review for update 
    app.get('/update/:id',async(req,res)=>{
      const id = req.params.id 
      const query = {_id: ObjectId(id)}
      const result = await reviewCollection.findOne(query)
      res.send(result) 
    })

    // update a user name and review 
    app.put('/update/:id',async(req,res)=>{
      const id = req.params.id 
      const filter = { _id:ObjectId(id)}
      const user = req.body
      const option = { upsert: true};
      const updateUserReview = { 
        $set:{
          reviewerName : user.newName,
          review : user.newReview
        }
      }
      const result = await reviewCollection.updateOne(filter,updateUserReview,option)
      res.send(result)
    })
  }
  finally{
    
  }

}
run().catch(err=>console.log(err))

app.listen(port,()=>{
  console.log(`COOL SERVER IS RUNNING ON ${port}`)
})