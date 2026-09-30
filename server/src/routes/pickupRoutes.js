import express from 'express';
import PickupRequest from '../models/PickupRequest.js';
import Notification from '../models/Notification.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();

const generatePickupId = async () => {
  const year = new Date().getFullYear();
  const count = await PickupRequest.countDocuments();
  return `PICK-${year}-${String(count + 1).padStart(6, '0')}`;
};

router.use(protect);

router.get('/mine', async (req, res, next) => {
  try {
    const { status = 'all', q = '' } = req.query;
    const filter = { user: req.user._id };

    if (status !== 'all') filter.status = status;
    if (q) {
      filter.$or = [
        { requestId: { $regex: q, $options: 'i' } },
        { wasteType: { $regex: q, $options: 'i' } },
        { pickupAddress: { $regex: q, $options: 'i' } },
      ];
    }

    const pickups = await PickupRequest.find(filter).sort({ createdAt: -1 });
    res.json(pickups);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { wasteType, quantity, pickupAddress, preferredDate, preferredTime, notes } = req.body;

    if (!wasteType || !quantity || !pickupAddress || !preferredDate || !preferredTime) {
      return res.status(400).json({ message: 'Please complete all required pickup fields.' });
    }

    const requestId = await generatePickupId();
    const pickup = await PickupRequest.create({
      requestId,
      user: req.user._id,
      wasteType,
      quantity,
      pickupAddress,
      preferredDate: new Date(preferredDate),
      preferredTime,
      notes: notes || '',
      status: 'Requested',
      statusHistory: [{ status: 'Requested', note: 'Pickup request submitted by citizen.' }],
    });

    await Notification.create({
      user: req.user._id,
      title: 'Pickup Requested',
      message: `Your pickup request ${requestId} has been placed and is awaiting review.`,
    });

    res.status(201).json({ message: 'Pickup request submitted successfully.', requestId, pickup });
  } catch (error) {
    next(error);
  }
});

router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { status = 'all', q = '', page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status !== 'all') filter.status = status;
    if (q) {
      filter.$or = [
        { requestId: { $regex: q, $options: 'i' } },
        { wasteType: { $regex: q, $options: 'i' } },
        { pickupAddress: { $regex: q, $options: 'i' } },
      ];
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const total = await PickupRequest.countDocuments(filter);

    const pickups = await PickupRequest.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({ pickups, total, page: pageNumber, totalPages: Math.ceil(total / pageSize) });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireRole('admin'), async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const allowedStatuses = ['Requested', 'Scheduled', 'Assigned', 'Picked Up', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid pickup status.' });
    }

    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup request not found.' });
    }

    pickup.status = status;
    pickup.remarks = remarks || pickup.remarks;
    pickup.statusHistory.push({ status, note: remarks || `Pickup status updated to ${status}.` });

    await pickup.save();

    await Notification.create({
      user: pickup.user,
      title: 'Pickup Update',
      message: `Your pickup request ${pickup.requestId} is now ${status}.`,
    });

    res.json({ message: 'Pickup status updated successfully.', pickup });
  } catch (error) {
    next(error);
  }
});

export default router;
