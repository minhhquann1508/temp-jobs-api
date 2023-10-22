const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors/index')

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs, total: jobs.length });
};

const getJobs = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;
    const job = await Job.findOne({ _id: jobId, createdBy: userId });
    if (!job) {
        throw new NotFoundError('Cannot found this job');
    }
    res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
    const {
        body: { company, position },
        user: { userId },
        params: { id: jobId }
    } = req;
    if (company === '' || position === '') {
        throw new BadRequestError('Company and position field cannot be empty');
    }
    const updateJob = await Job.findByIdAndUpdate(
        { _id: jobId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )
    if (!updateJob) {
        throw new NotFoundError('Cannot found this job');
    }
    res.status(StatusCodes.OK).json({ updateJob });
};

const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId }
    } = req;
    const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });
    if (!job) {
        throw new NotFoundError('Cannot found this job');
    }
    res.status(StatusCodes.OK).json({ msg: 'Delete success' });
};

module.exports = {
    getAllJobs,
    getJobs,
    createJob,
    updateJob,
    deleteJob
}