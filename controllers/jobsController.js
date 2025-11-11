import jobsModel from "../models/jobsModel.js";
import mongoose from 'mongoose';


//====== CREATE JOB ======
export const createJobController = async (req, res, next) => {
    const { company, position } = req.body
    if (!company || !position) {
        next('Please provide all fields')
    }

    req.body.createdBy = req.user.userId
    const job = await jobsModel.create(req.body)
    res.status(201).json({ job });



};


// ===== get jobs ======= 


export const getAllJobsController = async (req, res, next) => {
    const jobs = await jobsModel.find({ createdBy: req.user.userId })
    res.status(200).json({
        totalJobs: jobs.length,
        jobs,
    })
};

// ======== UPDATE JOBS =========

export const updateJobController = async (req, res, next) => {
    const { id } = req.params
    const { company, position } = req.body
    // validation 
    if (!company || !position) {
        next('Please provide all fields')
    }
    // find job 
    const job = await jobsModel.findOne({ _id: id })
    //validation 
    if (!job) {
        next(`No jobs found with this id ${id}`)
    }
    if (!req.user.userId === job.createdBy.toString()) {

        next('you are not authorized to update this job ');
        return;

    }

    const updateJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
        runValidators: true
    })

    // res 
    res.status(200).json({ updateJob });









};

// ======= DELETE JOBS ========= 
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params
    //find job 
    const job = await jobsModel.findOne({ _id: id })
    // validation 
    if (!job) {
        next(`No Job Found With This ID ${id}`)
    }
    if (!req.user.userId === job.createdBy.toString()) {
        next('You are not Authorized to delete this job')
        return
    }
    await job.deleteOne();
    res.status(200).json({ message: 'Success, Job Deleted!' });

};


// ======= JOB STATS & FILTERS ========= 

export const jobStatsController = async (req, res) => {
    // Debug: Check what userId we're looking for
    console.log('Looking for userId:', req.user.userId);

    // First, let's see all jobs without filtering
    const allJobs = await jobsModel.find({}).limit(5);
    const sampleCreatedByValues = allJobs.map(job => ({
        createdBy: job.createdBy,
        createdByType: typeof job.createdBy,
        createdByString: job.createdBy?.toString()
    }));

    // Try matching with string first
    const jobsWithString = await jobsModel.find({ createdBy: req.user.userId });
    console.log('Jobs found with string match:', jobsWithString.length);

    // Try matching with ObjectId
    const jobsWithObjectId = await jobsModel.find({
        createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.userId)
    });
    console.log('Jobs found with ObjectId match:', jobsWithObjectId.length);

    const stats = await jobsModel.aggregate([
        {
            $match: {
                createdBy: mongoose.Types.ObjectId.createFromHexString(req.user.userId)
            }
        },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    res.status(200).json({
        totalJobs: jobsWithObjectId.length,
        stats,
        debug: {
            userId: req.user.userId,
            totalInDB: allJobs.length,
            stringMatch: jobsWithString.length,
            objectIdMatch: jobsWithObjectId.length,
            sampleCreatedByValues: sampleCreatedByValues
        }
    });
};