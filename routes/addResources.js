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

const uploadResource = async (course_id, resource_type,year_offered, sem_offered, made_by, file, res,title) => {
    try {
        let resource_path='./public/resources/' + course_id+'-'+resource_type+'-'+title+'-'+file.name
        
      file.mv(resource_path, async function(err) {
        //----UNCOMMENT THIS when we have course,instructor IDs------//

        var stats = fs.statSync(resource_path)
        var filesize_mb = stats.size / (1024*1024)
                    
        let query = `insert into Resources (course_id, resource_type, title, resource_path ,year_offered , sem_offered, made_by, file_size) values ( ${course_id}, "${resource_type}", "${title}","${resource_path}", ${year_offered}, "${sem_offered}", ${made_by}, ${filesize_mb});`; 
            await seedData(query);
            console.log("uploaded---")
            res.render("uploadResource", 
            {
                message: "Resource Uploaded"
            });
        })       
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadResource
};