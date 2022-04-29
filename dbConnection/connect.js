const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/database1")
.then(()=>{console.log("Your database connection is ok")})
.catch(()=>{console.log("We can not connect your database")})