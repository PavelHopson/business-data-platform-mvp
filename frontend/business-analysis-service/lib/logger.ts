type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  service: string;
  component?: string;
  method?: string;
  url?: string;
  status?: number;
  duration?: number;
  error?: string;
  stack?: string;
  user_agent?: string;
  ip?: string;
  [key: string]: string | number | boolean | undefined;
}

class Logger {
  private service: string = 'business-analysis-ui';
  private isServer: boolean;

  constructor() {
    this.isServer = typeof window === 'undefined';
  }

  private formatLog(level: LogLevel, message: string, context?: Record<string, string | number | boolean | undefined>): LogEntry {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.service,
      ...context,
    };

    return logEntry;
  }

  private writeLog(logEntry: LogEntry): void {
    if (this.isServer) {
      console.log(JSON.stringify(logEntry));
    } else {
      const method = logEntry.level === 'ERROR' ? 'error' : 
                     logEntry.level === 'WARNING' ? 'warn' : 
                     logEntry.level === 'DEBUG' ? 'debug' : 'log';
      console[method](`[${logEntry.level}]`, logEntry.message, logEntry);
    }
  }

  debug(message: string, context?: Record<string, string | number | boolean | undefined>): void {
    const logEntry = this.formatLog('DEBUG', message, context);
    this.writeLog(logEntry);
  }

  info(message: string, context?: Record<string, string | number | boolean | undefined>): void {
    const logEntry = this.formatLog('INFO', message, context);
    this.writeLog(logEntry);
  }

  warn(message: string, context?: Record<string, string | number | boolean | undefined>): void {
    const logEntry = this.formatLog('WARNING', message, context);
    this.writeLog(logEntry);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, string | number | boolean | undefined>): void {
    const errorContext: Record<string, string | number | boolean | undefined> = {
      ...context,
    };

    if (error instanceof Error) {
      errorContext.error = error.message;
      errorContext.stack = error.stack;
      errorContext.error_type = error.name;
    } else if (error) {
      errorContext.error = String(error);
    }

    const logEntry = this.formatLog('ERROR', message, errorContext);
    this.writeLog(logEntry);
  }

  logRequest(method: string, url: string, status: number, duration: number, context?: Record<string, string | number | boolean | undefined>): void {
    this.info('HTTP Request', {
      method,
      url,
      status,
      duration,
      event_type: 'http_request',
      ...context,
    });
  }

  logUserAction(action: string, context?: Record<string, string | number | boolean | undefined>): void {
    this.info(`User action: ${action}`, {
      event_type: 'user_action',
      action,
      ...context,
    });
  }

  logSearch(query: string, inn?: string, results?: number, context?: Record<string, string | number | boolean | undefined>): void {
    this.info('Search executed', {
      event_type: 'search',
      query,
      inn,
      results_count: results,
      ...context,
    });
  }
}

export const logger = new Logger();

interface RequestLike {
  headers: {
    get(name: string): string | null;
  };
}

export function createAPILogger(req: RequestLike) {
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  
  return {
    info: (message: string, context?: Record<string, string | number | boolean | undefined>) => {
      logger.info(message, { user_agent: userAgent, ip, ...context });
    },
    error: (message: string, error?: Error | unknown, context?: Record<string, string | number | boolean | undefined>) => {
      logger.error(message, error, { user_agent: userAgent, ip, ...context });
    },
    logRequest: (method: string, url: string, status: number, duration: number, context?: Record<string, string | number | boolean | undefined>) => {
      logger.logRequest(method, url, status, duration, { user_agent: userAgent, ip, ...context });
    },
  };
}

