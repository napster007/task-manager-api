const mongoose=require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    //useCreateIndex:true,
    //useFindAndModify: false
})

// const me = new User({
//     name:'Tyson     ',
//     email:'JAYSON@GMAiL.COM  ',
//     age:26,
//     password:'password'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error ' + error)
// })

// const task1 = new Task({
//     description:'Plant new trees',
//     completed:false,
//     trim:true
// })

// task1.save().then(()=>{
//     console.log(task1)
// }).catch((error)=>{
//     console.log('Error: ' + error)
// })