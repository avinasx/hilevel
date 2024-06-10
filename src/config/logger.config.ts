import { format, LoggerOptions, transports } from 'winston';
import { utilities } from 'nest-winston';
import 'winston-daily-rotate-file';

export const loggerOption: LoggerOptions = {
  exitOnError: false,
  transports: [
    new transports.Console({
      level: 'debug', // alert > error > warning > notice > info > debug
      format: format.combine(
        format.timestamp(),
        format.ms(),
        utilities.format.nestLike('High-Level'),
        format.colorize({
          colors: {
            debug: 'blue',
            info: 'green',
            notice: 'yellow',
            warning: 'orange',
            error: 'red',
            alert: 'red',
          },
        }),
      ),
    }),
    // errorTransport,
    // combinedTransport

    new transports.DailyRotateFile({
      // %DATE will be replaced by the current date
      filename: `logs/%DATE%-error.log`,
      level: 'debug',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // don't want to zip our logs
      maxFiles: '30d', // will keep log until they are older than 30 days
    }),
    // same for all levels
    new transports.DailyRotateFile({
      filename: `logs/%DATE%-combined.log`,
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    }),
  ],
};
