package models

import "time"

type Task struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	TaskType  string    `json:"taskType"`
	CreatedAt time.Time `json:"time"`
}

type CreateTask struct {
	Title    string `json:"title"`
	TaskType string `json:"taskType"`
}
