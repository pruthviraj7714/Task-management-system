import { Router } from "express";
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
      task
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
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

taskRouter.delete('/delete', authMiddleware, async (req, res) => {
  //@ts-ignore
  const userId = req.isPaused

  const taskId = req.query.id;

  if(!taskId) {
    return res.status(411).json({
      message : "Task Id is missing!"
    })
  }

  try {
    await Task.deleteOne({
      _id : taskId
    })

    return res.status(200).json({
      message : "Task Successfully deleted!"
    })
    
  } catch (error) {
    return res.status(500).json({
      message : "Internal Server Error"
    })
  }
})



