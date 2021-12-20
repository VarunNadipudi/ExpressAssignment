const express = require('express');
const app = express();

app.use(express.json());

app.post("/login", (req,res)=>{
  console.log("Hello from express!");

  // var emailId = req.query.emailId;
  // var password = req.query.password;

  var emailInput = req.body.emailId;
  var pwdInput = req.body.password;

  console.log(`The emailId is ${emailInput} and password is ${pwdInput}`);

  var strToReturn = "Invalid User";

  if(emailInput=='varunnadipudi.vn@gmail.com' && pwdInput=='qwerty'){
    strToReturn = "Valid user!";
  }

  res.send(strToReturn);
});





var emp = [
  {
    "id" : 102,
    "name" : "Varun",
    "department" : "IT",
    "designation" : "Fullstack Developer"
  },
  {
    "id" : 103,
    "name" : "Vishal",
    "department" : "IT",
    "designation" : "UI/UX"
  },
  {
    "id" : 104,
    "name" : "Pooh",
    "department" : "IT",
    "designation" : "SDE"
  },
  {
    "id" : 105,
    "name" : "Mok",
    "department" : "HR",
    "designation" : "Senior HR"
  },
];


//Displaying all Employees
app.get("/getAllEmployeeData",(req,res)=>{
  res.send(emp);
});

//getting Employee by Id
app.get("/getEmployeeById/:id", (req,res)=>{

  var empId = req.params.id;
  var result = {};

  for(var i=0;i<emp.length;i++){
    if(emp[i].id == empId){
      result = emp[i];
    }
  }

  res.send(result);
});


//getting employeeBy Name
app.get("/getEmployeeByName/:name", (req,res)=>{

  var employee = emp.filter( e => e.name == req.params.name);

  res.send(employee);
});

//inserting Employee
app.post("/insertEmployee", (req,res)=>{

  var employee = {
    "id" : req.body.id,
    "name" : req.body.name,
    "department" : req.body.department,
    "designation" : req.body.designation
  };
  emp.push(employee);

  res.send("Employee inserted successfully!");

});

//updating the Employee data with data from put request to updateEmployee
app.put('/updateEmployee', (req,res)=>{
  var employeeId = req.body.id;
  for(var i=0;i<emp.length;i++){
    if(emp[i].id == employeeId){
      emp[i].id = req.body.id;
      emp[i].name = req.body.name;
      emp[i].department = req.body.department;
      emp[i].designation = req.body.designation;
    }
  }

  res.send("Employee data updated successfully!");

});

//deleting the employee with the given id
app.delete('/deleteEmployee/:id', (req,res)=>{
  var employeeId = req.params.id;
  var start = 0;
  for(var i=0;i<emp.length;i++){
    if(emp[i].id == employeeId){
      start = i;
      break;
    }
  }

  emp.splice(start,1);

  res.send(`Employee with id : ${employeeId} has been deleted successfully!`);
});


app.listen(8000, ()=>{
  console.log("Server is running at port : 8000");
});