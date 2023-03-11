import fetch from "node-fetch";

const loadNs = process.hrtime();
const loadMs = new Date().getTime();

const nanoseconds = () => {
  let diffNs = process.hrtime(loadNs);
  return (loadMs * 1e6 + diffNs[0] * 1e9 + diffNs[1]).toString();
};

export class LokiClient {
  constructor(
    private readonly url: string,
    private readonly labels: Record<string, string>
  ) {}

  private createLokiInput(labels: Record<string, string>, message: string) {
    return JSON.stringify({
      streams: [
        {
          stream: labels,
          values: [[nanoseconds(), message]],
        },
      ],
    });
  }

  async sendLog(message: string) {
    const body = this.createLokiInput(this.labels, message);
    return fetch(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
  }
}
