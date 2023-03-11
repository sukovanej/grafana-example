from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from prometheus_client import Counter, generate_latest

from .loki import LokiClient
from .logger import Logger

app = FastAPI()

TAGS = dict(app="python-example-app")

loki_client = LokiClient("http://loki:3100/loki/api/v1/push", TAGS)
logger = Logger(loki_client)

my_endpoint_counter = Counter(
    "my_enpoint_triggered_count",
    "Count the number of times /my-endpoint has been triggered",
    labelnames=list(TAGS.keys()),
).labels(**TAGS)


@app.get("/metrics")
async def metrics():
    await logger.info("/metrics called")
    return PlainTextResponse(generate_latest())


@app.get("/my-endpoint")
async def my_endpoint():
    await logger.info("/my-endpoint called")
    my_endpoint_counter.inc()
    return PlainTextResponse("zdar")
