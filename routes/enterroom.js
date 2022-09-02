const express=require("express")
const router=express.Router();

const {enterroom}=require('../controllers/tasks')

router.route('/').post(enterroom)


module.exports=router