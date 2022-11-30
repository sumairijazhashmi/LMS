const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

const uid = function(){
    var i = new Date().getTime();
    i = i & 0xffff;
    return i;
}
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

const CreateAnnouncement = async (AnnouncementTitle, AnnouncementText, courseName, courseCode,year, sem, made_by, res) => {
    try 
    {
        if (!AnnouncementTitle|| !AnnouncementText|| !courseName|| !courseCode||!year||!sem || !made_by ) { 
            return res.status(400).render("CreateAnnouncement", {message: "Please provide sufficient info"});
        }

        else
        {
            var anouncementID = uid();
            console.log("id created",anouncementID)

            let query = `Insert into Announcements (announcement_id, made_by,heading, body_text, modified_date, course_id, year_offered, sem_offered) values("${anouncementID}", "${made_by}", "${AnnouncementTitle}","${AnnouncementText}", NOW(),"${courseCode}","${year}","${sem}");`;
            await seedData(query);
            console.log("Announcement added")
        }

        res.redirect("/instructorhome");

        
    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    CreateAnnouncement
};