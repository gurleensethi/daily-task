package storage

import (
	"context"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/logger"
)

type FileStorage struct {
	fileName string
	l        logger.Logger
	ctx      context.Context
	filePath string
}

func NewFileStorage(fileName string, l logger.Logger) *FileStorage {
	return &FileStorage{fileName: fileName, l: l}
}

func (f *FileStorage) Startup(ctx context.Context) {
	f.ctx = ctx
}

func (f *FileStorage) Open() error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	dataDirectory := filepath.Join(homeDir, "dailytask")
	err = os.MkdirAll(dataDirectory, os.ModePerm)
	if err != nil {
		return err
	}

	filePath := filepath.Join(dataDirectory, f.fileName)
	f.filePath = filePath

	_, err = os.OpenFile(filePath, os.O_RDWR|os.O_CREATE, os.ModePerm)
	if err != nil {
		return err
	}

	return nil
}

func (f *FileStorage) Close() error {
	return nil
}

func (f *FileStorage) OverWrite(data []byte) error {
	return ioutil.WriteFile(f.filePath, data, os.ModePerm)
}

func (f *FileStorage) Read() ([]byte, error) {
	return ioutil.ReadFile(f.filePath)
}
