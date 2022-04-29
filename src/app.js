const express = require('express')
const app = express();
const hbs = require('hbs')
const path = require('path')
const bcrypt = require('bcryptjs')
const cookieparser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const auth = require("../Middleware/auth")

app.use(express.json())

// database connection
require('../dbConnection/connect')
const database1 = require('../db/database1')

// Using body parser

var bodyParser = require('body-parser');
const async = require('hbs/lib/async');
const { nextTick } = require('process');
app.use(bodyParser.urlencoded({ extended: false }));


// hbs engine declaring
app.set('view engine', 'hbs')

const viewsPath = path.join(__dirname,'../templates/views')
const partialPath = path.join(__dirname,'../templates/partials')

app.set('views', viewsPath)
hbs.registerPartials(partialPath)

// Css styling adding

app.use('/css',express.static(path.join(__dirname,'../public')))



// Home page 
app.get('/',(req,res)=>{
    res.render('home')
})

// Registration page

app.get('/registration',(req,res)=>{
    res.render('registration')
})

app.post('/registration', async(req,res)=>{

    try {
        const uname = req.body.uname;
        const uemail = req.body.uemail;
        const uphone = req.body.uphone;
        const upassword = req.body.upassword;
        const ucpassword = req.body.ucpassword;
        const ugender = req.body.ugender;

        if(upassword === ucpassword){
            const profile = new database1({
                name: uname, email: uemail, phone: uphone, password: upassword,
                confirmpassword:ucpassword, gender:ugender
            })
        
            // calling token generation

           const token = await profile.generateToken()
           console.log("Registration cookie"+token)

           // Set cookie
           res.cookie('jwt', token,{
               expires: new Date(Date.now() + 10000),
               httpOnly:true
           })

          const profile1 = await  profile.save();
          res.render("home")
        }else{
            res.send("Please confirm your password correctly")
        }
        
    } catch (error) {
        res.send(error)
    }
 
    
})

// Login page

app.get('/login',(req,res)=>{
    res.render('login')
})

app.post('/login',async(req,res)=>{
    try {
        const lemail = req.body.lemail
        const lpassword = req.body.lpassword

        const findData = await database1.findOne({email:lemail})
        console.log(findData.password)

        const isMatch = await bcrypt.compare(lpassword,findData.password)
        console.log(isMatch)
        // calling token generation

        const token = await findData.generateToken()
        console.log("Login cookie"+token)
        //Set cookies
        res.cookie('jwt', token,{
            expires: new Date(Date.now() + 100000),
            httpOnly:true
        })

        

        if(isMatch){
            res.render('home')
        }else{
            res.send("Useremail or password is not mathing")
        }
        

    } catch (error) {
        res.status(400).send("Useremail or password is not mathing")
    }
})

// Creating json web Token 
// require('dotenv').config();

// const jwt = require('jsonwebtoken')

// const createToken = async function(){
//     const token = await jwt.sign({_id: "6217c177a19209799bba2ea5"}, process.env.TOKEN,{expiresIn: "5 seconds"})
//     console.log(token)

//     // verifying token

//     const verify = await jwt.verify(token, process.env.TOKEN)
//     console.log(verify)
// }

// createToken()

// secret page

app.use(cookieparser())
app.get('/secret',auth, async(req,res)=>{
   const token = await req.cookies.jwt
   console.log("This is secret page cookie " + token + "   Thank you")
    res.render('secret')
   
})

// Logout and delete this token 
app.get('/logout',auth,(req,res)=>{

    req.user.tokens = req.user.tokens.filter((currentToken)=>{
        return currentToken.token !== req.token
    })
    res.clearCookie('jwt')
    req.user.save();

    res.render('login')
})



app.listen(3001,()=>{
    console.log("http://localhost:3001")
})