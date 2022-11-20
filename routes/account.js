
const connectionString = require ("../db_config/db");
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
     user: 'lumslms2022@gmail.com',
     pass: 'foeggynvmyulwyim'
   }
});


function seedData(query)
{
    /*
    Call this fuction to  insert a record into your db to the respective table using 
    the query.The variable query corresponds to the sql query you will write to accomplish this. 
     */
    return new Promise((resolve, reject)=>{
      connectionString.query(query,
      (err2,result)=>
      {
          if(err2)
          {
              console.log("Seeding Failed");
              reject(err2);
          }
          else
          {
              resolve(result)
              console.log("Seeding done");
              console.log(result[0])
          }
       });
      });
}
function sendEmail(email,text)
{
   var mailOptions = {
     from: 'LUMS LMS',
     to: email,
     subject: 'LMS Login Credentails | LUMS',
     text: text
   };
  
   transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
     } else {
       console.log('Email sent: ' + info.response);
     }
   });
}

async function addAcc (userName, password1,name1,email,radio,my_var,res)
{
  let selectDBSQL = `USE LMS`;
  await seedData(selectDBSQL);
  let account_query = `select * from Account where username="${userName}";`;
  let x= await seedData(account_query);
  console.log(x[0])
  let f=null
  try{
    f=x[0].username;
    console.log(x[0].username)
  }
  catch
  {
    console.log("new")
  }
  console.log(f)
  if(f)
  {
    console.log('exists')
    //console.log(x)
    my_var="Username exists"
    res.render("register", {
      myVar: my_var
  });
  my_var=""
  }
  else
  {
    let query = `insert into Account (username, password, role, email, name) values("${userName}","${password1}", "${radio}","${email}", "${name1}")`;
    await seedData(query);
    if (radio=="instructor")
    {
      let query = `insert into Instructor (instructor_id, password, role, email, name) values("${userName}","${password1}", "${radio}","${email}", "${name1}")`;
    await seedData(query);
    console.log("instructor added")
    }
    else if (radio=="student"){
      let query = `insert into Student (student_id, password, role, email, name) values("${userName}","${password1}", "${radio}","${email}", "${name1}")`;
    await seedData(query);
    console.log("student added")
    }
    else
    {
      let query = `insert into Admin (admin_id, password, role, email, name) values("${userName}","${password1}", "${radio}","${email}", "${name1}")`;
      await seedData(query);
      console.log("admin added") 
    }
    console.log("created---------")
    my_var="Account created. Credential email sent to user."
    text=`Dear ${name1},\n\tHope you are doing well. We congratulate you on Joining LUMS. Please find your LMS login credentials below.
    \nUsername: ${userName}
    \nPassword: ${password1}
    \nPlease DO NOT share your credentails with anyone.\nLMS link: http://127.0.0.1:5000/login
    \nRegards,\nOffice of the Registrar, LUMS
    `
    sendEmail(email,text)
    res.render("message", {
      myVar: "Account Created.",
      extra: "Login Credentials are sent through email."
  });
  my_var=""
}
}

async function delAcc(req,res){
    userID = req.body.id1;
  let selectDBSQL = `USE LMS;`;
  await seedData(selectDBSQL);
  let account_query = `select * from Account where username="${userID}";`;
  let x= await seedData(account_query);
  console.log(x[0])
  let f=null
  try{
    f=x[0].username;
    console.log(x[0].username)
    res.render("delete", {
      status:"display: block",
      noRecords:"display: none",
      data:x[0]
  });
  }
  catch
  {
    console.log("no records")
    res.render("delete", {
      status:"display: none",
      noRecords:"display: block",
      data:""
  });
  }
}

async function delDetail(id1,role,res)
{
    console.log("id:---------------")
  console.log(id1)
  console.log(role)
  if(role=="student")
  {
    let account_query = `Delete from Student where student_id="${id1}";`;
    let x= await seedData(account_query);
    console.log("delete student")
  }
  else if(role=="instructor")
  {
    let account_query = `Delete from Instructor where instructor_id="${id1}";`;
    let x= await seedData(account_query);
    console.log("delete instructor")
  }
  else if(role=="admin")
  {
    let account_query = `Delete from Admin where admin_id="${id1}";`;
    let x= await seedData(account_query);
    console.log("delete admin")
  }
  let account_query = `Delete from Account where username="${id1}";`;
  let x= await seedData(account_query);
  console.log("delete account")
  res.render("message", {
    myVar: "Account Deleted.",
    extra: ""
});
}

module.exports = {
    addAcc, delAcc, delDetail
};
