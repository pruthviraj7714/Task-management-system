"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config/config";
import { Button } from "@/components/ui/button";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Completed";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
}

const priorityColors = {
  High: "bg-red-100 text-red-800 hover:bg-red-200",
  Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  Low: "bg-green-100 text-green-800 hover:bg-green-200",
};

const statusColors = {
  "To Do": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "In Progress": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  Completed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<Record<string, boolean>>(
    {
      High: false,
      Medium: false,
      Low: false,
    }
  );
  const [statusFilter, setStatusFilter] = useState<Record<string, boolean>>({
    "To Do": false,
    "In Progress": false,
    Completed: false,
  });

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
    }
  };

  const deleteTask = async (id : string) => {
    try {
      await axios.delete(`${BACKEND_URL}/task/delete?id=${id}`, {
        headers : {
          Authorization : `Bearer ${localStorage.getItem("token")}`
        }
      })
      toast.success("Task Successfully removed!");
      setTasks(tasks.filter((task) => task._id !== id));
      setFilteredTasks(tasks.filter((task) => task._id !== id));
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const filtered = tasks.filter((task) => {
      const priorityMatch =
        Object.values(priorityFilter).every((v) => v === false) ||
        priorityFilter[task.priority];
      const statusMatch =
        Object.values(statusFilter).every((v) => v === false) ||
        statusFilter[task.status];
      return priorityMatch && statusMatch;
    });
    setFilteredTasks(filtered);
  }, [tasks, priorityFilter, statusFilter]);

  const handlePriorityFilterChange = (priority: string) => {
    setPriorityFilter((prev) => ({ ...prev, [priority]: !prev[priority] }));
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter((prev) => ({ ...prev, [status]: !prev[status] }));
  };

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
                {Object.keys(priorityFilter).map((priority) => (
                  <div key={priority} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${priority}`}
                      checked={priorityFilter[priority]}
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
                {Object.keys(statusFilter).map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={statusFilter[status]}
                      onCheckedChange={() => handleStatusFilterChange(status)}
                    />
                    <Label htmlFor={`status-${status}`}>{status}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex-1 space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <Card key={task._id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{task.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {task.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Due: {task.dueDate}
                      </span>
                    </div>
                    <div>
                      <Button onClick={() => deleteTask(task._id)} variant={"destructive"}>
                        Delete Task
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
