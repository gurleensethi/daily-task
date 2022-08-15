package main

import (
	"context"
	"dailytask/backend/storage"
	"dailytask/backend/taskmanager"
	"embed"
	"fmt"

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

	fileStorage := storage.NewFileStorage("data.json", logger)
	taskManager := taskmanager.NewTaskManager(logger, fileStorage)

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "Daily Task",
		Width:            768,
		Height:           768,
		MinWidth:         768,
		MinHeight:        768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.startup(ctx)
			fileStorage.Startup(ctx)

			err := fileStorage.Open()
			if err != nil {
				logger.Error(fmt.Sprintf("Error: %v", err.Error()))
				panic(err)
			}

			taskManager.Start(ctx)
		},
		OnShutdown: func(ctx context.Context) {
			taskManager.Stop()
			fileStorage.Close()
		},
		Bind: []interface{}{
			app,
			&taskManager,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
