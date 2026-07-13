import mongoose from 'mongoose';

const publishedGameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Game title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },

    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true,
      maxlength: [2000, 'Prompt cannot exceed 2000 characters'],
    },

    gameCode: {
      type: String,
      required: [true, 'Game code is required'],
    },

    thumbnail: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt as per specification
  }
);

// Index to sort by newest published games in the feed
publishedGameSchema.index({ createdAt: -1 });

const PublishedGame = mongoose.model('PublishedGame', publishedGameSchema);

export default PublishedGame;
