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

//creating the table
insuranceTable.sync().then( ()=>{
  console.log("Table created successfully!");
})
.catch( (error)=>{
  console.log(error);
})
.finally( ()=>{
  sequelize.close();
});


app.get('/', (req,res)=>{
  console.log("Hello to the get request '/' ");
  res.status(200).send("Hello this is home page!");
});

app.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`);
});

