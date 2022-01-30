const mongoose=require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')
const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,  //adding validation
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email Invalid')
            }
        }
    },
    age: {
        type:Number,
        default:0,
        //customized validation
        validate(value){
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        }
       

    },
    password:{
        type:String,
        trin:true,
        required:true,
        minlength:7,
        validate(value){
        
            if(value.includes('password') ){
                throw new Error('Bad Password, try a new one')
            }

        }
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})


userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})



userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

//hash the plain password before saving
userSchema.pre('save', async function(next){
    const user=this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    //console.log('just before saving!')
    next()
})

//delete user task 
userSchema.pre('remove', async function(next){
    const user=this
    await Task.deleteMany({ owner:user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
