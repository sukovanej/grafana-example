import { createApi } from "./api.js";
import { setupBackgroundLoggerTask } from "./background-logger.js";
import { Logger } from "./logging.js";

const logger = new Logger({ app: "test-app" });

process
  .on("SIGTERM", () => logger.exitWithLog(0, "warning", "exited after SIGTERM"))
  .on("SIGINT", () => logger.exitWithLog(0, "warning", "exited after SIGINT"))
  .on("uncaughtException", () =>
    logger.exitWithLog(1, "error", "exited after uncaught exception")
  )
  .on("unhandledRejection", (error: Error) => {
    logger.sendLog("error", `unhandledRejection ${error.message}`);
  })
  .on("uncaughtException", (error: Error) => {
    logger.sendLog("error", `unhandledException ${error.message}`);
  });

createApi(logger).listen(4000);
setupBackgroundLoggerTask(logger);
