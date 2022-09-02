const express=require("express")
const router=express.Router();

const {createroom}=require('../controllers/tasks')

router.route('/').post(createroom)

module.exports=router