package main

import (
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func recordMetrics(logger *Logger) {
	go func() {
		for {
			logger.info("Storing metrics", Tags{"patrik": "je borec"})
			opsProcessed.Inc()
			time.Sleep(2 * time.Second)
		}
	}()
}

var (
	labels = prometheus.Labels{
		"app": "go-example-app",
	}
	opsProcessed = promauto.NewCounter(prometheus.CounterOpts{
		Name:        "go_example_processed_events",
		Help:        "The total number of processed events",
		ConstLabels: labels,
	})
	goEndpointCalled = promauto.NewCounter(prometheus.CounterOpts{
		Name:        "go_endpoint_called",
		Help:        "The total number of calls to the /go-endpoint",
		ConstLabels: labels,
	})
)

func main() {
	lokiClient := LokiClient{
		url:    "http://loki:3100/loki/api/v1/push",
		labels: labels,
	}
	logger := Logger{Tags{}, lokiClient}

	logger.info("App started", Tags{})

	recordMetrics(&logger)

	http.Handle("/metrics", promhttp.Handler())

	http.HandleFunc("/go-endpoint", func(w http.ResponseWriter, r *http.Request) {
		logger.debug("/go-endpoint called", Tags{"hello": "world"})
		goEndpointCalled.Inc()
		w.Write([]byte("zdar proste"))
	})

	http.ListenAndServe(":4002", nil)
}
