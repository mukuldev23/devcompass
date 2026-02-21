const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 220
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    url: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    source: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    author: {
      type: String,
      trim: true,
      default: 'Unknown'
    },
    tags: {
      type: [String],
      default: []
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    coverImage: {
      type: String,
      trim: true,
      default: ''
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true
    },
    isRedirectOnly: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

ArticleSchema.index({ category: 1, publishedAt: -1 });
ArticleSchema.index({ source: 1, publishedAt: -1 });

module.exports = mongoose.model('Article', ArticleSchema);
