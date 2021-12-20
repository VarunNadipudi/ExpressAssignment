const express = require('express');
const app  = express();
const PORT = 8000;

app.use(express.json());

app.post('/totalSalary', (req,res)=>{
  
  var basic = req.body.basic;
  var hra = req.body.hra;
  var da = req.body.da;
  var it = req.body.it;
  var pf = req.body.pf;

  var totalSalary = basic + hra + da - (it + pf);
  console.log(`Total salary is : ${totalSalary}`);
  res.send(`Total salary is : ${totalSalary}`);
});

app.listen(PORT, ()=>{
  console.log(`Server is running at port : ${PORT}`);
});
