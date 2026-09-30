import express from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../public/uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowedExtension = ['.jpg', '.jpeg', '.png', '.webp'].includes(extension);

    if (!allowedMimeTypes.has(file.mimetype) || !isAllowedExtension) {
      return cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed.'));
    }

    cb(null, true);
  },
});

const generateComplaintId = async () => {
  const year = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  return `WM-${year}-${String(count + 1).padStart(6, '0')}`;
};

const formatComplaint = (complaint) => ({
  ...complaint.toObject(),
  imageUrl: complaint.imageUrl ? `http://localhost:${process.env.PORT || 5000}${complaint.imageUrl}` : '',
});

router.use(protect);

router.get('/mine', async (req, res, next) => {
  try {
    const { status = 'all', q = '' } = req.query;
    const filter = { user: req.user._id };

    if (status !== 'all') filter.status = status;
    if (q) {
      filter.$or = [
        { complaintId: { $regex: q, $options: 'i' } },
        { issueType: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints.map(formatComplaint));
  } catch (error) {
    next(error);
  }
});

router.get('/', requireRole('admin'), async (req, res, next) => {
  try {
    const { status = 'all', q = '', page = 1, limit = 10, sort = 'newest' } = req.query;
    const query = {};

    if (status !== 'all') query.status = status;
    if (q) {
      query.$or = [
        { complaintId: { $regex: q, $options: 'i' } },
        { issueType: { $regex: q, $options: 'i' } },
        { address: { $regex: q, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'older' ? { createdAt: 1 } : { createdAt: -1 };
    const pageNumber = Math.max(Number(page), 1);
    const pageSize = Math.max(Number(limit), 1);
    const total = await Complaint.countDocuments(query);

    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .sort(sortOrder)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    res.json({
      complaints: complaints.map(formatComplaint),
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    const { issueType, description, address, latitude, longitude, contactInfo, occurredAt } = req.body;

    if (!issueType || !description || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Issue type, description, address, latitude and longitude are required.' });
    }

    const complaintId = await generateComplaintId();
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const complaint = await Complaint.create({
      complaintId,
      user: req.user._id,
      issueType,
      description,
      imageUrl,
      address,
      latitude: Number(latitude),
      longitude: Number(longitude),
      contactInfo: contactInfo || '',
      submittedAt: occurredAt || new Date(),
      status: 'Pending',
      statusHistory: [{ status: 'Pending', note: 'Complaint reported by citizen.' }],
    });

    await Notification.create({
      user: req.user._id,
      title: 'Complaint Filed',
      message: `Your complaint ${complaintId} has been received and is pending review.`,
    });

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      complaintId,
      complaint: formatComplaint(complaint),
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    if (req.user.role !== 'admin' && complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not have access to this complaint.' });
    }

    res.json(formatComplaint(complaint));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', requireRole('admin'), async (req, res, next) => {
  try {
    const { status, adminRemarks } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const allowedStatuses = ['Pending', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid complaint status.' });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    complaint.status = status;
    complaint.adminRemarks = adminRemarks || complaint.adminRemarks;
    complaint.statusHistory.push({ status, note: adminRemarks || `Status updated to ${status}.` });

    await complaint.save();

    await Notification.create({
      user: complaint.user,
      title: 'Complaint Update',
      message: `Your complaint ${complaint.complaintId} is now ${status}.`,
    });

    res.json({ message: 'Complaint status updated successfully.', complaint: formatComplaint(complaint) });
  } catch (error) {
    next(error);
  }
});

export default router;
