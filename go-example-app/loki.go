package main

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type Labels = map[string]string

type LokiClient struct {
	url    string
	labels Labels
}

func (l *LokiClient) sendLog(message string) error {
	body := map[string]interface{}{
		"streams": []interface{}{map[string](interface{}){
			"stream": l.labels,
			"values": []interface{}{[]interface{}{
				strconv.FormatInt(time.Now().UnixNano(), 10),
				message,
			}},
		}},
	}

	bodyStr, err := json.Marshal(body)

	if err != nil {
		return err
	}

	client := http.Client{}
	response, err := client.Post(l.url, "application/json", strings.NewReader(string(bodyStr)))

	if err != nil {
		println("Loki request failed with", err.Error())
		return err
	}

	println("Log stored", response.StatusCode)
	return nil
}
