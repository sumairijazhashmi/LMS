const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

function seedData(query)
{
    console.log("hello i am here in seed\n");
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

const submitAssignment = async (courseID, year, sem, assessmentID, studentID, file, file_name, res) => {
    try {
        console.log("am i even here\n");
        // if(!title || !text || !total_marks || !due_date || !release_date || !course_name || !course_id || !year || !semester || !instructor_id || !file) {
        //     return res.status(400).render("updatePassword", {message: "Please provide all the required details."});
        // }
        // error checking not really required as this tab will be in course tab where metadata (e.g from cookie) will be available
        file.mv('public/assignments/self_assignments/' + file.name, async function(err) {
            let query = `insert into Attempts (student_id, course_id, year_offered, sem_offered, assessment_id, submitted_attachment, score) values ( ${studentID}, ${courseID}, ${year}, "${sem}", "${assessmentID}", "${file_name}", NULL);`; 
            await seedData(query);
            res.redirect("/studenthome");
            
            // return res.status(400).redirect("assignmentsTab", {message: "Assignment Submitted"}); 
        })
        
        // res.redirect("")
        

    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    submitAssignment
};