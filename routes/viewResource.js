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


//fucntion that runs in GET viewResource. To display all available resources
async function viewResource(courseID,year,semester,res){

  let selectDBSQL = `USE LMS;`;
  await seedData(selectDBSQL);
  let resource_query = `select * from Resources where course_id=${courseID} and year_offered=${year} and sem_offered="${semester}";`;
  let x= await seedData(resource_query);
  //console.log(x)
  try{ //if result has some files
    console.log(x[0].resource_path)
    res.render("viewResources", {
      status:"display: block",
      noRecords:"display: none",
      data:x
  });
  }
  catch //if result is empty
  { 
    console.log("no records")
    res.render("viewResources", {
      status:"display: none",
      noRecords:"display: block",
      data:""
  });
  }
}


//Function to view/Download single resource file. Called in GET /file/:filepath.
async function manageFile(filepath,res,s3)
{
  //parameters to pass in fucntion
  const s3Params = {
    Bucket: "cyclic-thoughtful-long-underwear-duck-eu-central-1", //aws bucket name - 'DON'T CHNAGE IT
    Key: filepath + '' //FILE-Key
  };

  console.log("viewing");
 
  //-----------------------------------------------------------------
  //Gets signed URL of file in aws bucket
  //It will open pdf file in new tab and download any other file type
  //NOT NEED TO EDIT IT
  //----------------------------------------------------------

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
    viewResource, manageFile
};
