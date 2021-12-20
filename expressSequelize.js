const express = require('express');
const Sequelize = require('sequelize');
const dbconfig = require('./db.config');

const app = express();
app.use(express.json());

//creating a sequelize object with all the database parameters
const sequelize = new Sequelize(dbconfig.DB, dbconfig.USER, dbconfig.PASSWORD, {
  host : dbconfig.HOST,
  dialect : dbconfig.dialect,
  pool :{
    max : dbconfig.pool.max,
    min : dbconfig.pool.min,
    acquire : dbconfig.pool.acquire,
    idle : dbconfig.pool.idle
  }
});

//creating a employee table

//defining the employee table
let employeeTable = sequelize.define('employeeTable', {
  employeeId :{
    primaryKey : true,
    type : Sequelize.INTEGER
  },
  employeeName : Sequelize.STRING,
  department : Sequelize.STRING,
  designation : Sequelize.STRING
}, {
  timestamps : false,
  freezeTableName : true
});

// //creating the table
// employeeTable.sync().then( ()=>{
//   console.log("Table is created successfully!");
// })
// .catch( (error)=>{
//   console.log(error);
// })
// .finally( ()=>{
//   sequelize.close();
// });


//Now lets test the working of express

app.get('/', (req,res)=>{
  console.log("got the get request at / ");
  res.send("Hello this is home");
});

//getting all the employees at '/getAllEmployees'
app.get('/getAllEmployees', (req,res)=>{
  //getting the employeeTable data using sequelize and sending it 
  employeeTable.findAll({raw:true}).then( (data)=>{
    res.status(200).send(data);
  })
  .catch( (error)=>{
    console.error(error);
  });

});

//inserting the employee at '/insertEmployee'
app.post('/insertEmployee', (req,res)=>{
  //inserting into employeeTable using Sequelize
  employeeTable.create({
    employeeId : req.body.employeeId,
    employeeName : req.body.employeeName,
    department : req.body.department,
    designation : req.body.designation
  })
  .then( ()=>{
    console.log("The record is successfully created");
    res.status(200).send("Data inserted successfully");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

//update the employee record at '/updateEmployeeData'
app.put('/updateEmployeeData', (req,res)=>{

  //need to first update the employee data in the db using Sequelize
  employeeTable.update(
    { employeeName : req.body.employeeName, department : req.body.department, designation : req.body.designation},
    { where : { employeeId : req.body.employeeId}}
  )
  .then( (data)=>{
    console.log(data);
    res.status(200).send("Record updated successfully!");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

//deleting the employeeData at '/deleteEmployee/:id'
app.delete('/deleteEmployee/:id', (req,res)=>{

  //deleting the employeeData in the db using Sequelize
  employeeTable.destroy({
    where : { employeeId : req.params.id}
  })
  .then( (data)=>{
    console.log("Record is successfully deleted!");
    res.status(200).send("Record deleted successfully!");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

app.listen(8000, ()=>{
  console.log(`The server is running at port : 8000`);
});