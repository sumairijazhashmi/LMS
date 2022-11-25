//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const ejs = require("ejs");
const _= require("lodash");
const cookieParser = require('cookie-parser')
const db = require("./db_config/db");
const auth = require("./authorization/auth.js");
const session = require('express-session');
const passport = require("passport");
const accounts=require("./routes/account");
const updatePass=require("./routes/updatePass");
const courses=require("./routes/courses");
const updateProfile=require("./routes/updateProfile");

// authorization\auth.js
const app = express();

const port = process.env.PORT || 5000


// db.connect((err) => {
//   if(err){
//     console.log(err);
//   } 
//   else{
//     console.log("DATABASE CONNECTED")
//   }
// })

app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { runInNewContext } = require("vm");
const { concat } = require("lodash");
const { start } = require("repl");


app.get("/main",(req,res)=>{
  res.render("main", {message: ""}); // file name original 
});

app.get("/adminHome",(req,res)=>{
  res.render("adminHome", {message: ""}); // file name original 
}
);

app.get("/updatePassword",(req,res)=>{
  res.render("updatePassword", {message: ""}); // file name original 
}
);

app.get("/addNewCourse",(req,res)=>{
  res.render("addNewCourse", {message: ""}); // file name original 
}
);

app.get("/studenthome",(req,res)=>{
  res.render("studenthome", {message: ""}); // file name original 
}
);

app.get("/removeExistingCourse",(req,res)=>{
  res.render("removeExistingCourse", {message: ""}); // file name original 
}
);

app.get("/updateProfile",(req,res)=>{
  res.render("updateProfile", {message: ""}); // file name original 
}
);

app.get("/instructorhome",(req,res)=>{
  res.render("instructorhome", {message: ""}); // file name original 
}
);

// User will first have to login on main page only then he can access his/her home page
app.get("/",(req,res)=>{
  res.render("main", {message: ""});
}
);

app.get("/home",(req,res)=>{
  // console.log(req);
  res.render("home", {message: ""}); // file name original 
}
);

app.get("/",(req,res)=>{
    res.render("main", {message: ""});
})

app.post("/login",(req,res)=>{
  username = req.body.userID;
  password = req.body.password;
  // console.log(username);
  // console.log(password);

  auth.login(username,password,res);
}
);

app.get("/message",(req,res)=>{
  res.render("message", {
    myVar: "Account Created.",
    extra: "Login Credentials are sent through email."
});
});


app.get("/delete",(req,res)=>{
  res.render("delete", {
    status:"display: none",
    noRecords:"display: none",
    data: ""
});
});
app.post("/deleteDetails/:id/:role",async(req,res)=>{
  let id1 = req.params.id;
  let role=req.params.role;
  accounts.delDetail(id1,role,res);
})

app.get("/register",(req,res)=>{
  res.render("register", {
    myVar: ""
});
})

app.get("/logout",(req,res)=>{
  res.render("main", {message: "Logged Out!"});
})

app.post("/delete",async (req,res)=>{
  accounts.delAcc(req,res);
});

app.post("/updatePassword",(req,res)=>{

  userID = req.body.userID
  oldPass = req.body.oldPass
  newPass = req.body.newPass
  rePass = req.body.rePass


  updatePass.updatePass(userID, oldPass, newPass, rePass, res)
  
});

app.post("/updateProfile",(req,res)=>{

  userID = req.body.userID
  // newUserID = req.body.newUserID
  newName = req.body.newName
  newEmail = req.body.newEmail
  // newRole = req.body.newRole


  updateProfile.updateProfile(userID, newName, newEmail, res)
  
});

app.post("/addNewCourse",(req,res)=>{

  courseName = req.body.courseName
  courseCode = req.body.courseCode
  instructor = req.body.instructor
  year = req.body.year
  semmester = req.body.sem
  credit_hrs = req.body.credit_hrs

  courses.addCourse(courseName, courseCode, instructor, year, semmester, credit_hrs, res)
  
});

app.post("/removeExistingCourse",(req,res)=>{

  courseName = req.body.courseName
  courseCode = req.body.courseCode

  courses.delCourse(courseName, courseCode, res)
  
});

app.post("/instructorhome",(req,res)=>{

  if(req.body.button == 'updatePassword')
  {
    res.redirect("/updatePassword");
  }
  else if(req.body.button == 'logout')
  {
    res.render("main", {message: "Logged Out!"});
  }
  else if(req.body.button == "addAssignment") {
    res.redirect("/postAssignment");
  }
  
});

app.post("/studenthome",(req,res)=>{

  if(req.body.button == 'updatePassword')
  {
    res.redirect("/updatePassword");
  }
  else if(req.body.button == 'logout')
  {
    res.render("main", {message: "Logged Out!"});
  }
  
});

app.get("/postAssignment", (req, res)=> {
  res.render("postAssignment", {message: ""});
})

app.post("/register",async (req,res)=>{
  my_var="";
  userName = req.body.username;
  name1=req.body.fullName;
  email = req.body.emailAddress;
  password1 = req.body.password1;
  password2 = req.body.password2;
  radio=req.body.optradio;
  console.log("hiii");
  console.log(userName, password1,name1,email,password2,radio);
  accounts.addAcc(userName, password1,name1,email,radio,my_var,res);
});

app.listen(5000,()=>{
  console.log("Server has started on port 5000");
});