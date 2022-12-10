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

const submitAssignment = async (courseID, year, sem, studentID, file, file_name, res, s3) => {
    try {

        let ass_key=courseID+'-'+sem+'-'+'-'+file_name

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
                let ass_data = courseID + "-" + year + "-" + sem + "-" + file_name;               
                let query = `insert into Attempts (student_id, course_id, year_offered, sem_offered, ass_data, submitted_attachment, score) values ( ${studentID}, ${courseID}, ${year}, "${sem}", "${ass_data}", "${ass_key}", NULL);`; 
                    await seedData(query);
                    console.log("uploaded---")
                    res.redirect("/studenthome")
            }
        });

        

    }
    catch (error) {
        console.log(error)
    }
    // try {


    //     let ass_key=course_id+'-'+'-'+title+'-'+file_name

    //     var params = {
    //         Key : ass_key,
    //         Body : file.data,
    //         Bucket: "cyclic-thoughtful-long-underwear-duck-eu-central-1",
    //         ContentType : file.mimetype //filetype pdf/docx/xls etc
    //     }

    //     console.log("am i even here\n");
    //     // if(!title || !text || !total_marks || !due_date || !release_date || !course_name || !course_id || !year || !semester || !instructor_id || !file) {
    //     //     return res.status(400).render("updatePassword", {message: "Please provide all the required details."});
    //     // }
    //     // error checking not really required as this tab will be in course tab where metadata (e.g from cookie) will be available
    //     var options = {partSize: 10 * 1024 * 1024, queueSize: 1};
    //     await s3.upload(params, options, async(err, data) => {
    //         if(err)
    //         {
    //             console.log(err)
    //         }
    //         {

    //         }

    //     // file.mv('public/assignments/self_assignments/' + file.name, async function(err) {
    //     //     let query = `insert into Attempts (student_id, course_id, year_offered, sem_offered, assessment_id, submitted_attachment, score) values ( ${studentID}, ${courseID}, ${year}, "${sem}", "${assessmentID}", "${file_name}", NULL);`; 
    //     //     await seedData(query);
    //     //     res.redirect("/studenthome");
            
    //     //     // return res.status(400).redirect("assignmentsTab", {message: "Assignment Submitted"}); 
    //     // })
        
    //     // res.redirect("")
        
    //     }
    // }
    // catch (error) {
    //     console.log(error)
    // }
}

async function manageFile(filepath,res,s3)
{
  //parameters to pass in fucntion
  const s3Params = {
    Bucket: "cyclic-thoughtful-long-underwear-duck-eu-central-1", //aws bucket name - 'DON'T CHNAGE IT
    Key: filepath + '' //FILE-Key
  };

  console.log("viewing");
 

  s3.getSignedUrl('getObject', s3Params, (err, data) => {
      if (err) {
        console.log(err);
        return res.end();
      }
      const returnData = {
          signedRequest: data,
      };
      x=returnData["signedRequest"]
      //console.log(x)
      res.writeHead(302, {
        'Location': x
      });
      res.end();
    });
}

module.exports = {
    submitAssignment, manageFile
};
