import { LokiClient } from "./loki";

type JsonValue =
  | number
  | string
  | JsonValue[]
  | { [K in string | number]: JsonValue };
export type JsonObject = Record<string, JsonValue>;

export type LogLevel = "debug" | "info" | "warning" | "error";

export class Logger {
  constructor(
    private readonly lokiClient: LokiClient,
    private readonly tags: JsonObject | undefined
  ) {}

  createChild(extendTags?: JsonObject) {
    return new Logger(this.lokiClient, { ...this.tags, ...extendTags });
  }

  async sendLog(logLevel: LogLevel, message: string, tags?: JsonObject) {
    const res = await this.lokiClient.sendLog(
      JSON.stringify({ logLevel, message, ...this.tags, ...tags })
    );
    console.log(`[${logLevel}] ${message}`);
    console.log(`Log sent, text=${res.statusText}, status=${res.status}`);
  }

  async debug(message: string, tags?: JsonObject) {
    return this.sendLog("debug", message, tags);
  }

  async info(message: string, tags?: JsonObject) {
    return this.sendLog("info", message, tags);
  }

  async warning(message: string, tags?: JsonObject) {
    return this.sendLog("warning", message, tags);
  }

  async error(message: string, tags?: JsonObject) {
    return this.sendLog("error", message, tags);
  }
}
