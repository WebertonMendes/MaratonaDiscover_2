const Job = require("../model/Job")
const Profile = require("../model/Profile")
const JobUtils = require("../utils/JobUtils")

module.exports = {
    create(request, response) {
        return response.render("job")
    },
    
    async save(request, response) {
        await Job.create({
            name: request.body.name,
            "daily-hours": request.body["daily-hours"],
            "total-hours": request.body["total-hours"],
            created_at: Date.now()
        })

        return response.redirect("/")
    },

    async show(request, response) {
        const jobId = request.params.id
        const jobs = await Job.get()

        const job = jobs.find(job => Number(job.id) === Number(jobId))

        if (!job) return response.send("Job not found!")

        const profile = await Profile.get()

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

        return response.render("job-edit", { job })
    },

    async update(request, response) {
        const jobId = request.params.id

        const updatedJob = {
            name: request.body.name,
            "total-hours": request.body["total-hours"],
            "daily-hours": request.body["daily-hours"]
        }

        await Job.update(updatedJob, jobId)

        response.redirect("/job/" + jobId)
    },

    async delete(request, response) {
        const jobId = request.params.id

        await Job.delete(jobId)

        return response.redirect("/")
    }
}