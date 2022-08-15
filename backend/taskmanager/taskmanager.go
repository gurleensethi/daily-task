package taskmanager

import (
	"bytes"
	"context"
	"dailytask/backend/models"
	"dailytask/backend/storage"
	"encoding/json"
	"fmt"
	"strconv"
	"sync"
	"time"

	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type TaskManager struct {
	ctx        context.Context
	l          logger.Logger
	storage    storage.Storage
	mutext     sync.Mutex
	saveMutext sync.Mutex
	tasks      []models.Task
}

func NewTaskManager(logger logger.Logger, storage storage.Storage) TaskManager {
	return TaskManager{
		l:       logger,
		storage: storage,
	}
}

func (tm *TaskManager) Start(ctx context.Context) {
	tm.ctx = ctx

	tm.tasks = make([]models.Task, 0)
	b, _ := tm.storage.Read()
	buffer := bytes.NewBuffer(b)
	decoder := json.NewDecoder(buffer)
	decoder.Decode(&tm.tasks)

	go func() {
		ticker := time.NewTicker(time.Second)

		for {
			select {
			case <-ctx.Done():
				ticker.Stop()
				return
			case <-ticker.C:
				var playNotificationSound bool

				for _, task := range tm.tasks {
					if task.TaskType == "timer" {
						now := time.Now()

						if task.TimerTask.Status == "running" &&
							now.UnixMilli() > task.TimerTask.StartedAt+int64(task.TimerTask.TaskTime) {
							playNotificationSound = true

							tm.mutext.Lock()
							task.TimerTask.Status = models.Finished
							tm.mutext.Unlock()

							tm.save()
						}

						runtime.EventsEmit(ctx, "task_updates::"+task.ID, task)
					}
				}

				if playNotificationSound {
					runtime.EventsEmit(ctx, "notification_sound", "timer_finished")
				}
			}
		}
	}()
}

func (tm *TaskManager) Stop() {
	tm.saveMutext.Lock()
	defer tm.saveMutext.Unlock()

	tm.save()
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
			Status:   models.Default,
		}
	}

	tm.mutext.Lock()
	tm.tasks = append([]models.Task{newTask}, tm.tasks...)
	tm.mutext.Unlock()

	tm.save()
}

func (tm *TaskManager) GetAllTasks() []models.Task {
	return tm.tasks
}

func (tm *TaskManager) StartTimedTask(task models.Task) error {
	if task.TaskType != models.Timer {
		return fmt.Errorf("task is not a timer task")
	}

	for _, t := range tm.tasks {
		if t.ID == task.ID {
			t.TimerTask.Status = models.Running
			t.TimerTask.StartedAt = time.Now().UnixMilli()
			break
		}
	}

	return nil
}

func (tm *TaskManager) GetTaskByID(ID string) *models.Task {
	for _, task := range tm.tasks {
		if task.ID == ID {
			return &task
		}
	}

	return nil
}

func (tm *TaskManager) DeleteTaskByID(ID string) error {
	index := -1
	for i, task := range tm.tasks {
		if task.ID == ID {
			index = i
			break
		}
	}

	if index >= 0 {
		tm.mutext.Lock()
		tm.tasks = append(tm.tasks[:index], tm.tasks[index+1:]...)
		tm.mutext.Unlock()

		tm.save()
	}

	return nil
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
