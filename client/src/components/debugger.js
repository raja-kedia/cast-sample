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
    this.initialLogs = [];
  }
  init(logCB) {
    console.log("init log: ", logCB);
    this.logCB = logCB;
  }

  addLog(log, type = "log") {
    if (this.logCB) {
      if (this.initialLogs.length) {
        this.initialLogs.push({ log, type });
        this.logCB(() => {
          console.log("log1: ", log);
          return [...this.initialLogs];
        });
        this.initialLogs = [];
      } else {
        this.logCB((p) => {
          console.log("log2: ", log);
          return [...p, { log, type }];
        });
      }
    } else {
      console.log("log0: ", log);
      this.initialLogs.push({ log, type });
    }
  }

  formatLog(logs) {
    return logs.map(({ log, type }, index) => {
      return (
        <div className={styles["log"]} key={`log_${index}`}>
          {log}
        </div>
      );
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
    <div className={styles["debug"]}>
      <div className={styles["container"]}>
        <div className={styles["wrapper"]}>{logger.formatLog(log)}</div>
      </div>
    </div>
  );
}
