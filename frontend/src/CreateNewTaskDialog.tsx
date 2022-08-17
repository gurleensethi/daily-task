import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { models } from "../wailsjs/go/models";

type TaskType = "none" | "timer" | "deadline";

export function CreateNewTaskDialog(props: {
  isOpen: boolean;
  onCreateTask: (task: models.CreateTask) => void;
  onClose?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState("");
  const [taskType, setTaskType] = useState<TaskType>("none");
  const [taskTime, setTaskTime] = useState(0);
  const [timerError, setTimerError] = useState("");

  const handleTaskCreate = () => {
    setTitleError("");

    if (title.trim().length < 4) {
      setTitleError("Enter a longer title");
      return;
    }

    if (taskType === "timer" && taskTime === 0) {
      setTimerError("Enter a valid time");
      return;
    }

    const task = new models.CreateTask();
    task.title = title;
    task.description = description;
    task.taskType = taskType;
    task.taskTime = taskTime;
    props.onCreateTask(task);
  };

  const handleOnClose = () => {
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleOnTimeChange = (time: number) => {
    setTimerError("");
    setTaskTime(time);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleError("");
    setTitle(e.target.value);
  };

  if (!props.isOpen) {
    return null;
  }

  return (
    <div
      className="bg-opacity-20 bg-black fixed top-0 left-0 bottom-0 right-0 z-50"
      onClick={handleOnClose}
    >
      <div
        className="m-8 p-8 bg-white max-h-[90%] rounded-md shadow-lg overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          placeholder="Enter task name"
          className="text-2xl border-none outline-none w-full font-medium"
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />
        {titleError && (
          <div className="text-xs text-red-500 mt-1">{titleError}</div>
        )}
        <textarea
          placeholder="Description...(optional)"
          className="border-none outline-none w-full mt-4 resize-none"
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="mt-8">
          <div className="text-xl">Task Type</div>
          <div className="text-gray-500 text-sm">Select the type of task</div>
          <div className="mt-4 inline-flex items-center border p-1 rounded-md">
            <div
              className={clsx(
                "cursor-pointer py-1.5 px-4 rounded-md",
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
                "cursor-pointer py-1.5 px-4 rounded-md",
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
                "cursor-pointer py-1.5 px-4 rounded-md",
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
        <div className="mt-4">
          {taskType == "timer" && (
            <>
              <TimerOptions onTimeChange={handleOnTimeChange} />
              {timerError && (
                <div className="text-xs text-red-500 mt-1">{timerError}</div>
              )}
            </>
          )}
        </div>
        <div className="flex justify-end">
          <button className="btn" onClick={handleTaskCreate}>
            Create Task
          </button>
        </div>
      </div>
    </div>
  );
}

function TimerOptions(props: { onTimeChange: (time: number) => void }) {
  const [hh, setHH] = useState("");
  const [mm, setMM] = useState("");
  const [ss, setSS] = useState("");

  const handleChange = (time: "hh" | "mm" | "ss") => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      const n = Number(value);

      if (isNaN(n)) {
        return;
      }

      if (n < 0) {
        return;
      }

      switch (time) {
        case "hh": {
          if (n > 24) {
            return;
          }
          setHH(value);
          break;
        }
        case "mm": {
          if (n > 60) {
            return;
          }
          setMM(value);
          break;
        }
        case "ss": {
          if (n > 60) {
            return;
          }
          setSS(value);
          break;
        }
      }
    };
  };

  useEffect(() => {
    const timeNum =
      (getNumValue(hh) * 3600 + getNumValue(mm) * 60 + getNumValue(ss)) * 1000;
    props.onTimeChange(timeNum);
  }, [hh, mm, ss]);

  const getNumValue = (value: string): number =>
    value === "" ? 0 : Number(value);

  const timeText =
    getNumValue(hh) +
    " hours " +
    getNumValue(mm) +
    " minutes " +
    getNumValue(ss) +
    " seconds";

  return (
    <div>
      <div className="text-xl">Time</div>
      <div className="text-gray-500 text-sm">Select the max time for task</div>
      <div className="inline-flex space-x-2 mt-4 items-center border p-2 rounded-md">
        <input
          className="text-lg outline-none text-center w-12"
          placeholder="hh"
          value={hh}
          onChange={handleChange("hh")}
        />
        <div className="h-4 w-[1px] bg-gray-200 mx-1" />
        <input
          className="text-lg outline-none text-center w-12"
          placeholder="mm"
          value={mm}
          onChange={handleChange("mm")}
        />
        <div className="h-4 w-[1px] bg-gray-200 mx-1" />
        <input
          className="text-lg outline-none text-center w-12"
          placeholder="ss"
          value={ss}
          onChange={handleChange("ss")}
        />
      </div>
      <div className="mt-2 text-gray-500 text-sm">
        Timer fires in {timeText}
      </div>
    </div>
  );
}
