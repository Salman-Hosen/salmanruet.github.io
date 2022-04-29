const jwt = require('jsonwebtoken')
const async = require('hbs/lib/async')
const database1 = require('../db/database1')
require('dotenv').config();

const auth = async (req,res,next)=>{
    try {
        const token = await req.cookies.jwt
        const verifyToken = await jwt.verify(token, process.env.TOKEN)
        
            const user = await database1.findOne({_id:verifyToken._id})
            console.log(verifyToken)

            req.token = token;
            req.user = user; 
           
            next()
        
    } catch (error) {
        res.send(error)
    }
    
}

module.exports = auth;