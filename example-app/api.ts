import { createServer } from "http";
import { collectDefaultMetrics, Registry } from "prom-client";
import { Logger } from "./logging.js";

export const createApi = (logger: Logger) => {
  const register = new Registry();

  try {
    collectDefaultMetrics({
      register,
      labels: { app: "test-api" },
    });
  } catch (e) {
    logger.error(`Metrics setup error ${e}`);
  }

  return createServer(async (req, res) => {
    if (req.url === undefined) {
      logger.error("Unexpected url");
      throw new Error("No url");
    }

    if (req.url === "/metrics") {
      logger.info("Handling /metrics");
      res.write(await register.metrics());
      res.end();
    }
  });
};
