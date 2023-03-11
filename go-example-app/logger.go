package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Tags = map[string]interface{}

const (
	Debug   string = "debug"
	Info           = "info"
	Warning        = "warning"
	Error          = "error"
)

type Logger struct {
	labels  Tags
	lokiUrl string
}

func (l *Logger) sendLog(logLevel string, message string, tags Tags) error {
	logBody := map[string](interface{}){
		"logLevel": logLevel,
		"message":  message,
	}

	println("[", logLevel, "]", message)

	for k, v := range tags {
		logBody[k] = v
	}

	logBodyStr, err := json.Marshal(logBody)

	if err != nil {
		return err
	}

	body := map[string]interface{}{
		"streams": []interface{}{map[string](interface{}){
			"stream": l.labels,
			"values": []interface{}{[]interface{}{
				strconv.FormatInt(time.Now().UnixNano(), 10),
				string(logBodyStr),
			}},
		}},
	}

	bodyStr, err := json.Marshal(body)

	if err != nil {
		return err
	}

	client := http.Client{}
	response, err := client.Post(l.lokiUrl, "application/json", strings.NewReader(string(bodyStr)))

	if err != nil {
		println("Loki request failed with", err.Error())
		return err
	}

	println("Log stored", response.StatusCode)
	return nil
}

func (l *Logger) info(message string, tags Tags) {
	l.sendLog(Info, message, tags)
}

func (l *Logger) debug(message string, tags Tags) {
	l.sendLog(Debug, message, tags)
}
