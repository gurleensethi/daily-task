import "./App.css";
import {
  CreateTask,
  GetAllTasks,
  StartTimedTask,
} from "../wailsjs/go/taskmanager/TaskManager";
import { models } from "../wailsjs/go/models";
import { EventsOff, EventsOn } from "../wailsjs/runtime";
import { CreateNewTaskDialog } from "./CreateNewTaskDialog";
import React, { useEffect, useState } from "react";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { timeNumToDisplayStr } from "./utils";
import { NotificationProvider } from "./NotificationProvider";

async function createNewTask(task: models.CreateTask) {
  await CreateTask(task);
}

function App() {
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [tasks, setTasks] = useState<models.Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<models.Task | null>(null);

  async function fetchTasks() {
    const tasks = await GetAllTasks();
    setTasks(tasks);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreate = async (task: models.CreateTask) => {
    await createNewTask(task);
    fetchTasks();
    setCreateDialogOpen(false);
  };

  const handleTaskClick = (task: models.Task) => {
    setSelectedTask(task);
  };

  const handleTaskDialogClose = () => {
    setSelectedTask(null);
  };

  const handleTaskDelete = () => {
    fetchTasks();
  };

  return (
    <NotificationProvider>
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
          {tasks.length === 0 && (
            <div className="m-2">
              No tasks found! Go ahead and create some tasks.
            </div>
          )}
          {tasks.map((task) => {
            return (
              <div
                key={task.id}
                className="p-4 bg-white rounded-md shadow-sm mb-2 last:mb-0 cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
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
        {selectedTask && (
          <TaskDetailDialog
            taskID={selectedTask.id}
            onClose={handleTaskDialogClose}
            onTaskDelete={handleTaskDelete}
          />
        )}
      </div>
    </NotificationProvider>
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

  const handleStartTaskTimer = (e: React.MouseEvent) => {
    e.stopPropagation();
    StartTimedTask(task);
  };

  return (
    <div className="flex w-full items-center">
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
          <div className="text-xs text-gray-500">Finished</div>
        )}
      </div>
    </div>
  );
}

export default App;
