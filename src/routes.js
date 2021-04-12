const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/"
const profile = {
    name: "Wéberton",
    avatar: "https://github.com/WebertonMendes.png",
    "monthly-budget": 3000,
    "hours-per-day": 5,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}

const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 60,
        created_at: Date.now()
    },
    {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now()
    }
]

function remainingDays(job) {
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()

    const createdDate = new Date(job.created_at)
    const dueDay = createdDate.getDate() + Number(remainingDays)
    const dueDateInMs = createdDate.setDate(dueDay)

    const timeDiffInMs = dueDateInMs - Date.now()
    const dayInMs = 1000 * 60 * 60 * 24

    const dayDiff = Math.floor(timeDiffInMs / dayInMs)

    return dayDiff
}

routes.get("/", (request, response) => {
    const updatedJobs = jobs.map(job => {
        const remaining = remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'

        return {
            ...job,
            remaining,
            status,
            budget: profile["value-hour"] * job["total-hours"]
        }
    })
    
    return response.render(views + "index", { jobs: updatedJobs })
});

routes.get("/job", (request, response) => response.render(views + "job"));
routes.post("/job", (request, response) => {
    const lastId = jobs[jobs.length - 1] ? jobs[jobs.length - 1].id : 1
    
    jobs.push({
        id: lastId + 1,
        name: request.body.name,
        "daily-hours": request.body["daily-hours"],
        "total-hours": request.body["total-hours"],
        created_at: Date.now()
    });

    return response.redirect("/");
});
routes.get("/job/edit", (request, response) => response.render(views + "job-edit"));
routes.get("/profile", (request, response) => response.render(views + "profile", { profile }));

module.exports = routes;