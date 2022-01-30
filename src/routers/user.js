
const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const router = new express.Router()
const {sendWelcomeEmail, sendCancellationEmail} = require('../emails/account')
router.get('/test', (req,res)=>{
    res.send("new")
})

router.post('/users', async (req, res)=>{
    // console.log(req.body)
    // res.send('testing')

    const user = new User(req.body)
    
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
       // res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
    

    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    //     //res.send(error)
    //     //console.log('Something went wrong' + error)
    // })
})

router.post('/users/login' ,async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({user,token})
    } catch (e) {
        res.status(400).send()
    }
})

//logut
router.post('/users/logout', auth, async (req, res)=>{
    try {
       
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
router.get('/users',auth ,async (req, res)=>{

    try{
        const users = await User.find({})
        res.status(200).send(users)
    }catch(e){
        res.status(500).send(e)
    }
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
})

router.get('/users/me',auth ,async (req, res)=>{

    // try{
    //     const users = await User.find({})
    //     res.status(200).send(users)
    // }catch(e){
    //     res.status(500).send(e)
    // }
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
    res.send(req.user)
})

// router.get('/users/:id',auth ,async (req,res)=>{

//     const _id = req.params.id

//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             res.status(404).send()
//         }
//         res.status(200).send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }

//     // User.findById(_id).then((user)=>{
        
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((e)=>{
//     //     res.status(500).send(error)
//     // })
// })

router.patch('/users/me',auth, async (req, res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isvalidOperation = updates.every((update)=> allowedUpdates.includes(update))
    
    if(!isvalidOperation){
        return res.status(400).send({"error":"Invalid Updates"})
    }
    
    try{
        // const updateUser = await User.findById(req.params.id)
        
        updates.forEach((update) =>{ req.user[update] = req.body[update]})
        await req.user.save()
       // const updateUser = await User.findByIdAndUpdate(req.params.id,req.body, {new:true, runValidators:true})
        
        // if(!updateUser){
        //     return res.status(404).send()
        // }

        res.status(200).send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req,res) =>{

    try{
        // const deleteUser = await User.findByIdAndDelete(req.user._id)

        // if(!deleteUser){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)

    }catch(e){
        res.status(500).send(e)
    }
})


const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        // cb(new Error('FIle must be a PDF'))
        // cb(undefined, true)
        // cb(undefined,false)

        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('File must be a Word Document'))
        }
        cb(undefined, true)
    }
})
const errorMiddleware = (req, res, next)=>{
    throw new Error('From ym error middleware')
}
router.post('/upload',upload.single('upload') , (req,res) =>{
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

const avatar = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        // cb(new Error('FIle must be a PDF'))
        // cb(undefined, true)
        // cb(undefined,false)

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('File must be in image (JPG, JPEG or PNG) format'))
        }
        cb(undefined, true)
    }
})


router.post('/users/me/avatar',auth, avatar.single('avatar'),async (req,res) =>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    //req.user.avatar=req.file.buffer
    req.user.avatar=buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})


router.delete('/users/me/avatar',auth, avatar.single('avatar'),async (req,res) =>{
    req.user.avatar= undefined
    await req.user.save()
    res.send()
})


router.get('/users/:id/avatar', async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)
        
    }catch(e){
        res.status(404).send()
    }
})


module.exports = router