const express=require("express");
const router=express.Router();
const { connection } = require('./connector');
const mongoose=require("mongoose");
router.get("/totalRecovered",(req,res)=>{
    connection.aggregate([
        {
          $group: {
            _id:"total",
            recovered: { $sum: "$recovered" }
          }
        }
      ]).then((output)=>{
        res.status(200).send({data:output[0]});
    
    });
    
})
router.get("/totalActive",(req,res)=>{
    connection.aggregate([
        {
            $group:{
                _id:"total",
                active:{$sum:{$subtract:["$infected", "$recovered"]}}
            }
        }
    ]).then((output)=>{
        res.status(200).send({data:output[0]})
    })
})
router.get("/totalDeath",(req,res)=>{
    connection.aggregate([
        {$group:{
            _id:"total",
            death:{$sum:"$death"}
        }}
    ]).then((output)=>{
        res.status(200).send({data:output[0]})
    })
})
router.get("/hotspotStates",(req,res)=>{
    connection.aggregate([
       {
        $project:{
            _id:0,
            state:"$state",
            inf_rec: {$subtract: [ "$infected","$recovered"]},
            infected:"$infected"
        }
       },
       {
        $addFields: {
          rate: { $round: [ { $divide: [ "$inf_rec", "$infected" ] }, 5 ] }
        }
      },
       {
        $match:{
            rate:{$gt:0.1}
        }
       },
       {
        $project:{
            _id:0,
            state:"$state",
            rate:'$rate'
        }
       }
    ]).then((output)=>{
        let result={data:output};
        res.status(200).send(result);

    })
})
router.get("/healthyStates",(req,res)=>{
    connection.aggregate([
        {
            $project:{
                _id:0,
                state:"$state",
                mortality:{$round:[{$divide:["$death","$infected"]},5]}
            }
        },
        {
            $match:{
                mortality:{$lt:0.005}
            }
        }
    ]).then((output)=>{
        let result={data:output}
        res.status(200).send(result);
    })
})
module.exports={router};