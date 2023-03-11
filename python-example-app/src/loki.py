import json
from time import time_ns

import aiohttp


class LokiClient:
    def __init__(self, url: str, labels: dict[str, str]):
        self._url = url
        self._labels = labels

    def create_loki_input(self, labels: dict[str, str], message: str):
        return dict(streams=[dict(stream=labels, values=[[str(time_ns()), message]])])

    async def send_log(self, message: str) -> tuple[str, int]:
        body = self.create_loki_input(self._labels, message)

        async with aiohttp.ClientSession() as session:
            async with session.post(
                self._url, data=json.dumps(body), headers={"Content-Type": "application/json"}
            ) as response:
                return await response.text(), response.status
