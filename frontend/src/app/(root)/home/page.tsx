"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/TaskCard";

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/task/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTasks(res.data.tasks);
      setFilteredTasks(res.data.tasks);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const sortTasksByDueDate = (tasksToSort: Task[]) => {
    return tasksToSort.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);

      if (sortDirection === "asc") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${BACKEND_URL}/task/delete?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Task Successfully removed!");
      setTasks(tasks.filter((task) => task._id !== id));
      setFilteredTasks(tasks.filter((task) => task._id !== id));
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const handleTaskUpdate = async (
    taskId: string,
    updatedFields: Partial<Task>
  ) => {
    try {
      const res = await axios.patch(
        `${BACKEND_URL}/task/update?id=${taskId}`,
        updatedFields,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Task Successfully updated!");
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...updatedFields } : t))
      );
      setFilteredTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, ...updatedFields } : t))
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const priorityMatch =
        priorityFilter.length === 0 || priorityFilter.includes(task.priority);
      const statusMatch =
        statusFilter.length === 0 || statusFilter.includes(task.status);

      return priorityMatch && statusMatch;
    });

    setFilteredTasks(sortTasksByDueDate(filtered));
  }, [tasks, priorityFilter, statusFilter, sortDirection]);

  const handlePriorityFilterChange = (priority: string) => {
    setPriorityFilter((prev) =>
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleSortDirection = () => {
    setSortDirection((prevDirection) =>
      prevDirection === "asc" ? "desc" : "asc"
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Tasks</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-64 h-fit">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Priority</h3>
                {["High", "Medium", "Low"].map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={priorityFilter.includes(priority)}
                      onCheckedChange={() =>
                        handlePriorityFilterChange(priority)
                      }
                    />
                    <Label htmlFor={`priority-${priority}`}>{priority}</Label>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                {["To Do", "In Progress", "Completed"].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={statusFilter.includes(status)}
                      onCheckedChange={() => handleStatusFilterChange(status)}
                    />
                    <Label htmlFor={`status-${status}`}>{status}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Sort By</h3>
              <Button onClick={toggleSortDirection}>
                Due Date ({sortDirection === "asc" ? "Ascending" : "Descending"}
                )
              </Button>
            </div>
          </CardContent>
        </Card>
        <div className="flex-1 space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={(updatedFields) =>
                  handleTaskUpdate(task._id, updatedFields)
                }
                onDelete={() => deleteTask(task._id)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-32">
                <AlertTriangle className="h-8 w-8 text-yellow-500 mb-2" />
                <p className="text-lg font-semibold">No tasks found</p>
                <p className="text-sm text-gray-500">
                  Try adjusting your filters or add new tasks
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
