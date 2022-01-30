const mongoose=require('mongoose')
const validator = require('validator')

//create model for the task
// const Task = mongoose.model('Task',{
//     description:{
//         type:String,
//         required:true
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
    
// })

const taskSchema = new mongoose.Schema({
    description: {
        type:String,
        required:true  //adding validation
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})

taskSchema.pre('save', async function(next){
    const task=this

    if(task.isModified('completed')){
        console.log('task completed!')
    }
    //console.log('just before saving!')
    next()
})

const Task = mongoose.model('Task', taskSchema)

module.exports=Task

// const mongoose = require('mongoose')

// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     },
//     owner: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User'
//     }
// })

// module.exports = Task