import React, { useEffect, useState } from "react";
import styles from "./debugger.scss";

const useLog = () => {
  const [log, setLog] = useState([]);
  useEffect(() => {
    logger.init(setLog);
  }, []);

  return [log];
};

class Logger {
  constructor() {
    this.addLog = this.addLog.bind(this);
    this.init = this.init.bind(this);
    this.formatLog = this.formatLog.bind(this);
    this.clearLog = this.clearLog.bind(this);
    this.log = null;
  }
  init(logCB) {
    this.logCB = logCB;
  }

  getLog() {}

  addLog(log, type = "log") {
    this.logCB &&
      this.logCB((p) => {
        return [...p, { log, type }];
      });
  }

  formatLog(logs) {
    return logs.map(({log, type}, index) => {
      return <div className={styles["log"]} key={`log_${index}`}>{log}</div>;
    });
  }

  clearLog() {
    this.logCB(() => []);
  }
}

const logger = new Logger();

export const logValue = logger.addLog;

export function DebugWindow() {
  const [log] = useLog();

  return (
    <div className={styles["container"]}>
      <div className={styles["wrapper"]}>{logger.formatLog(log)}</div>
    </div>
  );
}
