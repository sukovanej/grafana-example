import { Logger } from "./logging.js";

const run = (baseLogger: Logger) => {
  const logger = baseLogger.createChild({
    appField1: Math.random(),
    value: "hello",
    array: [1, 2, 3],
    object: { hello: "world" },
    app_number: 1.2,
  });

  logger.info("hello world info");
  logger.warning("hello world warning");
  logger.debug("hello world debug");
};

export const setupBackgroundLoggerTask = (logger: Logger) =>
  setInterval(() => run(logger), 2000);
