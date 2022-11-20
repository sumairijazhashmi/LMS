const lms_db = require ("../db_config/db");
const connectionString = require ("../db_config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser')
const dotenv = require("dotenv").config();

function seedData(query)
{
    /*
    Call this fuction to  insert a record into your db to the respective table using 
    the query.The variable query corresponds to the sql query you will write to accomplish this. 
     */
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

const updateProfile = async (userID, newName, newEmail, res) => {
    try {
        if (!userID) {
            return res.status(400).render("updateProfile", {message: "Please provide an ID"});
        }

        lms_db.query("SELECT * FROM Account WHERE username = ?", [userID], async (error, results) => {

            oldEmail = results[0].email
            oldName = results[0].name

            if(newName && newName !== oldName)
            {
                let account_query = `Update Account Set name="${newName}" where username="${userID}";`;
                let x = await seedData(account_query);
                if (results[0].role == 'instructor')
                {
                    let account_query = `Update Instructor Set name="${newName}" where instructor_id="${userID}";`;
                    let x = await seedData(account_query);
                }
                else if (results[0].role == 'admin')
                {
                    let account_query = `Update admin Set name="${newName}" where admin_id="${userID}";`;
                    let x = await seedData(account_query);
                }
                else if (results[0].role == 'student')
                {
                    let account_query = `Update Student Set name="${newName}" where student_id="${userID}";`;
                    let x = await seedData(account_query);
                }
                
            }
             
            if(newEmail && newEmail !== oldEmail)
            {
                let account_query = `Update Account Set email="${newEmail}" where username="${userID}";`;
                let x = await seedData(account_query);
                if (results[0].role == 'instructor')
                {
                    let account_query = `Update Instructor Set email="${newEmail}" where instructor_id="${userID}";`;
                    let x = await seedData(account_query);
                }
                else if (results[0].role == 'admin')
                {
                    let account_query = `Update admin Set email="${newEmail}" where admin_id="${userID}";`;
                    let x = await seedData(account_query);
                }
                else if (results[0].role == 'student')
                {
                    let account_query = `Update Student Set email="${newEmail}" where student_id="${userID}";`;
                    let x = await seedData(account_query);
                }
            }

            // if(newRole && newRole !== oldRole)
            // {
            //     let account_query = `Update Account Set role=${newRole} where username="${userID}";`;
            //     let x = await seedData(account_query);
            // }


                
            // }
            res.redirect("/adminHome");
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    updateProfile
};


