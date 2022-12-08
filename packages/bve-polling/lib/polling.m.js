/**
 * Polling v1.0.1
 * https://github.com/bvejs/bve/tree/master/packages/bve-polling#readme
 *
 * @license
 * Copyright (c) 2020 BVE Inc. All Rights Reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 * 
 *  1. Redistribution of source code must retain the above copyright notice, this
 *     list of conditions and the following disclaimer.
 * 
 *  2. Redistribution in binary form must reproduce the above copyright notice,
 *     this list of conditions and the following disclaimer in the documentation
 *     and/or other materials provided with the distribution.
 * 
 *  3. Neither the name of the copyright holder nor the names of its contributors
 *     may be used to endorse or promote products derived from this software without
 *     specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 * IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
 * OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 * 
 * YOU ACKNOWLEDGE THAT THIS SOFTWARE IS NOT DESIGNED, LICENSED OR INTENDED FOR USE
 * IN THE DESIGN, CONSTRUCTION, OPERATION OR MAINTENANCE OF ANY MILITARY FACILITY.
 */
import { __classPrivateFieldSet, __classPrivateFieldGet } from 'tslib';

/**
 * 轮询操作
 * 如果add方法是同步方法，则直接执行
 * 如果是异步方法，会等上一个执行完在执行下一次
 * 如果异步方法连续失败3次，中止执行
 */
var _Polling_instances, _Polling_tasks, _Polling_status, _Polling_timer, _Polling_interval, _Polling_setStatus;
class Polling {
    constructor(interval = 1000) {
        _Polling_instances.add(this);
        _Polling_tasks.set(this, void 0);
        _Polling_status.set(this, void 0);
        _Polling_timer.set(this, void 0);
        _Polling_interval.set(this, void 0);
        // 任务对像
        __classPrivateFieldSet(this, _Polling_tasks, {}, "f");
        __classPrivateFieldSet(this, _Polling_status, {}, "f");
        __classPrivateFieldSet(this, _Polling_interval, interval, "f");
    }
    start() {
        if (__classPrivateFieldGet(this, _Polling_timer, "f")) {
            throw "polling has already started";
        }
        __classPrivateFieldSet(this, _Polling_timer, setInterval(() => {
            for (const [key, fn] of Object.entries(__classPrivateFieldGet(this, _Polling_tasks, "f"))) {
                if (["AsyncFunction"].includes(fn.constructor.name)) {
                    // 如果上一个异步方法还在执行，则本次不执行
                    if (__classPrivateFieldGet(this, _Polling_status, "f")[key]) {
                        if (__classPrivateFieldGet(this, _Polling_status, "f")[key].status === "pending") {
                            return;
                        }
                    }
                    // 异步方法
                    __classPrivateFieldGet(this, _Polling_instances, "m", _Polling_setStatus).call(this, key, "pending");
                    fn()
                        .then(() => {
                        __classPrivateFieldGet(this, _Polling_instances, "m", _Polling_setStatus).call(this, key, "fulfilled");
                    })
                        .catch((e) => {
                        __classPrivateFieldGet(this, _Polling_instances, "m", _Polling_setStatus).call(this, key, "rejected");
                    });
                }
                else {
                    // 同步方法
                    fn();
                }
            }
        }, __classPrivateFieldGet(this, _Polling_interval, "f")), "f");
    }
    add(key, fn, ...args) {
        if (__classPrivateFieldGet(this, _Polling_tasks, "f")[key]) {
            console.error(`[polling]: key ${key} 已经存在`);
        }
        else {
            if (typeof fn === "function") {
                if (args.length) {
                    __classPrivateFieldGet(this, _Polling_tasks, "f")[key] = fn.bind(null, ...args);
                }
                else {
                    __classPrivateFieldGet(this, _Polling_tasks, "f")[key] = fn;
                }
            }
            else {
                console.error(`[polling]: ${fn} 不是一个函数`);
            }
        }
    }
    del(key) {
        if (key) {
            delete __classPrivateFieldGet(this, _Polling_tasks, "f")[key];
        }
        else {
            __classPrivateFieldSet(this, _Polling_tasks, {}, "f");
            __classPrivateFieldSet(this, _Polling_status, {}, "f");
        }
    }
    stop() {
        if (__classPrivateFieldGet(this, _Polling_timer, "f")) {
            clearInterval(__classPrivateFieldGet(this, _Polling_timer, "f"));
            __classPrivateFieldSet(this, _Polling_timer, null, "f");
        }
    }
}
_Polling_tasks = new WeakMap(), _Polling_status = new WeakMap(), _Polling_timer = new WeakMap(), _Polling_interval = new WeakMap(), _Polling_instances = new WeakSet(), _Polling_setStatus = function _Polling_setStatus(key, status) {
    let obj = __classPrivateFieldGet(this, _Polling_status, "f")[key];
    if (!obj) {
        obj = {
            count: 0,
            status,
        };
    }
    obj.status = status;
    if (status === "rejected") {
        obj.count += 1;
    }
    else if (status === "fulfilled") {
        // 成功一次就清零
        obj.count = 0;
    }
    if (obj.count >= 3) {
        this.del(key);
    }
    __classPrivateFieldGet(this, _Polling_status, "f")[key] = obj;
};

export { Polling as default };
//# sourceMappingURL=polling.m.js.map
