import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema(
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
      default: '',
    },

    thumbnail: {
      type: String,
      default: '',
    },

    isFallback: {
      type: Boolean,
      default: false,
    },

    promptHash: {
      type: String,
      required: [true, 'Prompt hash is required'],
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

// ─── Indexes ────────────────────────────────────────────────

// Unique hash for prompt cache lookups (primary cache key)
gameSchema.index({ promptHash: 1 }, { unique: true });

// Text index for prompt search / lookup
gameSchema.index({ prompt: 'text', title: 'text' });

// Sort by newest games efficiently
gameSchema.index({ createdAt: -1 });

// Quick filter: non-fallback games sorted by date
gameSchema.index({ isFallback: 1, createdAt: -1 });

const Game = mongoose.model('Game', gameSchema);

export default Game;
