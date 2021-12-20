const express  = require('express');
const Sequelize = require('sequelize');
const dbconfig = require('./db.config');
const PORT = 8000;

const app = express();
app.use(express.json());

//creating sequelize object with all the database parameters and connecting to it
const sequelize = new Sequelize(dbconfig.DB, dbconfig.USER, dbconfig.PASSWORD, {
  host : dbconfig.HOST,
  dialect : dbconfig.dialect,
  pool : {
    max : dbconfig.pool.max,
    min : dbconfig.pool.min,
    acquire : dbconfig.pool.acquire,
    idle : dbconfig.pool.idle
  }
});

//defining the insurance table
let insuranceTable = sequelize.define('insuranceTable',{
  policyNumber : {
    primaryKey : true,
    type : Sequelize.INTEGER
  },
  policyHolderName : Sequelize.STRING,
  policyAmount : Sequelize.INTEGER,
  maturityAmount : Sequelize.INTEGER,
  nominee : Sequelize.STRING
}, {
  timestamps : false,
  freezeTableName : true
});


//update the policy with the given id
app.put('/updatePolicy', (req,res)=>{
  //update the policy in the DB with given data using Sequelize
  insuranceTable.update(
    { policyHolderName : req.body.policyHolderName, policyAmount : req.body.policyAmount, maturityAmount : req.body.maturityAmount, nominee : req.body.nominee},
    { where : { policyNumber : req.body.policyNumber}}
  )
  .then( (data)=>{
    console.log("Number of records updated are :"+data);
    res.status(200).send("Policy updated successfully");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });
});

app.listen(PORT, ()=>{
  console.log( `Server is running at port ${PORT}`);
});