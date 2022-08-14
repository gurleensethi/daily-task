package storage

type Storage interface {
	Store([]byte) error
	Read() []byte
}
