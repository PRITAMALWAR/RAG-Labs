
import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    sources: [
      {
        documentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Document",
        },

        documentName: {
          type: String,
        },

        score: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const ChatMessage = mongoose.model(
  "ChatMessage",
  chatMessageSchema
);

export default ChatMessage;
