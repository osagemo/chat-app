const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const path = require("path");

const myFormat = printf((info) => {
  if (info.stack) {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message} : ${info.stack}`;
  }
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const getLabel = function (callingModule) {
  const parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};
//
// - Write all logs with level `info` and below to `svamp-combined.log`.
// - Write all logs error (and above) to `svamp-error.log`.
//
let transportOutputs = [];
if (process.env.NODE_ENV === "development") {
  transportOutputs.push(new transports.Console());
} else if (process.env.NODE_ENV === "production") {
  transportOutputs.push(
    new transports.File({
      filename: "error.log",
      level: "error",
    })
  );
  transportOutputs.push(new transports.File({ filename: "combined.log" }));
}

// module.exports = logger;

module.exports = function (callingModule) {
  return createLogger({
    level: "info",
    format: combine(
      label({ label: getLabel(callingModule) }),
      timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
      }),
      format.errors({ stack: true }),
      myFormat,
      format.splat()
    ),
    transports: transportOutputs,
  });
};
