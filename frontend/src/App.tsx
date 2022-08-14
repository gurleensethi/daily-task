import "./App.css";
import { CreateTask, GetAllTasks } from "../wailsjs/go/taskmanager/TaskManager";
import { models } from "../wailsjs/go/models";
import { CreateNewTaskDialog } from "./CreateNewTaskDialog";
import { useState } from "react";

async function createNewTask(task: models.CreateTask) {
  await CreateTask(task);
}

async function getAllTasks(): Promise<models.Task[]> {
  return GetAllTasks();
}

function App() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<models.Task[]>([]);

  const handleTaskCreate = async (task: models.CreateTask) => {
    await createNewTask(task);
    setTasks(await getAllTasks());
    setCreateDialogOpen(false);
  };

  return (
    <div className="p-4 pb-32 select-none">
      {isCreateDialogOpen && (
        <CreateNewTaskDialog
          isOpen={isCreateDialogOpen}
          onCreateTask={handleTaskCreate}
          onClose={() => setCreateDialogOpen(false)}
        />
      )}
      <div className="text-2xl">Tasks</div>
      <div className="p-2 bg-gray-100 mt-4 rounded-md">
        {tasks.length === 0 && "No tasks found"}
        {tasks.map((item) => {
          return (
            <div className="p-4 bg-white rounded-md shadow-sm mb-2">
              <div className="text-lg ">{item.title}</div>
            </div>
          );
        })}
      </div>
      <button
        onClick={() => setCreateDialogOpen(true)}
        className="btn fixed bottom-8 right-8"
      >
        Create Task +
      </button>
    </div>
  );
}

export default App;
