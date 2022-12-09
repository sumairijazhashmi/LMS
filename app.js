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
const student_course=require("./routes/student_course");
const CreateAnnouncement = require("./routes/CreateAnnouncement");
const postFeedback = require("./routes/postFeedback");
const submitAssignment = require("./routes/submitAssignment");
const viewCourses = require("./routes/viewCourses");
const fs = require('fs');
const viewResource=require('./routes/viewResource');
const viewRoster=require('./routes/viewRoster');
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
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
// const { viewCourses } = require("./routes/viewCourses");

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

app.get("/student_course",(req,res)=>{
  res.render("student_course", {message: ""}); // file name original 
}
);

app.get("/searchCourse",(req,res)=>{
  res.render("searchCourse", {message: ""}); // file name original 
}
);


app.get("/del_student_course",(req,res)=>{
  res.render("del_student_course", {message: ""}); // file name original 
}
);

app.get("/studenthome",(req,res)=>{
  console.log(req.session.userinfo);
  if(req.session.userinfo && req.session.userinfo.role == 'student'){
    // call the viewCourses function
    viewCourses.viewCourses(req.session.userinfo.username, req.session.userinfo.role, res);
  } else {
    res.redirect("/main");
  }
}
);
//     res.render("studenthome", {message: ""}); // file name original 
//   } else {
//     res.redirect("/main");
//   }

// }
// );

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
    viewCourses.viewCourses(req.session.userinfo.username, req.session.userinfo.role, res);
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

app.post("/student_course",(req,res)=>{

  courseID = req.body.courseCode
  studentID = req.body.studentID
  year = req.body.year
  semmester = req.body.sem
  instructor = req.body.instructor


  student_course.addCourseToStudent(courseID, studentID, year, semmester , instructor, res)
  
});

app.post("/del_student_course",(req,res)=>{

  courseID = req.body.courseCode
  studentID = req.body.studentID


  student_course.delCourseFromStudent(courseID, studentID, res)
  
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
  else{
    var obj = JSON.parse(req.body.button);
    console.log("tab:", obj);
    req.session.userinfo.courseID = obj.course_id;
    req.session.userinfo.sem = obj.sem;
    req.session.userinfo.year = obj.year;
    if(obj.tab == 'CreateAnnouncement')
    {
      res.redirect("/CreateAnnouncement");
    }
    else if(obj.tab== "addAssignment") {
      res.redirect("/postAssignment");
    }
    else if(obj.tab == "postFeedback") {
      
      res.redirect("/postFeedback");
    }
    else if(obj.tab== "uploadResources") {
      res.redirect("/uploadResources");
    }
    else if(obj.tab == "viewRoster") {
      res.redirect("/viewRoster");
    }
  }
  
});

app.post("/studenthome",(req,res)=>{

  console.log(req.body.button);
  // req.body.button is a json object with two values tab and course_id
  // parse the object
  if(req.body.button == 'updatePassword')
  {
    res.redirect("/updatePassword");
  }
  else if(req.body.button == 'logout')
  {
    res.render("main", {message: "Logged Out!"});
  }
  else{
    var obj = JSON.parse(req.body.button);
    console.log(obj.tab);
    console.log("session keys------------------");
    console.log(req.session.userinfo);
    req.session.userinfo.courseID = obj.course_id;
    req.session.userinfo.sem = obj.sem;
    req.session.userinfo.year = obj.year;
    if(obj.tab == "viewAssignments") {
      res.redirect("/assignmentsTab");
    }
    else if(obj.tab == "viewFeedback") {
      res.redirect("/viewFeedback");
    }
    else if(obj.tab == "viewResources") {
      res.redirect("/viewResources");
    }
    else if(obj.tab == "viewAnnouncements") {
      res.redirect("/viewAnnouncements");
    }
    else if(obj.tab == "viewRoster") {
      res.redirect("/viewRoster");
    }
  }
});

app.get("/postFeedback", (req, res)=> {
  console.log("HI I AM HERE")
  res.render("postFeedback", {message: ""});
})
app.post("/postFeedback",(req,res)=>{
  console.log(req.session.userinfo)
  userID = req.body.userID
  courseID = req.session.userinfo.courseID
  year = req.session.userinfo.year
  sem = req.session.userinfo.sem
  score = req.body.score
  assessmentID = req.body.assessmentID
  console.log("userID: ", userID)
  console.log("courseID: ", courseID)
  console.log("year: ", year)
  console.log("sem: ", sem)
  console.log("score: ", score)
  console.log("assessmentID: ", assessmentID)

  postFeedback.postFeedback(userID, courseID, year, sem, assessmentID, score, res)
  
});

app.get("/postAssignment", (req, res)=> {
  res.render("postAssignment", {message: ""});
})

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
  assessmentID = 50;
  postAssignment.postAssignment(assessmentID, title, text, file, file_name, marks, due_date, release_date, course_name, course_code, year, sem, made_by, res);
})

app.get("/CreateAnnouncement", (req, res)=> {
  res.render("CreateAnnouncement", {message: ""});
})

app.post("/CreateAnnouncement", (req, res)=> {

  
  title = req.body.AnnouncementTitle;
  text = req.body.AnnouncementText;
  course_name = req.body.courseName;
  course_code = req.body.courseCode;
  year = req.body.year;
  sem = req.body.sem;
  made_by = req.body.made_by;
  // console.log("title should be here", title);
  // assessment id = prev id + 1
  // assessmentID = 49;
  CreateAnnouncement.CreateAnnouncement(title, text, course_name, course_code,year, sem, made_by, res);
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

app.post("/assignmentsTab", (req, res) => {

  if(req.body.button == "SubmitAss") {
    courseID = 420; // need to somehow store the course's specific ids here
    sem = "spring";
    year = 2022;
    studentID = 421;
    assessmentID = 1; 
    file = req.files.assFile;
    file_name = file.name;
    submitAssignment.submitAssignment(courseID, year, sem, assessmentID, studentID, file, file_name, res);
  }
});

app.get("/viewFeedback", (req, res) => {
  courseID = req.session.userinfo.courseID; // need to somehow store the course's specific ids here
  sem = req.session.userinfo.sem;
  year = req.session.userinfo.year;
  studentID= req.session.userinfo.username;
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

  uploadResource.uploadResource(100, "lecture", 2001, "fall", 1234, file, res,title,s3)
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
app.get('/file/:filepath',async (req,res)=>{
  //console.log("path:",req.params.filepath)
  viewResource.manageFile(req.params.filepath,res,s3) //S3 is aws bucket instance

});
app.get('/viewResources',(req,res)=>{
  viewResource.viewResource(req.session.userinfo.courseID,req.session.userinfo.year,req.session.userinfo.sem,res);
});

app.get('/viewRoster',(req,res)=>{
  viewRoster.viewRoster(req.session.userinfo.courseID,req.session.userinfo.year,req.session.userinfo.sem,res);
});

app.listen(5000,()=>{
  console.log("Server has started on port 5000");
});
