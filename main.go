package main

import (
	"dailytask/backend/taskmanager"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/logger"
	"github.com/wailsapp/wails/v2/pkg/options"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	logger := logger.NewDefaultLogger()
	app := NewApp()
	taskManager := taskmanager.NewTaskManager(logger)

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Daily Task",
		Width:            768,
		Height:           768,
		MinWidth:         768,
		MinHeight:        768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
			&taskManager,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
