import { response, Router } from "express";
import { authMiddleware } from "../middleware";
import { Task } from "../models/TaskModel";
import { taskSchema } from "../schemas/schema";

export const taskRouter = Router();

taskRouter.post("/create", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id;

  const parsedBody = taskSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(411).json({
      message: "Invalid Inputs",
      error: parsedBody.error,
    });
  }

  const { title, description, status, priority } = parsedBody.data;

  let dueDate;
  if (parsedBody.data.dueDate) {
    dueDate = parsedBody.data.dueDate;
  }

  try {
    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      user: userId,
    });

    return res.status(201).json({
      message: "Task Successfully Created!",
      task,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

taskRouter.get("/all", authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.id;

  try {
    const tasks = await Task.find({
      user: userId,
    });

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

taskRouter.delete("/delete", authMiddleware, async (req, res) => {
  const taskId = req.query.id;

  if (!taskId) {
    return res.status(411).json({
      message: "Task Id is missing!",
    });
  }

  try {
    await Task.deleteOne({
      _id: taskId,
    });

    return res.status(200).json({
      message: "Task Successfully deleted!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

taskRouter.patch("/update", authMiddleware, async (req, res) => {
  const taskId = req.query.id as string;

  if (!taskId) {
    return res.status(411).json({
      message: "Task Id is missing!",
    });
  }

  try {
    const body = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(409).json({
        message: "Task not found!",
      });
    }

    task.title = body.title ?? task.title;
    task.description = body.description ?? task.description;
    task.priority = body.priority ?? task.priority;
    task.status = body.status ?? task.status;
    task.dueDate = body.dueDate ?? task.dueDate;

    await task.save();

    return res.status(200).json({
      message: "Task successfully updated!",
      task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
});


taskRouter.patch("/update-status", authMiddleware, async (req, res) => {
  const taskId = req.query.id as string;

  if (!taskId) {
    return res.status(411).json({
      message: "Task Id is missing!",
    });
  }

  const { status } = req.body;

  if(!status) {
    return res.status(411).json({
      message : "status not given!"
    })
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(409).json({
        message: "Task not found!",
      });
    }

    task.status = status;

    await task.save();

    return res.status(200).json({
      message: "Task status successfully updated!",
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({
      message: "Internal Server Error!",
    });
  }
});
