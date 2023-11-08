const isDev = process.env.NODE_ENV === 'development';
// const isDev = import.meta.env.DEV;

class ApiLogger {
  constructor(packageName, showLog = true) {
    const icons = {
      log: '🟢',
      info: '🔵',
      debug: '🟠',
      warn: '🟡',
      error: '🔴',
    };
    const style = 'font-weight:bold;color:lightgreen';

    Object.keys(icons).forEach((key) => {
      if (showLog) {
        if (console[key].bind) {
          const prefix = `%c${packageName} ${icons[key]}`;
          this[key] = console[key].bind(console, prefix, style);
        } else {
          this[key] = console[key];
        }
      } else {
        // this[key] = key === 'error' ? (err) => Sentry.captureMessage(err) : () => {};
      }
    });
  }
}

const logger = new ApiLogger('[App]', isDev);
export default logger;
