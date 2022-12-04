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

async function viewResource(courseID,year,semester,res){
  let selectDBSQL = `USE LMS;`;
  await seedData(selectDBSQL);
  let resource_query = `select * from Resources where course_id=${courseID} and year_offered=${year} and sem_offered="${semester}";`;
  let x= await seedData(resource_query);
  console.log(x)
  let f=null
  try{
    f=x[0].resource_path;
    console.log(x[0].resource_path)
    let s=x[0].resource_path.split('.')
    console.log('extension:',s[s.length-1])
    res.render("viewResources", {
      status:"display: block",
      noRecords:"display: none",
      data:x,
      extension:s[s.length-1]
  });
  }
  catch
  {
    console.log("no records")
    res.render("viewResources", {
      status:"display: none",
      noRecords:"display: block",
      data:"",
      extension:""
  });
  }
}
module.exports = {
    viewResource
};