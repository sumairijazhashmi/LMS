const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();
var fs = require("fs"); //Load the filesystem module


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

const postAssignment = async (title, text, file,file_name, total_marks, due_date, release_date, course_name, course_id, year, semester, instructor_id, res, s3) => {
    try {

        let ass_key=course_id+'-'+'-'+title+'-'+file_name

        var params = {
            Key : ass_key,
            Body : file.data,
            Bucket: "cyclic-thoughtful-long-underwear-duck-eu-central-1",
            ContentType : file.mimetype //filetype pdf/docx/xls etc
        }

        console.log("am i even here\n");

        //-------------
        //Uploads file in aws bucket.
        //NO NEED TO CHANGE
        var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
        await s3.upload(params, options, async(err, data) => {
            if(err)
            {
                console.log(err)
            }
            else
            {    
                let ass_data = course_id + "-" + year + "-" + semester + "-" + due_date;               
                let query = `insert into Assessments (topic, ass_text, assignment_file, released_date, due_date, max_points, course_ID, year_offered, sem_offered, made_by, ass_data) values ("${title}", "${text}", "${ass_key}", "${release_date}", "${due_date}", ${total_marks}, ${course_id}, ${year}, "${semester}", ${instructor_id}, "${ass_data}");`; 
                    await seedData(query);
                    console.log("uploaded---")
                    res.render("postAssignment", 
                    {
                        message: "Assignment Uploaded"
                    });
            }
        });


        // if(!title || !text || !total_marks || !due_date || !release_date || !course_name || !course_id || !year || !semester || !instructor_id || !file) {
        //     return res.status(400).render("updatePassword", {message: "Please provide all the required details."});
        // }
        // error checking not really required as this tab will be in course tab where metadata (e.g from cookie) will be available
        // file.mv('public/assignments/uploaded_assignments' + file.name, async function(err) {
        //     let query = `insert into Assessments (assessment_id, topic, ass_text, assignment_file, released_date, due_date, max_points, course_ID, year_offered, sem_offered, made_by) values ( ${assessment_id}, "${title}", "${text}", "${file_name}", "${release_date}", "${due_date}", ${total_marks}, ${course_id}, ${year}, "${semester}", ${instructor_id});`; 
        //     await seedData(query);
        //     res.render("postAssignment", {message: "Assignment Uploaded!"});
        // })
        
        // res.redirect("")
        

    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    postAssignment
};
