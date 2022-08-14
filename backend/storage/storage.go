package storage

import "context"

type Storage interface {
	Open() error
	Close() error
	Read() ([]byte, error)
	OverWrite([]byte) error
	Startup(ctx context.Context)
}
