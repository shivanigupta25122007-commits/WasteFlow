import express from 'express';
import Complaint from '../models/Complaint.js';
import PickupRequest from '../models/PickupRequest.js';
import User from '../models/User.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const totalPickups = await PickupRequest.countDocuments();
    const completedPickups = await PickupRequest.countDocuments({ status: 'Completed' });
    const activeIssues = await Complaint.countDocuments({ status: { $in: ['Pending', 'Under Review', 'Assigned', 'In Progress'] } });

    const complaintsByCategory = await Complaint.aggregate([
      { $group: { _id: '$issueType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    const complaintsOverTime = await Complaint.aggregate([
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 10 },
    ]);

    const statusDistribution = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const pickupStats = await PickupRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const hotspots = await Complaint.aggregate([
      { $match: { address: { $ne: '' } } },
      { $group: { _id: '$address', count: { $sum: 1 }, issueType: { $first: '$issueType' }, pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] } } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      stats: {
        totalUsers,
        totalComplaints,
        pendingComplaints,
        resolvedComplaints,
        totalPickups,
        completedPickups,
        activeIssues,
      },
      charts: {
        complaintsOverTime,
        complaintsByCategory,
        statusDistribution,
        pickupStats,
      },
      hotspots: hotspots.map((item) => ({
        area: item._id,
        numberOfComplaints: item.count,
        mainIssueType: item.issueType,
        pendingComplaints: item.pending,
        resolvedComplaints: item.resolved,
      })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
