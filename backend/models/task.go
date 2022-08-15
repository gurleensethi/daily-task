package models

import "time"

const (
	None     string = "none"
	Timer    string = "timer"
	Deadline string = "deadline"
)

type TimerTask struct {
	TaskTime  time.Duration `json:"taskTime"`
	IsRunning bool          `json:"isRunning"`
}

type Task struct {
	ID        string     `json:"id"`
	Title     string     `json:"title"`
	TaskType  string     `json:"taskType"`
	TimerTask *TimerTask `json:"timerTask"`
	CreatedAt time.Time  `json:"time"`
}

type CreateTask struct {
	Title    string        `json:"title"`
	TaskType string        `json:"taskType"`
	TaskTime time.Duration `json:"taskTime"`
}
