const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/task',auth, async (req, res)=>{
   // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})
//GET   /task?completed=true
// limit skip
// GET /tasks?limit=10&skip=0
// GET /task?sortBy=createdAt_asc
router.get('/tasks', auth, async (req, res)=>{
    // Task.find({}).then((task) =>{
    //     res.send(task)
    // }).catch((e) =>{
    //     res.status(500).send(e)
    // })

   const match={ }
   const sort ={}

   if(req.query.completed){
        match.completed=req.query.completed === 'true'
   }

   if(req.query.sortBy){
    const parts = req.query.sortBy.split("_")
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
   }


    try{
        const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
                
            }
        })
        
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/task/:id', auth, async (req, res)=>{
    const _id = req.params.id
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }

    //     res.send(task)
    // }).catch((e)=>{

    // })

    try{
       // const task = await Task.findById(_id)
       const task = await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/task/:id',auth, async (req, res) =>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isvalidOperation = updates.every((update)=> allowedUpdates.includes(update))
    
    if(!isvalidOperation){
        return res.status(400).send({"error":"Invalid Updates"})
    }
    
    try{
        //const taskUpdate =  await new Task.findOne({_id, owner:req.user._id})
        const task = await Task.findOne({_id, owner:req.user._id})
        //const taskUpdate = await Task.findById(req.params.id)

        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{ task[update] = req.body[task]})

        await task.save()
        //const taskUpdate = await Task.findByIdAndUpdate(req.params.id, req.body,{new:true, runValidator:true})
        

        res.send(task)
    }catch(e){
       
        res.status(400).send(e)
    }
})

router.delete('/task/:id',auth, async (req,res)=>{

    try{
        const taskToDelete = await Task.findByIdAndDelete({_id:req.params.id, owner:req.user._id})
        if(!taskToDelete){
            return res.status(404).send()
        }
        res.send('Task Deleted')
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports=router