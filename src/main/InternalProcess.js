import { fork } from "child_process";
import logger from "~/logger";
import forceKill from "tree-kill";

class InternalProcess {
  constructor({ timeout }) {
    this.process = null;

    this.timeout = timeout;
    this.active = false;

    this.onStartCallback = null;
    this.onMessageCallback = null;
    this.onExitCallback = null;

    this.messageQueue = [];
  }

  onMessage(callback) {
    this.onMessageCallback = callback;
  }

  onExit(callback) {
    this.onExitCallback = callback;
  }

  run() {
    while (this.messageQueue.length && this.active && this.process) {
      const message = this.messageQueue.shift();
      this.process.send(message);
    }
  }

  send(message) {
    this.messageQueue.push(message);
    if (this.active) {
      this.run();
    }
  }

  onStart(callback) {
    this.onStartCallback = callback;
  }

  configure(path, args, options) {
    this.path = path;
    this.args = args;
    this.options = options;
  }

  start() {
    if (this.process) {
      throw new Error("Internal process is already running !");
    }

    this.process = fork(this.path, this.args, this.options);

    this.active = true;
    const pid = this.process.pid;

    logger.info(`spawned internal process ${pid}`);
    console.log(`spawned internal process ${pid}`);

    this.process.on("exit", (code, signal) => {
      this.process = null;

      if (code !== null) {
        console.log(`internal process ${pid} gracefully exited with code ${code}`);
        logger.info(`Internal process ${pid} ended with code ${code}`);
      } else {
        console.log(`internal process ${pid} got killed by signal ${signal}`);
        logger.info(`Internal process ${pid} killed with signal ${signal}`);
      }

      if (this.onExitCallback) {
        this.onExitCallback(code, signal, this.active);
      }
    });

    this.process.on("message", message => {
      if (this.onMessageCallback && this.active) {
        this.onMessageCallback(message);
      }
    });

    if (this.messageQueue.length) {
      this.run();
    }

    this.process.stdout.on("data", data => {
      let count = 0;
      let acc = "";
      const str = data
        .toString()
        .split("\n")
        .join("");
      const lastIndex = 0;
      for (let i = 0; i < str.length; i++) {
        switch (str[i]) {
          case "[":
          case "{":
            count++;
            break;
          case "]":
          case "}":
            count--;
            if (count === 0) {
              acc += str.slice(lastIndex, i + 1);
              if (process.env.INTERNAL_LOGS) console.log(acc);
              try {
                const obj = JSON.parse(acc);
                if (obj && obj.type === "log") {
                  logger.onLog(obj.log);
                  return;
                }
                logger.debug("I: " + acc);
                acc = "";
              } catch (error) {
                if (process.env.INTERNAL_LOGS) console.error(error);
              }
            }
            break;
          default:
        }
      }
      acc += str.slice(lastIndex);
    });
    this.process.stderr.on("data", data => {
      const msg = String(data).trim();
      if (__DEV__) console.error("I.e: " + msg);
      logger.error("I.e: " + String(data).trim());
    });

    if (this.onStartCallback) {
      this.onStartCallback();
    }
  }

  stop() {
    return new Promise((resolve, reject) => {
      if (!this.process) {
        reject(new Error("Process not running"));
        return;
      }

      this.messageQueue = [];
      const pid = this.process.pid;

      logger.info(`ending process ${pid} ...`);
      console.log(`ending process ${pid} ...`);
      this.active = false;
      this.process.once("exit", () => {
        resolve();
      });
      this.process.disconnect();
      setTimeout(() => {
        if (this.process && this.process.pid === pid) {
          forceKill(pid, "SIGKILL");
        }
      }, this.timeout);
    });
  }

  restart() {
    return this.stop().then(() => {
      this.start();
    });
  }
}

export default InternalProcess;
