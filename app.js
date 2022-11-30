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
const postAssignment = require("./routes/postAssignment");
const uploadResource = require("./routes/addResources");
const fileUpload = require("express-fileupload");
const assignmentsTab = require("./routes/assignmentsTab");
const feedback = require("./routes/feedback");
const postFeedback = require("./routes/postFeedback");


// authorization\auth.js
const app = express();

const port = process.env.PORT || 5000


let courseID, sem, year; // please update these in course tab and stuff
// let assessmentID = 0; // when starting out, no assessments


// db.connect((err) => {
//   if(err){
//     console.log(err);
//   } 
//   else{
//     console.log("DATABASE CONNECTED")
//   }
// })
app.use(express.json());
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(fileUpload())
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const { runInNewContext } = require("vm");
const { concat } = require("lodash");
const { start } = require("repl");

app.use(cookieParser());
app.use(
  session({
    secret: 'jdsaid28y377321njdFASDQEN87HW123#!@32UDASD132',
    resave: false,
    saveUninitialized: false,
    cookie: {
      //max age is 20 minutes
      maxAge: 1000 * 60 * 20 
    }
  })
);




app.get("/main",(req,res)=>{
  res.render("main", {message: ""}); // file name original 
});

app.get("/adminHome",(req,res)=>{
  console.log(req.session.userinfo);
  if(req.session.userinfo && req.session.userinfo.role == 'admin'){
    res.render("adminhome", {message: ""}); // file name original 
  } else {
    res.redirect("/main");
  }
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
  console.log(req.session.userinfo);
  if(req.session.userinfo && req.session.userinfo.role == 'student'){
    res.render("studenthome", {message: ""}); // file name original 
  } else {
    res.redirect("/main");
  }

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
  console.log(req.session.userinfo);
  if(req.session.userinfo && req.session.userinfo.role == 'instructor'){
    res.render("instructorhome", {message: ""}); // file name original 
  } else {
    res.redirect("/main");
  }
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
  auth.login(username,password,res, req);
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
  req.session.destroy();
  res.redirect("main", {message: "Logged Out!"});
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
  else if(req.body.button == "postFeedback") {
    res.redirect("/postFeedback");
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
  else if(req.body.button == "viewAssignments") {
    res.redirect("/assignmentsTab");
  }
  else if(req.body.button == "viewFeedback") {
    res.redirect("/viewFeedback");
  }
});

app.get("/postAssignment", (req, res)=> {
  res.render("postAssignment", {message: ""});
})
app.get("/postFeedback", (req, res)=> {
  res.render("postFeedback", {message: ""});
})
app.post("/postFeedback",(req,res)=>{

  userID = req.body.userID
  courseID = req.body.courseID
  year = req.body.year
  sem = req.body.sem
  score = req.body.score


  postFeedback.postFeedback(userID, courseID, year, sem, score, res)
  
});
app.post("/postAssignment", (req, res)=> {
  title = req.body.assTitle;
  text = req.body.assText;
  file = req.files.assFile;
  file_name = file.name;
  marks = req.body.assMarks;
  due_date = req.body.submissionDate;
  release_date = req.body.releaseDate;
  course_name = req.body.courseName;
  course_code = req.body.courseCode;
  year = req.body.year;
  sem = req.body.sem;
  made_by = req.body.made_by;
  // console.log("title should be here", title);
  // assessment id = prev id + 1
  assessmentID = 49;
  postAssignment.postAssignment(assessmentID, title, text, file, file_name, marks, due_date, release_date, course_name, course_code, year, sem, made_by, res);
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



app.get("/assignmentsTab", (req, res) => {
   courseID = 420; // need to somehow store the course's specific ids here
   sem = "spring";
   year = 2022;
   (async () => {
    let result = await assignmentsTab.assignmentsTab(courseID, year, sem);
    console.log("here", result)
    res.render("assignmentsTab", {assignments: result});
  })();
});
app.get("/viewFeedback", (req, res) => {
  courseID = 420; // need to somehow store the course's specific ids here
  sem = "spring";
  year = 2022;
  studentID= 6;
  (async () => {
   let result = await feedback.feedback(courseID, year, sem, studentID);
   console.log("here", result)
   res.render("viewFeedback", {assignments: result});
 })();
});
app.get("/uploadResource", (req, res) => {
  res.render('uploadResource',
  {
    message:''
  })
});
app.post("/uploadResource", (req, res) => {
  file = req.files.resFile
  title = req.body.resTitle

  //replace these dummy values with session values
  resource_id = 0
  course_id=0
  resource_type="lectures"
  year_offered=2022
  sem_offered="spring"
  instructorID= 0
  uploadResource.uploadResource(resource_id, course_id, resource_type, year_offered, sem_offered, instructorID, file, res,title)
  /* For testing
  file.mv('./public/resources/'+file.name, async function(err) {
    if(err)
    {
      console.log(err)
    }
    else
    {
    console.log("uploaded---")
    res.render('uploadResource',
    {
      message:'Resource Uploaded.'
    })
    }
  }) 
  */
});
app.listen(5000,()=>{
  console.log("Server has started on port 5000");
});