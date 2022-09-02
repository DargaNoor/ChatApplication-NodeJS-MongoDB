const express=require("express")
const router=express.Router();

const {createuser}=require('../controllers/tasks')

router.route('/').post(createuser)


module.exports=router
