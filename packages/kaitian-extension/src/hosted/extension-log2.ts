import { LogServiceManager } from '@ali/ide-logs/lib/node/log-manager';
import { Injector } from '@ali/common-di';
import { SupportLogNamespace, ILogService, LogLevel, AppConfig } from '@ali/ide-core-node';

declare var __non_webpack_require__: any;

export class ExtensionLogger2 {

  private injector: Injector;
  private loggerManager: LogServiceManager;
  private logger: ILogService;
  private config: any;

  constructor(injector) {
    this.injector = injector;
    this.config = this.injector.get(AppConfig);
    this.injectLogService();

    this.loggerManager =  this.injector.get(LogServiceManager);
    this.logger = this.loggerManager.getLogger(SupportLogNamespace.ExtensionHost);
  }

  injectLogService() {
    if (this.config.extLogServiceClassPath) {
      let LogServiceClass = __non_webpack_require__(this.config.extLogServiceClassPath);
      if (LogServiceClass.default) {
        LogServiceClass = LogServiceClass.default;
      }
      this.injector.overrideProviders({
        token: AppConfig,
        useValue: Object.assign({}, this.config, {LogServiceClass}),
      });
    }
  }

  error(...args) {
    return this.logger.error(...args);
  }

  warn(...args) {
    return this.logger.warn(...args);
  }

  log(...args) {
    return this.logger.log(...args);
  }
  debug(...args) {
    return this.logger.debug(...args);
  }

  verbose(...args) {
    return this.logger.verbose(...args);
  }

  critical(...args) {
    return this.logger.critical(...args);
  }

  dispose() {
    return this.logger.dispose();
  }

  setOptions(options) {
    return this.logger.setOptions(options);
  }

  sendLog(level: LogLevel, message: string) {
    return this.logger.sendLog(level, message);
  }

  drop() {
    return this.logger.drop();
  }

  flush() {
    return this.logger.flush();
  }

  getLevel() {
    return this.logger.getLevel();
  }

  setLevel(level: LogLevel) {
    return this.logger.setLevel(level);
  }

}
