const express=require("express")
const router=express.Router();

const {editpass}=require('../controllers/tasks')

router.route('/').post(editpass)


module.exports=router