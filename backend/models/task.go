package models

import "time"

type TimerTaskStatus string

const (
	Default  TimerTaskStatus = "default"
	Running  TimerTaskStatus = "running"
	Finished TimerTaskStatus = "finished"
)

const (
	None     string = "none"
	Timer    string = "timer"
	Deadline string = "deadline"
)

type TimerTask struct {
	TaskTime  time.Duration   `json:"taskTime"`
	Status    TimerTaskStatus `json:"status"`
	StartedAt int64           `json:"startedAt"`
}

type Task struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Description string     `json:"description"`
	TaskType    string     `json:"taskType"`
	TimerTask   *TimerTask `json:"timerTask"`
	CreatedAt   time.Time  `json:"createdAt"`
}

type CreateTask struct {
	Title       string        `json:"title"`
	Description string        `json:"description"`
	TaskType    string        `json:"taskType"`
	TaskTime    time.Duration `json:"taskTime"`
}
