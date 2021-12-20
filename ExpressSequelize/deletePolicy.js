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


//delete the policy with the given id as parameter at request '.deletePolicy/:id'
app.delete('/deletePolicy/:id', (req,res)=>{
  //delete the policy with the gicen id in DB using Sequelize
  insuranceTable.destroy({
    where : { policyNumber : req.params.id}
  })
  .then( (data)=>{
    console.log("The number of records deleted are : "+data);
    res.status(200).send("Policy deleted successfully");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });
});

app.listen(PORT, ()=>{
  console.log( `Server is running at port ${PORT}`);
});