const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const auth = require('./middleware/auth')
const multer = require('multer')
const app = express()
const port = process.env.PORT || 3000

// app.use( (req, res, next)=>{
//     // console.log(req.method, req.path)
//     // next()

//     if(req.method === 'GET'){
//         res.send('GET request is disabled')
//     }else{
//         next()
//     }
// })

// app.use( (req, res, next)=>{
//     // console.log(req.method, req.path)
//     // next()

//     if(req.method != null){
//         res.status(503).send('Server Under Maintenance')
//     }else{
//         next()
//     }
// })






app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log('Server is up on port '+ port )
})

// const byCrypt = require('bcryptjs')

// // const myFunction = async ()=>{
// //     const password = 'RedStar1121'
// //     const hashedPassword = await byCrypt.hash(password, 8)

// //     console.log(password)
// //     console.log(hashedPassword)

// //     const isMatch = await byCrypt.compare('RedStar1121',hashedPassword)
// //     console.log(isMatch)
// // }

// const jwt = require('jsonwebtoken')
// const myFunction = async ()=>{
   
//     // const token = jwt.sign({_id:'1234'}, 'thisisme', {expiresIn:'1 second'})
//     // console.log(token)

//     // const data=jwt.verify(token, 'thisisme')
//     // console.log(data)
// }
// myFunction()

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async ()=>{
   
//     const user = await User.findById('61d3b9175372a39581d18cb8')
//     await user.populate( 'tasks' )
//     console.log(user.tasks)
// }
//main()


