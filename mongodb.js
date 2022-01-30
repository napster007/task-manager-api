//CRUD

// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
// const ObjectId = mongodb.ObjectId

//const { ObjectID } = require('bson')
const {MongoClient, ObjectID} = require('mongodb')

const connectionURL= 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

const id = new ObjectID()
console.log(id)

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client)=>{
    if(error){
        return console.log('Unable to connect to the database')
    }

    //console.log('Connected Correctly')
   const db = client.db(databaseName)
//    db.collection('users').insertOne({
//        name: 'Inami',
//        age: 19
//    }, (error, result)=>{
//         if(error){
//             return console.log('unable to add new user')
//         }

//         console.log(result.insertedId)
//    })

// db.collection('users').insertMany([
//     {
//     name:"Jen",
//     age:28
//     },
//     {
//         name:"Gunther",
//         age:25
//     }
// ], (error, result)=>{
//     if(error){
//         return console.log('Unable to insert data')

//     }
//     console.log(result.acknowledged)
// })

// db.collection('tasks').insertMany([
//     {
//         description:"Buy food",
//         completed:false
//     },
//     {
//         description:"Buy water",
//         completed:false
//     },
//     {
//         description:"Buy rice",
//         completed:true
//     }
// ], (error, result)=>{
//     if(error){
//         return console.log('Unable to store the tasks')
//     }
//     console.log(result.insertedIds)
// })

// db.collection('users').findOne({name: 'Napster'}, (error, user)=>{

//     if(error){
//         return console.log('Cannot find the user')
//     }
//     console.log(user)
// })

    // db.collection('users').find({age:27}).toArray((error, users)=>{
    //     console.log(users)
    // })

    // db.collection('tasks').findOne( {_id:new ObjectID('61bdf6da4eae068cd91ceb58')}, (error, task) =>{
    //     if(error){
    //         return console.log('Not found')

    //     }
    //     console.log(task)
    // })

    // db.collection('tasks').find({completed:false}).toArray((error, tasks) =>{
    //     if(error){
    //         return console.log('No data found')
    //     }
    //     console.log(tasks)
    // })

    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("61bdca3b6dadf568c75113a9")
    // }, {
    //     // $set:{
    //     //     name:'addsfdgsdgdfs'
    //     // }
    //     $inc:{
    //         age:1
    //     }
    // })
    // updatePromise.then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    // const UpdateTaskPromise = db.collection('tasks').updateMany({
    //     completed:false
    // },{
    //     $set:{
    //         completed:true
    //     }
    // })

    // UpdateTaskPromise.then((result)=>{
    //     console.log(result)
    // }).catch((error) =>{
    //     console.log(error)
    // })
    
    //delete many
    // db.collection('users').deleteMany(
    //     {
    //        age:27 
    //     }
    // ).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    //delete One
    db.collection('tasks').deleteOne({
        description:'Buy rice'
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})

