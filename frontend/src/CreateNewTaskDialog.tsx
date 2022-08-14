import clsx from "clsx";
import { useState } from "react";
import { models } from "../wailsjs/go/models";

type TaskType = "none" | "timer" | "deadline";

export function CreateNewTaskDialog(props: {
  isOpen: boolean;
  onCreateTask: (task: models.CreateTask) => void;
  onClose?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("none");

  const handleTaskCreate = () => {
    const task = new models.CreateTask();
    task.title = title;
    task.taskType = taskType;
    props.onCreateTask(task);
  };

  const handleOnClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  if (!props.isOpen) {
    return null;
  }

  return (
    <div
      className="bg-opacity-20 bg-black fixed top-0 left-0 bottom-0 right-0"
      onClick={handleOnClose}
    >
      <div
        className="m-8 p-8 bg-white max-h-[90%] rounded-md shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          placeholder="Enter task name"
          className="text-2xl border-none outline-none w-full font-medium"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <div className="mt-8">
          <div className="text-xl">Task Type</div>
          <div className="text-gray-500 text-sm">Select the type of task</div>
          <div className="mt-4 inline-flex items-center">
            <div
              className={clsx(
                "cursor-pointer py-1.5 px-4 rounded-sm",
                taskType == "none" && "bg-blue-700 bg-opacity-10",
                taskType != "none" && "hover:bg-opacity-10 hover:bg-gray-400"
              )}
              onClick={() => setTaskType("none")}
            >
              None
            </div>
            <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
            <div
              className={clsx(
                "cursor-pointer py-1.5 px-4 rounded-sm",
                taskType == "timer" && "bg-blue-700 bg-opacity-10",
                taskType != "timer" && "hover:bg-opacity-10 hover:bg-gray-400"
              )}
              onClick={() => setTaskType("timer")}
            >
              Timer
            </div>
            <div className="h-4 w-[1px] bg-gray-200 mx-1"></div>
            <div
              className={clsx(
                "cursor-pointer py-1.5 px-4 rounded-sm",
                taskType == "deadline" && "bg-blue-700 bg-opacity-10",
                taskType != "deadline" &&
                  "hover:bg-opacity-10 hover:bg-gray-400"
              )}
              onClick={() => setTaskType("deadline")}
            >
              Deadline
            </div>
          </div>
        </div>
        <button className="btn" onClick={handleTaskCreate}>
          Create Task
        </button>
      </div>
    </div>
  );
}
