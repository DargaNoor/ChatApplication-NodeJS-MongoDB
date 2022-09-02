const {tasks,tasks2}=require('../models/tasks')
const express=require("express")
var fs = require('fs');

const path = require('path');
//npm install --save express express-session body-parser
//for session variables
const session = require('express-session');

const cookieParser = require("cookie-parser");
const app=express()
app.use(cookieParser());


//middleware
app.use(express.json())  //for accessing req.body
app.use(express.urlencoded())
require('dotenv').config()

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

const {MongoClient}=require("mongodb")
const uri="mongodb://noor:Noor2001@nodeexpressprojects-shard-00-00.q9ceo.mongodb.net:27017,nodeexpressprojects-shard-00-01.q9ceo.mongodb.net:27017,nodeexpressprojects-shard-00-02.q9ceo.mongodb.net:27017/?ssl=true&replicaSet=atlas-nbtph7-shard-0&authSource=admin&retryWrites=true&w=majority"
const client=new MongoClient(uri)

//Creating a user and adding to the database
const createuser=async (req,res)=>{
    if(req.body.password==req.body.confirmpassword){
        const passcorrection=await tasks.findOne({ password: req.body.password })
            if(passcorrection ){
                return res.status(404).json({msg:"Password already used, try other one!"})
            }
        delete req.body.confirmpassword;
        req.body.id=[0] 
        
        const task=await tasks.create(req.body)
        res.sendFile(path.join('E:','Project','Group Discussions','public','login.html'))  
        }
    else{
        res.json({msg:"Password and Confirm Password are not matched, Please enter same!"})
    }
}

//Creating a Room with given Name and ID
const createroom=async (req,res)=>{
    const croom=await tasks2.create(req.body)
    const iusername=await tasks.findOneAndUpdate({name:req.session.user.name,password:req.session.password.password},{$push: {id:req.body.id}})
    return res.sendFile(path.join('E:','Project','Group Discussions','public','enterroom.html'))  
}


//Edition of Username
const editname=async (req,res)=>{
    const s= req.session.user;
    const p=req.session.password
    const name=tasks.findOneAndUpdate({name:s.name,password:p.password},{name:req.body.name})
    if(name)
    {
        res.redirect('/login')
    }
}

//Edition of Password
const editpass=async(req,res)=>{
    const s= req.session.user;
    const p=req.session.password
    const pass=tasks.findOneAndUpdate({name:s.name,password:p.password},{password:req.body})
    if(pass)
    {
        res.redirect('/login')
    }
}

//Login Successful or not
const loginstatus=async (req,res)=>{
    const lstatus=await tasks.findOne({name: req.body.name, password: req.body.password})
    if(!lstatus){
        return res.json({msg:"username and password doesn't exits"})
    }
    req.session.user = {name:req.body.name}
    req.session.save()
    req.session.password={password:req.body.password}
    req.session.save()
    return res.sendFile(path.join('E:','Project','Group Discussions','public','loggedhome.html'))
}

//User Entering the Room
const enterroom=async (req,res)=>{
    const s= req.session.user;
    const p=req.session.password
    const rn=req.body.name
    const ri=req.body.id
    req.session.room={room:rn}
    req.session.uid={uid:ri}
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    req.session.color={color: randomColor}
    req.session.save()
    const room=await tasks2.findOne({name:rn,id:ri})
    if(room){
        const user=await tasks.findOne({name:s.name,password:p.password,id:ri})
        if(user)
        {
            
            res.redirect('/message')
        }
        else{
           const iusername=await tasks.findOneAndUpdate({name:s.name,password:p.password},{$push: {id:ri}})
            return res.json("You are not logged in that room,but created now. Now you can again enter the room by using that room id and naem")
        }
    }
    else{
        res.json("Invalid room")
    }
}

