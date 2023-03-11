import { Counter, Gauge, Pushgateway, Registry } from "prom-client";
import { Logger } from "./logging.js";

const run = (
  baseLogger: Logger,
  pushGateway: Pushgateway,
  register: Registry
) => {
  const logger = baseLogger.createChild({
    appField1: Math.random(),
    value: "hello",
    array: [1, 2, 3],
    object: { hello: "world" },
    app_number: 1.2,
  });

  const counter = new Counter({
    registers: [register],
    name: "background_task_count",
    help: "Number of times the background task was triggered",
  });

  const randomGauge = new Gauge({
    registers: [register],
    name: "patrik",
    help: "random value",
  });

  return async () => {
    counter.inc();
    randomGauge.set(Math.round(Math.random() * 1000));

    logger.info("hello world info");
    logger.warning("hello world warning");
    logger.debug("hello world debug");

    await pushGateway.push({ jobName: "test-batch-app" });
  };
};

export const setupBackgroundLoggerTask = (...args: Parameters<typeof run>) =>
  setInterval(run(...args), 2000);
