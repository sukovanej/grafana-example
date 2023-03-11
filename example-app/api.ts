import { createServer } from "http";
import { collectDefaultMetrics, Registry } from "prom-client";
import { Logger } from "./logging.js";

export const createApi = (logger: Logger) => {
  const register = new Registry();

  collectDefaultMetrics({
    register,
    labels: { app: "test-api" },
  });

  return createServer(async (req, res) => {
    if (req.url === "/metrics") {
      logger.info("Handling /metrics");
      res.write(await register.metrics());
      res.end();
    }
  });
};
