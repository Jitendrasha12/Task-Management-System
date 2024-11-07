import mongoose from "mongoose";
const { Schema } = mongoose;

const options = {
  toJSON: {
    transform: (doc, obj) => {
      delete obj.__v;
      delete obj.id;
      return obj;
    },
    virtuals: false,
  },
  strict: false,
  timestamps: true,
  collection: "task",
};

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  options
);

// Create text index for full-text search
taskSchema.index({ title: "text", description: "text" });

const taskModel = mongoose.model("task", taskSchema);

export default taskModel;
