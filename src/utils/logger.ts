import { join } from "node:path";
import { cwd } from "node:process";
import pretty from "pino-pretty";
import { createStream } from "rotating-file-stream";

import ENV from "@/env";
import { Logger, PinoLogger, type StreamArray } from "@/lib/utils/logger";

const logFileStream = createStream("combined.log", {
  interval: "1d",
  compress: "gzip",
  path: join(cwd(), "logs"),
});

const errorFileStream = createStream("error.log", {
  interval: "1d",
  compress: "gzip",
  path: join(cwd(), "logs"),
});

const streams: StreamArray = [
  { stream: logFileStream },
  { stream: errorFileStream, level: "error" },
];

if (ENV.NODE_ENV === "dev") {
  streams.push({ stream: pretty({ colorize: true }), level: "debug" });
}

export const logger = Logger(ENV.LOG_LEVEL, streams);
export const pinoHttpLogger = () => PinoLogger(ENV.LOG_LEVEL, streams);
