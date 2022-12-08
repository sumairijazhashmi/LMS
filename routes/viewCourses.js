const connectionString = require ("../db_config/db");

function seedData(query)
{
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
          }
       });
      });
}

const viewCourses = async (user_id, role, res) => {
    try 
    {
        if (!user_id || !role ) {
            return res.status(400).render("viewCourses", {message: "Please provide User ID and/or Role"});
        }
        else if (role == "student")
        {
            // INSERT INTO ROSTER FIRST
            // ROSTER FORMAT: (course_id INT NOT NULL, year_offered YEAR NOT NULL, sem_offered ENUM("fall", "spring") NOT NULL, student_id INT NOT NULL, instructor_id INT, PRIMARY KEY (course_id, year_offered, sem_offered, student_id)
            let query = `SELECT * FROM Course WHERE course_id IN (SELECT course_id FROM Roster WHERE student_id = "${user_id}");`;
            let x = await seedData(query);
            // now split the courses obtained on the basis of year and semester
            // first get number of unique years in the courses
            let years = []
            for (let i = 0; i < x.length; i++)
            {
                if (!years.includes(x[i].year_offered))
                {
                    years.push(x[i].year_offered)
                }
            }
            // now get number of unique semesters for each year
            let semesters = []
            for (let i = 0; i < years.length; i++)
            {
                for (let j = 0; j < x.length; j++)
                {
                    if (x[j].year_offered == years[i] && !semesters.includes(x[j].sem_offered))
                    {
                        semesters.push(x[j].sem_offered)
                    }
                }
            }
            // now create a dictionary of courses for each year and semester.
            // format of courses: {year: {semester: [course1, course2, ...]}}
            let courses = {}
            for (let i = 0; i < years.length; i++)
            {
                courses[years[i]] = {}
                for (let j = 0; j < semesters.length; j++)
                {
                    courses[years[i]][semesters[j]] = []
                    for (let k = 0; k < x.length; k++)
                    {
                        if (x[k].year_offered == years[i] && x[k].sem_offered == semesters[j])
                        {
                            courses[years[i]][semesters[j]].push(x[k])
                        }
                    }
                }
            }

            // here courses is stored as a json object
            console.log(courses)
            // send an ok response
            res.render("studenthome", {message: "Courses obtained", courses: courses});
        }
        else if (role == "instructor")
        {
            let query = `SELECT * FROM Course WHERE course_id IN (SELECT course_id FROM Roster WHERE instructor_id = "${user_id}");`;
            let x = await seedData(query);
            // now split the courses obtained on the basis of year and semester
            // first get number of unique years in the courses
            let years = []
            for (let i = 0; i < x.length; i++)
            {
                if (!years.includes(x[i].year_offered))
                {
                    years.push(x[i].year_offered)
                }
            }
            // now get number of unique semesters for each year
            let semesters = []
            for (let i = 0; i < years.length; i++)
            {
                for (let j = 0; j < x.length; j++)
                {
                    if (x[j].year_offered == years[i] && !semesters.includes(x[j].sem_offered))
                    {
                        semesters.push(x[j].sem_offered)
                    }
                }
            }
            // now create a dictionary of courses for each year and semester.
            // format of courses: {year: {semester: [course1, course2, ...]}}
            let courses = {}
            for (let i = 0; i < years.length; i++)
            {
                courses[years[i]] = {}
                for (let j = 0; j < semesters.length; j++)
                {
                    courses[years[i]][semesters[j]] = []
                    for (let k = 0; k < x.length; k++)
                    {
                        if (x[k].year_offered == years[i] && x[k].sem_offered == semesters[j])
                        {
                            courses[years[i]][semesters[j]].push(x[k])
                        }
                    }
                }
            }

            // here courses is stored as a json object
            console.log(courses)
            // send an ok response
            res.render("instructorhome", {message: "Courses obtained", courses: courses});
            // res.render("viewCourses", {message: "Courses", courses: x});
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    viewCourses
};
