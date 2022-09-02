const mongoose=require("mongoose")

const {Schema}=mongoose

const taskschema=new Schema({
    //name:String,
    name:{
        type:String,
        required:[true,"must enter re"],
        trim:true, //for removing the spaces if typed at front or end
        maxlength:[16,'name must be not more than 16 charectors']
    },
    password:{
        type:String,
        required:[true,"must enter"],
        trim:true, //for removing the spaces if typed at front or end
        maxlength:[10,'name must be not more than 15 charectors']
    },
    id:{
        type: Array,
        unique:false
    }
})

//for creation of room and storing name and their respesctive room id's
const taskscema2=new Schema({
    name:{
        type:String,
        required:[true,"must enter"],
        trim:true, //for removing the spaces if typed at front or end
        maxlength:[16,'name must be not more than 16 charectors']
    },
    id:{
        type:Number,
        unique : true,
        required:[true,"must enter"],
        trim:true,
        
    }
})

const tasks=mongoose.model("users",taskschema);
const tasks2=mongoose.model("room",taskscema2);

module.exports={tasks,tasks2}