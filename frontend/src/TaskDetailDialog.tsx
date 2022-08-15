import { useEffect, useState } from "react";
import { models } from "../wailsjs/go/models";
import {
  GetTaskByID,
  DeleteTaskByID,
} from "../wailsjs/go/taskmanager/TaskManager";
import { timeNumToDisplayStr } from "./utils";

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
    DeleteTaskByID(taskID);
    onTaskDelete();
    onClose();
  };

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
                  <span className="font-medium">
                    {timeNumToDisplayStr(
                      (task.timerTask as models.TimerTask).taskTime
                    )}
                  </span>
                </div>
              )}
            </div>
            {task.timerTask?.status === "finished" && (
              <div className="text-xs text-gray-500">Finished</div>
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button className="btn danger" onClick={handleDeleteTask}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
