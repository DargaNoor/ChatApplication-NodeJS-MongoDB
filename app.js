
const express=require("express")
const app=express()



const tasks=require("./routes/tasks")
const tasks1=require("./routes/tasks1")
const tasks2=require("./routes/tasks2")
const taskscreate=require("./routes/taskscreate")


const enterroom=require('./routes/enterroom')
const message=require('./routes/message')
const profile=require('./routes/profile')
const editname=require('./routes/editname')
const editpass=require('./routes/editpass')

const {MongoClient}=require("mongodb")


const path=require('path')
const connectdb=require('./db/connect')




const session = require('express-session');

const cookieParser = require("cookie-parser");

app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneDay}
}))


//middleware
app.use(express.json())  //for accessing req.body
app.use(express.urlencoded())
require('dotenv').config()

app.use(express.static('./public'));
app.use(express.static('./images'))

app.use('/register',tasks)
app.use('/enterroom',enterroom)
app.use('/login',tasks1) 
app.use('/logout',tasks2)
app.use('/message',message)
app.use('/profile',profile)
app.use('/editname',editname)
app.use('/editpass',editpass)


app.use('/createroom',taskscreate)
const port=3000;

const start= async()=>{
    //const uri="here_paste_your_mongobd-urri"
    const client=new MongoClient(uri)
    try {
        await connectdb(process.env.MONGO_URRI)
        app.listen(port,console.log(`Server is listening at http://localhost:${port}/`))
        
    } catch (error) {
        console.log(error)
    }
}
start()
