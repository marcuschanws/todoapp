class Logger {
  private static instance: Logger;
  private readonly isProduction: boolean;

  private constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private log(level: 'log' | 'info' | 'warn' | 'error', message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    
    if (!this.isProduction || level === 'error') {
      if (data) {
        console[level](logMessage, data);
      } else {
        console[level](logMessage);
      }
    }
  }

  public info(message: string, data?: any) {
    this.log('info', message, data);
  }

  public warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  public error(message: string, error?: Error) {
    this.log('error', message, error);
  }
}

export const logger = Logger.getInstance();