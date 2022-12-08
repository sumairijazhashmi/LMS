const connectionString = require ("../db_config/db");

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

async function viewRoster(courseID,year,semester,res){
  let selectDBSQL = `USE LMS;`;
  await seedData(selectDBSQL);
//   let query0 =  `insert into Roster (course_id,year_offered,sem_offered, student_id, instructor_id) values (${courseID},${year},"${semester}",6,1234);`;
//   await seedData(query0);
  let Roster_query = `select * from Roster where course_id=${courseID} and year_offered=${year} and sem_offered="${semester}";`;
  let x= await seedData(Roster_query);
  console.log("HELLO", x)
  let f=null
  try{
    res.render("viewRoster", {
      status:"display: block",
      noRecords:"display: none",
      data:x,
  });
  }
  catch
  {
    console.log("no records")
    res.render("viewRoster", {
      status:"display: none",
      noRecords:"display: block",
      data:"",
      extension:""
  });
  }
}
module.exports = {
    viewRoster
};