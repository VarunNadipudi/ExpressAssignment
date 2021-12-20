const express = require('express');
const Sequelize = require('sequelize');
const dbconfig = require('./db.config');
const PORT = 8000;

const app  = express();
app.use(express.json());

//creating the sequelize object with the database parameters to connect to it
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

//defining the usersTable
let usersTable = sequelize.define('usersTable',{
  userId : {
    primaryKey : true,
    type : Sequelize.INTEGER
  },
  password : Sequelize.STRING,
  role : Sequelize.STRING
}, {
  timestamps : false,
  freezeTableName : true
});

//creating the usersTable
usersTable.sync().then( ()=>{
  console.log("Table created successfully!");
})
.catch( (error)=>{
  console.log(error);
})
.finally( ()=>{
  sequelize.close();
});

app.post('/register', (req,res)=>{
  //insert the details into the DB using Sequelize
  usersTable.create({
    userId : req.body.userId,
    password : req.body.password,
    role : req.body.role
  })
  .then( ()=>{
    console.log("User Registered successfull!");
    res.status(200).send("User Registered successfully!");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

app.post('/login', (req,res)=>{
  //find the user by userId using Sequelize
  usersTable.findAll({raw:true}).then( (data)=>{
    bFlag = false;
    for(var i=0;i<data.length;i++){
      if(data[i].userId == req.body.userId && data[i].password == req.body.password){
        bFlag = true;
        break;
      }
    }

    if(bFlag == true){
      console.log("Valid User!");
      res.status(200).send("Valid user!");
    }
    else{
      console.log("Invalid User!");
      res.status(401).send("Invalid user!");
    }

  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

app.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`);
});