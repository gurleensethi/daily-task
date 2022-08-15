package taskmanager

import (
	"bytes"
	"dailytask/backend/models"
	"dailytask/backend/storage"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/wailsapp/wails/v2/pkg/logger"
)

type TaskManager struct {
	l       logger.Logger
	storage storage.Storage
	tasks   []models.Task
}

func NewTaskManager(logger logger.Logger, storage storage.Storage) TaskManager {
	return TaskManager{
		l:       logger,
		storage: storage,
	}
}

func (tm *TaskManager) Load() {
	tm.tasks = make([]models.Task, 0)
	b, _ := tm.storage.Read()
	buffer := bytes.NewBuffer(b)
	decoder := json.NewDecoder(buffer)
	decoder.Decode(&tm.tasks)
}

func (tm *TaskManager) CreateTask(task models.CreateTask) {
	newTask := models.Task{
		ID:        strconv.FormatInt(time.Now().UnixMilli(), 10),
		Title:     task.Title,
		TaskType:  task.TaskType,
		CreatedAt: time.Now(),
	}

	if task.TaskType == models.Timer {
		newTask.TimerTask = &models.TimerTask{
			TaskTime: task.TaskTime,
		}
	}

	tm.tasks = append(tm.tasks, newTask)
	tm.save()
}

func (tm *TaskManager) GetAllTasks() []models.Task {
	return tm.tasks
}

func (tm *TaskManager) save() {
	buffer := bytes.NewBuffer(make([]byte, 0))
	decoder := json.NewEncoder(buffer)
	decoder.Encode(tm.tasks)

	err := tm.storage.OverWrite(buffer.Bytes())
	if err != nil {
		tm.l.Error(fmt.Sprintf("%v", err))
	}
}
