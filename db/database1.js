const async = require('hbs/lib/async');
const mongoose = require('mongoose')
require('validator')
const bcrypt  = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const dataSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        
        
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
       
    },
    confirmpassword:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true   
    },
    tokens:[{
        token:{
            type:String,
            required:true  
        }
    }]
    
})


// generating token

dataSchema.methods.generateToken = async function(){
    try {
        const token = await jwt.sign({_id: this._id.toString()}, process.env.TOKEN)
        this.tokens =  this.tokens.concat({token:token})
        await this.save()
        return token
    } catch (error) {
        console.log(error)
    } 
}




dataSchema.pre('save', async function(next){

    if(this.isModified('password')){

        this.password = await bcrypt.hash(this.password,10)
        console.log(this.password)
        this.confirmpassword = await bcrypt.hash(this.password,10);
    } 
    next();

})

const database1 = new mongoose.model('database1', dataSchema);



module.exports = database1;