from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from prometheus_client import Counter, generate_latest

app = FastAPI()

my_endpoint_counter = Counter(
    "my_enpoint_triggered_count",
    "Count the number of times /my-endpoint has been triggered",
    labelnames=["app"],
).labels(app="python-example-app")


@app.get("/metrics")
def metrics():
    return PlainTextResponse(generate_latest())


@app.get("/my-endpoint")
def my_endpoint():
    my_endpoint_counter.inc()
    return PlainTextResponse("zdar")
