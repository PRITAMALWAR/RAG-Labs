
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },

    chunkCount: {
      type: Number,
      default: 0,
    },

    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model(
  "Document",
  documentSchema
);

export default Document;
