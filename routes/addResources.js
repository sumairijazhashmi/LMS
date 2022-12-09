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

const uploadResource = async (course_id, resource_type,year_offered, sem_offered, made_by, file, res,title,s3) => {
    try {

        //try to make a unique FILE KEY. it will act as identifer to file in aws bucket.
        let resource_key=course_id+'-'+resource_type+'-'+title+'-'+file.name

        //console.log("file: ",file)

        //PARAMS to pass. No need to change if you have "file" in arguments.
        var params = {
            Key : resource_key,
            Body : file.data,
            Bucket: "cyclic-thoughtful-long-underwear-duck-eu-central-1",
            ContentType : file.mimetype //filetype pdf/docx/xls etc
        }
    

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
            var filesize_mb = file.size / (1024*1024) //find file size
                   
            //ALSO Save FILE KEY (resource_key in my case) in Database, so you can fetch it later.
            let query = `insert into Resources (course_id, resource_type, title, resource_path ,year_offered , sem_offered, made_by, file_size) values ( ${course_id}, "${resource_type}", "${title}","${resource_key}", ${year_offered}, "${sem_offered}", ${made_by}, ${filesize_mb});`; 
                await seedData(query);
                console.log("uploaded---")
                res.render("uploadResource", 
                {
                    message: "Resource Uploaded"
                });
            }
        });
        
           
    }
    catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadResource
};
