import { Injectable, LoggerService } from '@nestjs/common';
import {
  PathLike,
  appendFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  statSync,
} from 'fs';
import { join, resolve } from 'path';

@Injectable()
class LoggingService implements LoggerService {
  level: number;

  constructor() {
    this.level = parseInt(process.env.LOGGING_LEVEL) || 2;
  }

  log(message: string) {
    return this.writeLog(2, message);
  }

  error(message: string) {
    return this.writeLog(0, message);
  }

  warn(message: string) {
    return this.writeLog(1, message);
  }

  debug(message: string) {
    return this.writeLog(3, message);
  }

  verbose(message: string) {
    return this.writeLog(4, message);
  }

  writeLog(level: number, message: any) {
    const loggingSize = parseInt(process.env.LOGGING_SIZE);
    const pathToFolder = join(__dirname, '..', '..', 'logs');
    const logLevels = {
      0: 'error',
      1: 'warn',
      2: 'log',
      3: 'debug',
      4: 'verbose',
    };
    if (level > this.level) return false;
    const logMessage = `${
      logLevels[level]
    }: ${new Date().toISOString()} - ${message}\n`;
    process.stdout.write(logMessage);
    if (!existsSync(pathToFolder)) mkdirSync(pathToFolder, { recursive: true });
    const logFilename = resolve(pathToFolder, 'temp.log');
    let errorLogFilename: PathLike;
    if (logLevels[level] === 'error') {
      errorLogFilename = resolve(pathToFolder, 'error-temp.log');
    }
    try {
      const stats = statSync(logFilename);
      const sizeInBytes = stats.size;
      if (errorLogFilename) {
        const errorLogStats = statSync(errorLogFilename);
        const errorLogSizeInBytes = errorLogStats.size;
        if (errorLogSizeInBytes >= (loggingSize || 10) * 1000) {
          renameSync(
            errorLogFilename,
            resolve(pathToFolder, `error-log-${Date.now()}.log`),
          );
        }
      }
      if (sizeInBytes >= (loggingSize || 10) * 1000) {
        renameSync(logFilename, resolve(pathToFolder, `log-${Date.now()}.log`));
      }
    } catch (error) {
      console.error(error);
    }
    appendFileSync(logFilename, logMessage + '\n');
    if (errorLogFilename) appendFileSync(errorLogFilename, logMessage + '\n');
    return true;
  }
}

export default LoggingService;
