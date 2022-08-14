package storage

type fileStorage struct {
}

func NewFileStorage(fileName string) Storage {
	return fileStorage{}
}

func (f fileStorage) Store([]byte) error {
	return nil
}

func (f fileStorage) Read() []byte {
	return nil
}