//Displaying the Chat Box Messages
const message=async (req,res)=>{
    const s= req.session.user;
    const p=req.session.password
    const rn=req.session.room.room
    const ri=req.session.uid.uid
    var colors=req.session.color.color
    const users=await tasks.find({id:ri})
    const colors1={}
    for(let i=0;i<users.length;i++){
        colors1[users[i].name]= Math.floor(Math.random()*16777215).toString(16);
    }
    if(req.method=='POST'){
        const m=req.body.m;
        var ss='\n'
        ss=ss+s.name+','+p.password+','+ri+','+m+','
        let date=new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes.toString().padStart(2, '0');
        let strTime = hours + ':' + minutes + ' ' + ampm;
        ss=ss+date.getDate()+' '+monthNames[date.getMonth()]+','+strTime
        fs.appendFile('data.csv',ss,(err, result) => {
            if (err) {
              console.log(err)
              return
            }
            //console.log('done with this task')}
        })
    }
    
    var s1=''
    s1=s1+'<!DOCTYPE html><html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>  <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script></head><body > <nav class="navbar navbar-expand-lg navbar-light bg-light"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" style="background-color:#a3c2c2;!important" id="navbarNav"><ul class="navbar-nav"><li class="nav-item active"><a class="nav-link" href="./loggedhome.html">Home </a></li><li class="nav-item"><a class="nav-link" href="./createroom.html" >Create Room </a></li><li class="nav-item"><a class="nav-link" href="./loggedhome.html" >Leave Room <span class="sr-only">(current)</span></a></li><li class="nav-item"><a class="nav-link" href="/logout" >Logout</a></li><li class="nav-item"><a class="nav-link" href="#">About</a></li><li class="nav-item"><a class="nav-link" style="text-align: right;padding-left: 720px;font-size: large;font-weight: bold;"href="/profile" >Profile</a></li></ul></div></nav><h1 style="margin-left:30px;padding-left:6px;">'+rn+'</h1>'
    var b;
    fs.readFile('data.csv', 'utf-8', function(err, data) {
        s1=s1+'<div style="width:700px;margin: auto;padding: 10px;"><div style="height:380px;scroll:auto;border:1px solid purple;overflow-y: scroll;font-family: Georgia, serif;background-color:#cfbcbc;">'
        if( !err ){
            const a=data.split('\n')
            var c=1
            var ucolor;
            if(a.length>=2){
                var prev=a[1].split(',');
                var cur=a[1].split(',');
            }
            for(let i=0;i<a.length;i++){
                b=a[i].split(',')
                if(b[2]==ri){
                    c=0
                    var abc=p.password
                    if(a.length>=2){
                    cur=b[4]
                    if(prev[4]!=cur[4]){
                        s1=s1+'<p style="padding-left:260px;margin-top:3px;margin-bottom:3px;font-size:large;">'+cur+'</p>'
                        prev=cur
                    }}
                    if(i==a.length-1){
                    
                        if(b[0]==s.name && b[1]==abc)
                        {
                            s1=s1+'<p id="down" style="width:180px;height:70px;right:0px;padding:4px;background-color:white;margin-left:475px;margin-right:5px;overflow:auto;border: 2px solid #'+colors1[b[0]]+';border-top-right-radius: 15px;border-top-left-radius: 15px;border-bottom-right-radius: 15px;margin-top:4px;">'+'<span style="font-size:large;font-weight:bold;color:#'+colors1[b[0]]+';">'+b[0]+'</span> <span style="padding-left:45px;">'+b[5]+'</span><br/>'+b[3]+'</p>'  
                        }else{
                            ucolor=colors1[b[0]]
                            s1=s1+'<p id="down" style="width:170px;margin-left:5px;width:200px;padding:3px;background-color:white;height:60px;margin-top:4px;overflow:auto;border: 2px solid #'+ucolor+'; border-top-right-radius: 15px;border-top-left-radius: 15px;border-bottom-left-radius: 15px;">'+'<span style="font-size:large;font-weight:bold;color:#'+ucolor+';">'+b[0]+'</span><span style="right:0;padding-left:80px;padding-right:1px;">'+b[5]+'</span> <br/>'+b[3]+'</p>'  

                        }   
                    }
                    else
                    {
                        if(b[0]==s.name && b[1]==abc)
                        {
                            s1=s1+'<p style="width:180px;height:70px;right:0px;padding:4px;background-color:white;margin-left:475px;margin-right:5px;overflow:auto;border: 2px solid #'+colors1[b[0]]+';border-top-right-radius: 15px;border-top-left-radius: 15px;border-bottom-right-radius: 15px;margin-top:4px;">'+'<span style="font-size:large;font-weight:bold;color:#'+colors1[b[0]]+';">'+b[0]+'</span> <span style="padding-left:45px;">'+b[5]+'</span><br/>'+b[3]+'</p>'  
                        }
                        else{
                            ucolor=colors1[b[0]]
                            s1=s1+'<p style="width:160px;margin-left:5px;width:200px;padding:3px;background-color:white;height:60px;margin-top:4px;overflow:auto;border: 2px solid #'+ucolor+'; border-top-right-radius: 15px;border-top-left-radius: 15px;border-bottom-left-radius: 15px;">'+'<span style="font-size:large;font-weight:bold;color:#'+ucolor+';">'+b[0]+'</span><span style="right:0;padding-left:80px;padding-right:1px;">'+b[5]+'</span> <br/>'+b[3]+'</p>'  
                        
                        }
                    }
                } 
            }
            s1=s1+'</div><form action="/message" method="post"><input type="text" name="m" style="position:fixed;width:650px;margin-top:8px;" width="50"/><input type="submit" style="padding-left:665px;margin-top:8px;" value="Send"/></form></div><script> var a= document.getElementById("down");a.scrollIntoView(); </script></body></html>'
        
            res.send(s1)         
        }
        else    
            throw err;
    })
    
     
}  

