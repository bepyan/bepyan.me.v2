const isDev = process.env.NODE_ENV === 'development';
// const isDev = import.meta.env.DEV;

class AppLogger {
  log!: (...args: any[]) => void;
  info!: (...args: any[]) => void;
  debug!: (...args: any[]) => void;
  warn!: (...args: any[]) => void;
  error!: (...args: any[]) => void;

  constructor(packageName: string, showLog = true) {
    const icons = {
      log: '🟢',
      info: '🔵',
      debug: '🟠',
      warn: '🟡',
      error: '🔴',
    } as const;
    const style = 'font-weight:bold;color:lightgreen';

    Object.keys(icons).forEach((k) => {
      if (showLog) {
        const key = k as keyof typeof icons;
        const prefix = `%c${packageName} ${icons[key]}`;
        this[key] = console[key].bind(console, prefix, style);
      } else {
        if (k === 'error') {
          // this[key] = key === 'error' ? (err) => Sentry.captureMessage(err) : () => {};
        }
      }
    });
  }
}

const logger = new AppLogger('[App]', isDev);
export default logger;
