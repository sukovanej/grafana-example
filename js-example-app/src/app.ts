import { Pushgateway, Registry } from "prom-client";
import { createApi } from "./api.js";
import { setupBackgroundLoggerTask } from "./background-logger.js";
import { setupErrorHandler } from "./exit-handler.js";
import { Logger } from "./logging.js";
import { LokiClient } from "./loki.js";

const TAGS = { app: "js-example-app" };
const lokiClient = new LokiClient("http://loki:3100/loki/api/v1/push", TAGS);
const logger = new Logger(lokiClient, {});

setupErrorHandler(logger);

const register = new Registry();
register.setDefaultLabels(TAGS);

const gatewayRegister = new Registry();
gatewayRegister.setDefaultLabels(TAGS);
const gateway = new Pushgateway("http://pushgateway:9091", {}, gatewayRegister);

logger.debug("App starting");

createApi(logger, register).listen(4000);
setupBackgroundLoggerTask(logger, gateway, gatewayRegister);
