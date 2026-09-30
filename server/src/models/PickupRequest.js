import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Requested', 'Scheduled', 'Assigned', 'Picked Up', 'Completed', 'Cancelled'],
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const pickupRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    wasteType: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    pickupAddress: {
      type: String,
      required: true,
    },
    preferredDate: {
      type: Date,
      required: true,
    },
    preferredTime: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Requested', 'Scheduled', 'Assigned', 'Picked Up', 'Completed', 'Cancelled'],
      default: 'Requested',
    },
    remarks: {
      type: String,
      default: '',
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);

export default PickupRequest;
