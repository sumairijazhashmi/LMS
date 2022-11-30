// const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

function seedData(query)
{
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

let rosterSQL = `CREATE TABLE IF NOT EXISTS Roster (course_id INT NOT NULL, year_offered YEAR NOT NULL, sem_offered ENUM("fall", "spring") NOT NULL, student_id INT NOT NULL, instructor_id INT, PRIMARY KEY (course_id, year_offered, sem_offered, student_id);`; 

let courseSQL = `CREATE TABLE IF NOT EXISTS Course (course_id INT NOT NULL, year_offered YEAR NOT NULL, sem_offered ENUM("fall", "spring") NOT NULL, name char(50) NOT NULL, credit_hrs INT(1) NOT NULL, instructor INT NOT NULL, PRIMARY KEY(course_id, year_offered, sem_offered), FOREIGN KEY (instructor) REFERENCES Instructor (instructor_id));`;

const addCourseToStudent = async (courseID, studentID, year, semmester , instructor, res) => {
    try 
    {
        if (!courseID || !studentID ) {
            return res.status(400).render("addNewCourse", {message: "Please provide Course Code and/pr Student ID"});
        }

        else
        {
            
            year_offered = year
            sem_offered = semmester
            instructor_id = instructor

            let query = `Insert into Roster (course_id, year_offered, sem_offered, student_id, instructor_id) values("${courseID}", "${year_offered}", "${sem_offered}", "${studentID}", "${instructor_id}");`;
            // let query = `SELECT IFNULL( (SELECT year_offered,sem_offered,instructor FROM Course WHERE course_id="${courseID}" LIMIT 1) ,'not found');`
            let x = await seedData(query);
            console.log(x)
            res.redirect("/adminHome");

        }
       
    }
    catch (error) {
        console.log(error);
    }
};

const delCourseFromStudent = async (courseID, studentID, res) => {
    try 
    {
        if (!courseID || !studentID ) {
            return res.status(400).render("addNewCourse", {message: "Please provide Course Code and/pr Student ID"});
        }
        else
        {
            let query = `Delete from Roster where course_id="${courseID}" and student_id="${studentID}";`
            let x = await seedData(query);
            res.redirect("/adminHome");
        }

        
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    addCourseToStudent, delCourseFromStudent
};


