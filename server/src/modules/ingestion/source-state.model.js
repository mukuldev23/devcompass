const mongoose = require('mongoose');

const SourceStateSchema = new mongoose.Schema(
  {
    sourceKey: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    active: {
      type: Boolean,
      default: true
    },
    failureCount: {
      type: Number,
      default: 0
    },
    lastError: {
      type: String,
      default: ''
    },
    blockedUntil: {
      type: Date,
      default: null
    },
    lastCheckedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SourceState', SourceStateSchema);
