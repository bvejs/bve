/**
 * Polling v1.0.0
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
'use strict';

var tslib = require('tslib');

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
        tslib.__classPrivateFieldSet(this, _Polling_tasks, {}, "f");
        tslib.__classPrivateFieldSet(this, _Polling_status, {}, "f");
        tslib.__classPrivateFieldSet(this, _Polling_interval, interval, "f");
    }
    start() {
        if (tslib.__classPrivateFieldGet(this, _Polling_timer, "f")) {
            throw "polling has already started";
        }
        tslib.__classPrivateFieldSet(this, _Polling_timer, setInterval(() => {
            for (const [key, fn] of Object.entries(tslib.__classPrivateFieldGet(this, _Polling_tasks, "f"))) {
                if (["AsyncFunction"].includes(fn.constructor.name)) {
                    // 如果上一个异步方法还在执行，则本次不执行
                    if (tslib.__classPrivateFieldGet(this, _Polling_status, "f")[key]) {
                        if (tslib.__classPrivateFieldGet(this, _Polling_status, "f")[key].status === "pending") {
                            return;
                        }
                    }
                    // 异步方法
                    tslib.__classPrivateFieldGet(this, _Polling_instances, "m", _Polling_setStatus).call(this, key, "pending");
                    fn()
                        .then(() => {
                        tslib.__classPrivateFieldGet(this, _Polling_instances, "m", _Polling_setStatus).call(this, key, "fulfilled");
                    })
                        .catch((e) => {
                        tslib.__classPrivateFieldGet(this, _Polling_instances, "m", _Polling_setStatus).call(this, key, "rejected");
                    });
                }
                else {
                    // 同步方法
                    fn();
                }
            }
        }, tslib.__classPrivateFieldGet(this, _Polling_interval, "f")), "f");
    }
    add(key, fn, ...args) {
        if (tslib.__classPrivateFieldGet(this, _Polling_tasks, "f")[key]) {
            console.error(`[polling]: key ${key} 已经存在`);
        }
        else {
            if (typeof fn === "function") {
                if (args.length) {
                    tslib.__classPrivateFieldGet(this, _Polling_tasks, "f")[key] = fn.bind(null, ...args);
                }
                else {
                    tslib.__classPrivateFieldGet(this, _Polling_tasks, "f")[key] = fn;
                }
            }
            else {
                console.error(`[polling]: ${fn} 不是一个函数`);
            }
        }
    }
    del(key) {
        if (key) {
            delete tslib.__classPrivateFieldGet(this, _Polling_tasks, "f")[key];
        }
        else {
            tslib.__classPrivateFieldSet(this, _Polling_tasks, {}, "f");
            tslib.__classPrivateFieldSet(this, _Polling_status, {}, "f");
        }
    }
    stop() {
        if (tslib.__classPrivateFieldGet(this, _Polling_timer, "f")) {
            clearInterval(tslib.__classPrivateFieldGet(this, _Polling_timer, "f"));
            tslib.__classPrivateFieldSet(this, _Polling_timer, null, "f");
        }
    }
}
_Polling_tasks = new WeakMap(), _Polling_status = new WeakMap(), _Polling_timer = new WeakMap(), _Polling_interval = new WeakMap(), _Polling_instances = new WeakSet(), _Polling_setStatus = function _Polling_setStatus(key, status) {
    let obj = tslib.__classPrivateFieldGet(this, _Polling_status, "f")[key];
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
    tslib.__classPrivateFieldGet(this, _Polling_status, "f")[key] = obj;
};

module.exports = Polling;
//# sourceMappingURL=polling.js.map
