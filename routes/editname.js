const express=require("express")

const router=express.Router();

const {editname}=require('../controllers/tasks')


router.route('/').post(editname)


module.exports=router