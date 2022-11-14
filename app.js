//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const helmet = require("helmet");
const ejs = require("ejs");
const _= require("lodash");
const cookieParser = require('cookie-parser')

const app = express();

const port = process.env.PORT || 5000

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { runInNewContext } = require("vm");
const { concat } = require("lodash");
const { start } = require("repl");


app.get("/main",(req,res)=>{
  res.render("main"); // file name original 
});
 
app.get("/home",(req,res)=>{
  res.render("home");
});

app.get("/",(req,res)=>{
    res.render("home");
})

app.post("/home",(req,res)=>{

  userName = req.body.userID;
  password = req.body.password

  console.log(userName, password)

  res.redirect("/main");

});


app.listen(5000,()=>{
  console.log("Server has started on port 5000");
});