//Code for Displaying the Profile of the User
const profile=async (req,res)=>{
    const s= req.session.user;
    const p=req.session.password
    var s1=''
    s1=s1+'<!DOCTYPE html><html><head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"><script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"><script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script><script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>  <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Profile Page</title></head><body><nav class="navbar navbar-expand-lg navbar-light bg-light"><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="collapse navbar-collapse" style="width:100%;position:fixed;margin-left:-10px;background-color:#a3c2c2;!important" id="navbarNav"><ul class="navbar-nav"><li class="nav-item active"><a class="nav-link" href="./loggedhome.html">Home </a></li><li class="nav-item"><a class="nav-link" href="./createroom.html" >Create Room </a></li><li class="nav-item"><a class="nav-link" href="./loggedhome.html" >Leave Room <span class="sr-only">(current)</span></a></li><li class="nav-item"><a class="nav-link" href="/logout" >Logout</a></li><li class="nav-item active"><a style="text-align:right;right:0px;padding-left:880px;font-size:large;font-weight:bold;"class="nav-link" href="#">Profile <span class="sr-only">(current)</span></a></li></ul></div></nav><div style="padding-left:15px;margin-top:7px;margin-bottom:7px;"><h1>Your Personal Information</h1><div style="padding-left:15px;font-size:large;margin-top:12px;"><p><span style="font-weight:bold;letter-spacing:1.5px;">Username : </span>'+s.name+'&emsp;<a href="./editname.html">EditName</a></p><p><span style="font-weight:bold;letter-spacing:1.5px;">Password : </span>'+p.password+'&emsp;<a href="./editpass.html">EditPassword</a></p></div></div><h2 style="padding-left:15px;background-color:#80ff80;margin-bottom:-22px;padding-top:4px;">Details are:</h2><div style="text-align: center;background-color:#80ff80;"><p id="password"></p><h3 style="padding-left:80px;">Room Details</h3><table style="border: 1px solid black;margin-left:540px;width:500px;border-collapse: collapse;background-color:none !important;"><tr style="border: 1px solid black;border-collapse: collapse;"><th style="padding-left:30px;text-align: center;background-color:white !important;">Name of Room</th><th style="padding-left:80px;text-align: center;background-color:white !important;">ID</th></tr>'
    
    const rooms=await tasks.find({name:s.name,password:p.password})
    for(let i=0; i<rooms[0].id.length;i++)
    {
        if(i%2==0)
            s1=s1+'<tr><td style="border: 1px solid black;padding-left:40px;text-align: center;border-collapse: collapse; background-color: #D6EEEE;">'
        else
            s1=s1+'<tr><td style="border: 1px solid black;padding-left:40px;text-align: center;border-collapse: collapse;background-color:white !important;">'
        if(i==0)
            continue
        const roomname=await tasks2.find({id:rooms[0].id[i]})
        if(i%2==0)
            s1=s1+roomname[0].name+'</td><td style="border: 1px solid black;padding-left:70px;text-align: center;padding-right:30px;border-collapse: collapse;background-color: #D6EEEE;">'+roomname[0].id+'</td></tr>'
        else
            s1=s1+roomname[0].name+'</td><td style="border: 1px solid black;padding-left:70px;text-align: center;padding-right:30px;border-collapse: collapse;background-color:white !important;">'+roomname[0].id+'</td></tr>'            
    }
    s1=s1+'</table></div><footer style="text-align: center;margin-top:16px;padding-bottom: 0px;"><p>© 2022  Personal Page. All rights reserved Noor</p></footer></body></html>'
    res.send(s1)
}


//Logging out
const logout=async (req,res)=>{
    const s= req.session.user;
    const p=req.session.password
    const out=await tasks.findOne({name:s.name,password:p.password})
    if(out){
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            return res.sendFile(path.join('E:','Project','Group Discussions','public','home.html'))  
            
        });
    }
    else{
        res.json({msg:"Error has occured with ur logout, so kindly close the tab manually"})
    }
}



module.exports={createuser,createroom,loginstatus,enterroom,message,profile,editname,editpass,logout}