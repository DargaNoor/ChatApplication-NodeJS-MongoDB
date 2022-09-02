const mongoose=require("mongoose")


const connectdb=(url)=>{
    //this will return a promise
    return mongoose.connect(url, {})
}

module.exports= connectdb