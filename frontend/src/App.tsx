import "./App.css";
import {
  CreateTask,
  GetAllTasks,
  StartTimedTask,
} from "../wailsjs/go/taskmanager/TaskManager";
import { models } from "../wailsjs/go/models";
import { EventsOff, EventsOn } from "../wailsjs/runtime";
import { CreateNewTaskDialog } from "./CreateNewTaskDialog";
import { useEffect, useState } from "react";

async function createNewTask(task: models.CreateTask) {
  await CreateTask(task);
}

async function getAllTasks(): Promise<models.Task[]> {
  return GetAllTasks();
}

function timeNumToDisplayStr(num: number): string {
  let numSeconds = num / 1000;

  const hours = Math.floor(numSeconds / 3600);
  numSeconds = numSeconds - 3600 * hours;

  const minutes = Math.floor(numSeconds / 60);
  numSeconds = numSeconds - 60 * minutes;

  let displayStr = "";

  if (hours > 0) {
    displayStr += String(hours) + " hr";
    if (hours > 1) {
      displayStr += "s";
    }
  }

  if (minutes > 0 || hours > 0) {
    displayStr += " " + String(minutes) + " min";
    if (minutes > 1) {
      displayStr += "s";
    }
  }

  if (numSeconds > 0 || minutes > 0 || hours > 0) {
    displayStr += " " + String(Math.floor(numSeconds)) + " sec";
    if (numSeconds > 1) {
      displayStr += "s";
    }
  }

  return displayStr;
}

function App() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<models.Task[]>([]);

  useEffect(() => {
    async function getTasks() {
      const tasks = await getAllTasks();
      setTasks(tasks);
    }

    getTasks();
  }, []);

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
      <div className="p-2 bg-gray-200 mt-4 rounded-md">
        {tasks.length === 0 && "No tasks found"}
        {tasks.map((task) => {
          return (
            <div className="p-4 bg-white rounded-md shadow-sm mb-2 last:mb-0">
              {task.taskType === "none" && <NoneTask task={task} />}
              {task.taskType === "timer" && <TimerTask task={task} />}
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

function TaskTitle(props: { title: string }) {
  return <div className="text-xl">{props.title}</div>;
}

function NoneTask(props: { task: models.Task }) {
  const { task } = props;

  return (
    <div className="flex w-full items-center cursor-pointer">
      <div className="flex-grow">
        <TaskTitle title={task.title} />
      </div>
    </div>
  );
}

function TimerTask(props: { task: models.Task }) {
  const { task } = props;
  const timerTask = task.timerTask as models.TimerTask;
  const [updatedTask, setUpdatedTask] = useState(task);

  useEffect(() => {
    EventsOn("task_updates::" + task.id, (task) => {
      setUpdatedTask(task);
    });

    return () => EventsOff("task_updates::" + task.id);
  }, []);

  const handleStartTaskTimer = () => {
    StartTimedTask(task);
  };

  return (
    <div className="flex w-full items-center cursor-pointer">
      <div className="flex-grow">
        <TaskTitle title={task.title} />
        <div className="text-xs text-gray-500">
          Time allowed for task{" "}
          <span className="font-medium">
            {timeNumToDisplayStr(timerTask.taskTime)}
          </span>
        </div>
      </div>
      <div className="flex">
        {(updatedTask.timerTask as models.TimerTask).status === "running" && (
          <div className="text-sm text-blue-500">
            {timeNumToDisplayStr(
              timerTask.taskTime -
                (Date.now() -
                  (updatedTask.timerTask as models.TimerTask).startedAt)
            )}
          </div>
        )}
        {updatedTask.timerTask?.status === "default" && (
          <button
            className="btn secondary text-xs"
            onClick={handleStartTaskTimer}
          >
            Start
          </button>
        )}
        {updatedTask.timerTask?.status === "finished" && (
          <div className="text-xs">Finished</div>
        )}
      </div>
    </div>
  );
}

export default App;
