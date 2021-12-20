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

//retreiving all policies with the request '/getAllPolicies'
app.get('/getAllPolicies', (req,res)=>{
  //display all the polices in db using Sequelize
  insuranceTable.findAll({raw:true}).then( (data)=>{
    res.status(200).send(data);
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

//display policy with the given id
app.get('/getPolicy/:id', (req,res)=>{
  //need to find out the policy with the given policy number in DB and display it using sequelize findByPk
  insuranceTable.findByPk(req.params.id).then( (data)=>{
    res.status(200).send(data.dataValues);
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

app.listen(PORT, ()=>{
  console.log( `Server is running at port ${PORT}`);
});