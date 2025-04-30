export class Logger {
  static debug(tag: string, message: string, ...args: any[]) {
    if (__DEV__) {
      console.log(`[${tag}] ${message}`, ...args);
    }
  }

  static error(tag: string, message: string, ...args: any[]) {
    if (__DEV__) {
      console.error(`[${tag}] ${message}`, ...args);
    }
  }

  static info(tag: string, message: string, ...args: any[]) {
    if (__DEV__) {
      console.info(`[${tag}] ${message}`, ...args);
    }
  }

  static warn(tag: string, message: string, ...args: any[]) {
    if (__DEV__) {
      console.warn(`[${tag}] ${message}`, ...args);
    }
  }
} 