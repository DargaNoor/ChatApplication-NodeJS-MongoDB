const express=require("express")

const router=express.Router();

const {logout}=require('../controllers/tasks')

router.route('/').get(logout)



module.exports=router