package taskmanager

import (
	"dailytask/backend/models"
	"strconv"
	"time"

	"github.com/wailsapp/wails/v2/pkg/logger"
)

type TaskManager struct {
	l logger.Logger
}

var tasks = make([]models.Task, 0)

func NewTaskManager(logger logger.Logger) TaskManager {
	return TaskManager{
		l: logger,
	}
}

func (tm TaskManager) CreateTask(task models.CreateTask) {
	tasks = append(tasks, models.Task{
		ID:        strconv.FormatInt(time.Now().UnixMilli(), 10),
		Title:     task.Title,
		TaskType:  task.TaskType,
		CreatedAt: time.Now(),
	})
}

func (tm TaskManager) GetAllTasks() []models.Task {
	return tasks
}
