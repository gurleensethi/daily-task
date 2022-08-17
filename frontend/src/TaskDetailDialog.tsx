import { useEffect, useState } from "react";
import { models } from "../wailsjs/go/models";
import {
  GetTaskByID,
  DeleteTaskByID,
} from "../wailsjs/go/taskmanager/TaskManager";
import { timeNumToDisplayStr } from "./utils";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatTime(timeStr: string): string {
  const date = new Date(timeStr);

  function padLeft(n: number): string {
    const v = String(n);
    if (v.length == 1) {
      return "0" + v;
    }
    return v;
  }

  return `${padLeft(date.getDate())} ${
    months[date.getMonth()]
  } ${date.getFullYear()} ${padLeft(date.getHours() % 12)}:${padLeft(
    date.getMinutes()
  )}${date.getHours() > 12 ? "pm" : "am"}`;
}

export const TaskDetailDialog = (props: {
  taskID: string;
  onClose: () => void;
  onTaskDelete: () => void;
}) => {
  const { onClose, taskID, onTaskDelete } = props;
  const [task, setTask] = useState<models.Task | null>(null);

  useEffect(() => {
    async function fetchTaskByID() {
      const task = await GetTaskByID(taskID);
      setTask(task);
    }

    fetchTaskByID();
  }, []);

  const handleOnClose = () => {
    onClose();
  };

  const handleDeleteTask = async () => {
    await DeleteTaskByID(taskID);
    onTaskDelete();
    onClose();
  };

  console.log(task?.createdAt, typeof task?.createdAt);

  return (
    <div
      className="bg-opacity-20 bg-black fixed top-0 left-0 bottom-0 right-0 z-50"
      onClick={handleOnClose}
    >
      {task && (
        <div
          className="m-8 p-8 bg-white max-h-[90%] rounded-md shadow-lg overflow-y-scroll"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center">
            <div className="flex-grow">
              <div className="text-2xl font-medium">{task.title}</div>
              {task.taskType === "timer" && (
                <div className="text-xs text-gray-500 mt-1">
                  Time allowed for task{" "}
                  <span className="">
                    {timeNumToDisplayStr(
                      (task.timerTask as models.TimerTask).taskTime
                    )}
                    .
                  </span>
                </div>
              )}
            </div>
            {task.timerTask?.status === "finished" && (
              <div className="text-lg text-gray-500">Finished</div>
            )}
          </div>
          {task.description && <div className="mt-4">{task.description}</div>}
          <div className="mt-8 flex justify-end">
            <div>
              <button className="btn danger" onClick={handleDeleteTask}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
