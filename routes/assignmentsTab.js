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

const assignmentsTab = async (courseID, year, sem, res) => {
    let query = `select * from Assessments where course_ID = ${courseID} and year_offered = ${year} and sem_offered = "${sem}";`;
    let x = await seedData(query);
    console.log("did i reach here\n");
    try{ //if result has some files
        // console.log("123", typeof x);
        console.log(x[0].ass_key)
        res.render("assignmentsTab", {
        status:"display: block",
        noRecords:"display: none",
        data:x
      });
      }
      catch //if result is empty
      { 
        console.log("no records")
        res.render("assignmentsTab", {
        status:"display: none",
        noRecords:"display: block",
        data:""
      });
      }
    return x;
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
    assignmentsTab, manageFile
}
