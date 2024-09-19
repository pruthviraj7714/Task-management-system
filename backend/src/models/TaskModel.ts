import mongoose from "mongoose";

enum Status {
  ToDo = "To Do",
  InProgress = "In Progress",
  Completed = "Completed",
}

enum Priority {
  Low = "Low",
  Medium = "Medium",
  High = "High",
}

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: Object.values(Status), 
    required: true,
  },
  priority: {
    type: String,
    enum: Object.values(Priority), 
  },
  dueDate: {
    type: Date,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

export const Task = mongoose.model("Task", TaskSchema);
