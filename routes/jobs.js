const express = require('express');
const { getAllJobs, getJobs, createJob, updateJob, deleteJob } = require('../controllers/jobs');
const router = express.Router();

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJobs).patch(updateJob).delete(deleteJob);

module.exports = router;