"use client";

import { BACKEND_URL } from "@/config/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Task } from "../home/page";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  function allowDrop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
  }

  function drag(ev: React.DragEvent<HTMLDivElement>, taskId: string) {
    ev.dataTransfer.setData("text/plain", taskId);
  }

  async function drop(
    ev: React.DragEvent<HTMLDivElement>,
    newStatus: "To Do" | "In Progress" | "Completed"
  ) {
    ev.preventDefault();
    const taskId = ev.dataTransfer.getData("text/plain");

    try {
      const res = await axios.patch(
        `${BACKEND_URL}/task/update-status?id=${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  const filteredTasks = (status: "To Do" | "In Progress" | "Completed") =>
    tasks.filter((task) => task.status === status);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/task/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data.tasks);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-6 p-6 min-h-screen bg-gray-100">
      <div
        className="bg-gradient-to-b from-red-300 to-red-500 p-4 mb-6 md:mb-0 md:w-1/3 rounded-lg shadow-lg"
        onDrop={(ev) => drop(ev, "To Do")}
        onDragOver={allowDrop}
      >
        <h2 className="font-bold text-lg mb-4">To Do</h2>
        {filteredTasks("To Do").map((task) => (
          <div
            key={task._id}
            id={task._id}
            draggable
            onDragStart={(e) => drag(e, task._id)}
            className="bg-white p-4 mb-4 rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {task.title}
          </div>
        ))}
      </div>

      <div
        className="bg-gradient-to-b from-yellow-300 to-yellow-500 p-4 mb-6 md:mb-0 md:w-1/3 rounded-lg shadow-lg"
        onDrop={(ev) => drop(ev, "In Progress")}
        onDragOver={allowDrop}
      >
        <h2 className="font-bold text-lg mb-4">In Progress</h2>
        {filteredTasks("In Progress").map((task) => (
          <div
            key={task._id}
            id={task._id}
            draggable
            onDragStart={(e) => drag(e, task._id)}
            className="bg-white p-4 mb-4 rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {task.title}
          </div>
        ))}
      </div>

      <div
        className="bg-gradient-to-b from-green-300 to-green-500 p-4 md:w-1/3 rounded-lg shadow-lg"
        onDrop={(ev) => drop(ev, "Completed")}
        onDragOver={allowDrop}
      >
        <h2 className="font-bold text-lg mb-4">Completed</h2>
        {filteredTasks("Completed").map((task) => (
          <div
            key={task._id}
            id={task._id}
            draggable
            onDragStart={(e) => drag(e, task._id)}
            className="bg-white p-4 mb-4 rounded-lg shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}
