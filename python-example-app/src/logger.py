import json
from typing import Literal

from .loki import LokiClient

LogLevel = Literal["info", "debug", "warning", "error"]


class Logger:
    def __init__(self, loki_client: LokiClient, tags: dict = {}):
        self._loki_client = loki_client
        self._tags = tags

    def createChild(self, extendTags: dict = {}):
        return Logger(self._loki_client, {**self._tags, **extendTags})

    async def sendLog(self, log_level: LogLevel, message: str, tags: dict = {}):
        text, status = await self._loki_client.send_log(
            json.dumps(dict(log_level=log_level, message=message, **self._tags, **tags))
        )
        print(f"[{log_level}] ${message}")
        print(f"Log sent, text={text}, status={status}")

    async def debug(self, message: str, tags: dict = {}):
        await self.sendLog("debug", message, tags)

    async def info(self, message: str, tags: dict = {}):
        await self.sendLog("info", message, tags)

    async def warning(self, message: str, tags: dict = {}):
        await self.sendLog("warning", message, tags)

    async def error(self, message: str, tags: dict = {}):
        await self.sendLog("error", message, tags)
