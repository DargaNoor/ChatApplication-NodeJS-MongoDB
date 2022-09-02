const express=require("express")
const router=express.Router();

const {loginstatus}=require('../controllers/tasks')

router.route('/').post(loginstatus)


module.exports=router