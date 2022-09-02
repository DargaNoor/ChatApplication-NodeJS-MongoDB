const express=require("express")
const router=express.Router();

const {message}=require('../controllers/tasks')

router.route('/').get(message).post(message)


module.exports=router