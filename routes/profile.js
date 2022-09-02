const express=require("express")
const router=express.Router();

const {profile}=require('../controllers/tasks')

router.route('/').get(profile)


module.exports=router