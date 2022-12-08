/**
 * 轮询操作
 * 如果add方法是同步方法，则直接执行
 * 如果是异步方法，会等上一个执行完在执行下一次
 * 如果异步方法连续失败3次，中止执行
 */

export type TasksType = {
  [key: string]: (...args: Array<any>) => any;
};
export type StatusType = {
  [key: string]: {
    count: number; // 连续错误次数
    status: "pending" | "fulfilled" | "rejected";
  };
};

class Polling {
  constructor(interval = 1000) {
    // 任务对像
    this.#tasks = {};
    this.#status = {};
    this.#interval = interval;
  }

  #tasks: TasksType;
  #status: StatusType;
  #timer: any;
  #interval: number;

  #setStatus(key, status) {
    let obj = this.#status[key];
    if (!obj) {
      obj = {
        count: 0,
        status,
      };
    }
    obj.status = status;
    if (status === "rejected") {
      obj.count += 1;
    } else if (status === "fulfilled") {
      // 成功一次就清零
      obj.count = 0;
    }
    if (obj.count >= 3) {
      this.del(key);
    }
    this.#status[key] = obj;
  }

  start() {
    if (this.#timer) {
      throw "polling has already started";
    }
    this.#timer = setInterval(() => {
      for (const [key, fn] of Object.entries(this.#tasks)) {
        if (["AsyncFunction"].includes(fn.constructor.name)) {
          // 如果上一个异步方法还在执行，则本次不执行
          if (this.#status[key]) {
            if (this.#status[key].status === "pending") {
              return;
            }
          }
          // 异步方法
          this.#setStatus(key, "pending");
          fn()
            .then(() => {
              this.#setStatus(key, "fulfilled");
            })
            .catch((e) => {
              this.#setStatus(key, "rejected");
            });
        } else {
          // 同步方法
          fn();
        }
      }
    }, this.#interval);
  }
  add(key: string, fn: (...args: Array<any>) => any, ...args: Array<any>) {
    if (this.#tasks[key]) {
      console.error(`[polling]: key ${key} 已经存在`);
    } else {
      if (typeof fn === "function") {
        if (args.length) {
          this.#tasks[key] = fn.bind(null, ...args);
        } else {
          this.#tasks[key] = fn;
        }
      } else {
        console.error(`[polling]: ${fn} 不是一个函数`);
      }
    }
  }
  del(key?: string) {
    if (key) {
      delete this.#tasks[key];
    } else {
      this.#tasks = {};
      this.#status = {};
    }
  }
  stop() {
    if (this.#timer) {
      clearInterval(this.#timer);
      this.#timer = null;
    }
  }
}

export default Polling;
