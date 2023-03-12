package main

import (
	"encoding/json"
)

type Tags = map[string]interface{}

const (
	Debug   string = "debug"
	Info           = "info"
	Warning        = "warning"
	Error          = "error"
)

type Logger struct {
	tags       Tags
	lokiClient LokiClient
}

func (l *Logger) sendLog(logLevel string, message string, tags Tags) error {
	logBody := map[string](interface{}){
		"logLevel": logLevel,
		"message":  message,
	}

	println("[", logLevel, "]", message)

	for k, v := range l.tags {
		logBody[k] = v
	}

	for k, v := range tags {
		logBody[k] = v
	}

	logBodyStr, err := json.Marshal(logBody)

	if err != nil {
		return err
	}

	l.lokiClient.sendLog(string(logBodyStr))
	return nil
}

func (l *Logger) info(message string, tags Tags) {
	l.sendLog(Info, message, tags)
}

func (l *Logger) debug(message string, tags Tags) {
	l.sendLog(Debug, message, tags)
}
