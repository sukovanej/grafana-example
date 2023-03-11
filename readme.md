# Grafana example

Example monitoring local setup.

- [Grafana](https://github.com/grafana/grafana) for data visualization.
- [Loki](https://github.com/grafana/loki) for log aggregation.
- [Prometheus](https://github.com/prometheus/prometheus) for metrics aggregation.
- [Pushgateway](https://github.com/prometheus/pushgateway) for exposing metrics from ephemeral jobs.

## Run locally

Spin up the docker-compose.

```bash
docker-compose up
```

Then you can access

- grafana on [localhost:3000](http://localhost:3000)
- prometheus on [localhost:9090](http://localhost:9090)


### TODO

Currently, I'm using the loki push API directly to store logs. It would be better to let `promptail`
to aggregate them instead.
