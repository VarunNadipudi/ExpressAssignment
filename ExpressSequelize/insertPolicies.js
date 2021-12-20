const express = require('express');
const Sequelize = require('sequelize');
const dbconfig = require('./db.config');
const PORT = 8000;

const app = express();
app.use(express.json());

//creating a sequelize object with all the database details to make a connection to DB
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


app.get('/', (req,res)=>{
  console.log("Hello to the get request '/' ");
  res.status(200).send("Hello this is home page!");
});

//inserting record into the insuranceTable from the post request '/insertPolicy'
app.post('/insertPolicy', (req,res)=>{
  //insert the record to db using Sequelize
  insuranceTable.create({
    policyNumber : req.body.policyNumber,
    policyHolderName : req.body.policyHolderName,
    policyAmount : req.body.policyAmount,
    maturityAmount : req.body.maturityAmount,
    nominee : req.body.nominee
  }).then( ()=>{
    console.log("Record Created successfully!");
    res.status(200).send("Record inserted successfully!");
  })
  .catch( (error)=>{
    console.error(error);
    res.status(400).send(error);
  });

});

app.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`);
});