import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Task } from "@/app/(root)/home/page";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800 hover:bg-red-200",
  Medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  Low: "bg-green-100 text-green-800 hover:bg-green-200",
};

const statusColors: Record<string, string> = {
  "To Do": "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "In Progress": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  Completed: "bg-gray-100 text-gray-800 hover:bg-gray-200",
};

export default function TaskCard({
  task,
  onDelete,
  onUpdate,
}: {
  task: Task;
  onDelete: () => void;
  onUpdate: (updatedFields: Partial<Task>) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedTask(task);
  };

  const handleSaveClick = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Task, value: string) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card key={task._id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <Input
              value={editedTask.title ?? task.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          ) : (
            <CardTitle>{task.title}</CardTitle>
          )}
          <div className="flex space-x-2">
            {isEditing ? (
              <Select
                value={editedTask.priority ?? task.priority}
                onValueChange={(value: string) =>
                  handleChange("priority", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority for Task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={priorityColors[task.priority]}>
                {task.priority}
              </Badge>
            )}
            {isEditing ? (
              <Select
                value={editedTask.status ?? task.status}
                onValueChange={(value: string) => handleChange("status", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status for Task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge className={statusColors[task.status]}>{task.status}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Input
            value={editedTask.description ?? task.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        ) : (
          <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        )}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {isEditing ? (
              <Input
                type="date"
                value={editedTask.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
              />
            ) : (
              <span>Due: {task.dueDate}</span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
                <Button
                  className="bg-yellow-500 hover:bg-yellow-600"
                  onClick={() => setIsEditing(false)}
                >
                  Close
                </Button>
              </div>
            ) : (
              <Button onClick={handleEditClick}>Edit Task</Button>
            )}
            <Button onClick={onDelete} variant={"destructive"}>
              Delete Task
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
