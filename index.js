const express = require('express')
const app = express()
const port = process.env.PORT || 5000


app.get('/',(req,res)=>{
  res.send("SERVER IS RUNNING")
})


app.listen(port,()=>{
  console.log(`COOL SERVER IS RUNNING ON ${port}`)
})