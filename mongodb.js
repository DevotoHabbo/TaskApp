// CRUD -> Create, Read, Update, Delete
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectID
const {MongoClient, ObjectID} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true ,useUnifiedTopology:true}, (err,client)=>{
    if(err){
      return  console.log('Unable to connect to database!')
    }
   const db = client.db(databaseName)
    // Example of how to use insert,find,update,delete
    // db.collection('tasks').deleteOne({description:'Buying a MacBook Pro'}).then((result)=>{console.log(result)}).catch((err)=>{console.log(err)})
    // db.collection('users').deleteMany({age: 27}).then((result)=>{console.log(result)}).catch((err)=>{console.log(err)})
    // db.collection('tasks').updateMany({completed:false},{$set:{completed:true}}).then((result)=>{console.log(result)}).catch((err)=>{ console.log(err)})
})