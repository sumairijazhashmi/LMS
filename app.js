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
  console.log(req);
  res.render("adminHome", {message: ""}); // file name original 
}
);

app.get("/updatePassword",(req,res)=>{
  console.log(req);
  res.render("updatePassowrd", {message: ""}); // file name original 
}
);

app.get("/addNewCourse",(req,res)=>{
  console.log(req);
  res.render("addNewCourse", {message: ""}); // file name original 
}
);

app.get("/removeExistingCourse",(req,res)=>{
  console.log(req);
  res.render("removeExistingCourse", {message: ""}); // file name original 
}
);

app.get("/updateProfile",(req,res)=>{
  console.log(req);
  res.render("updateProfile", {message: ""}); // file name original 
}
);

// User will first have to login on main page only then he can access his/her home page
app.get("/",(req,res)=>{
  console.log(req);
  res.render("main", {message: ""}); // file name original 
}
);

app.get("/home",(req,res)=>{
  console.log(req);
  res.render("home", {message: ""}); // file name original 
}
);

app.get("/",(req,res)=>{
    res.render("main", {message: ""});
})

app.post("/main",(req,res)=>{
  username = req.body.userID;
  password = req.body.password;
  console.log(username);
  console.log(password);
  auth.login(username,password, res);
}
);

app.listen(5000,()=>{
  console.log("Server has started on port 5000");
});
