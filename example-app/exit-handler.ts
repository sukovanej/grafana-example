import { JsonObject, Logger, LogLevel } from "./logging.js";

const createExitWithLog =
  (logger: Logger) =>
  (exitCode: number, logLevel: LogLevel, message: string, tags?: JsonObject) =>
    logger.sendLog(logLevel, message, tags).then(() => process.exit(exitCode));

export const setupErrorHandler = (logger: Logger) => {
  const exitWithLog = createExitWithLog(logger);

  process
    .on("SIGTERM", () => exitWithLog(0, "warning", "exited after SIGTERM"))
    .on("SIGINT", () => exitWithLog(0, "warning", "exited after SIGINT"))
    .on("unhandledRejection", (error: Error) => {
      logger.sendLog("error", `unhandledRejection ${error.message}`);
    })
    .on("uncaughtException", (error: Error) => {
      logger.sendLog("error", `unhandledException ${error.message}`);
    });
};
