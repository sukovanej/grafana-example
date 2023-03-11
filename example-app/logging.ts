import fetch from "node-fetch";

const loadNs = process.hrtime();
const loadMs = new Date().getTime();

const nanoseconds = () => {
  let diffNs = process.hrtime(loadNs);
  return (loadMs * 1e6 + diffNs[0] * 1e9 + diffNs[1]).toString();
};

export type JsonValue =
  | number
  | string
  | JsonValue[]
  | { [K in string | number]: JsonValue };
export type JsonObject = Record<string, JsonValue>;

export type LogLevel = "debug" | "info" | "warning" | "error";

export class Logger {
  constructor(readonly tags: JsonObject | undefined) {}

  createChild(extendTags?: JsonObject) {
    return new Logger({ ...this.tags, ...extendTags });
  }

  private createLokiInput(labels: JsonObject, object: JsonObject) {
    return JSON.stringify({
      streams: [
        {
          stream: labels,
          values: [[nanoseconds(), JSON.stringify(object)]],
        },
      ],
    });
  }

  async sendLog(logLevel: LogLevel, message: string, tags?: JsonObject) {
    const body = this.createLokiInput(
      { app: "testapp", foo: "bar" },
      { message, ...tags, ...this.tags }
    );
    const res = await fetch("http://loki:3100/loki/api/v1/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

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
