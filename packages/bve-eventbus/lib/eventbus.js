/**
 * EventBus v1.0.0
 * https://github.com/bvejs/bve/tree/master/packages/bve-eventbus#readme
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

Object.defineProperty(exports, '__esModule', { value: true });

/*
  用例：类似jquery的on off方法，可以带命名空间

  trigger("click", {}) //正常用法
  on("click", (data)=>{})

  trigger("click",{}) //能触发下面两个
  on("click.a", (data)=>{})
  on("click", (data)=>{})

  off("click") //删除所有click
  off("click.a") //删除a click

  //可以链式写
  on("click", (data)=>{}).trigger("click", {})

  //还可以这样用
  on("data", "123123");
  trigger("data").data; //"123123"
*/
class EventBus {
    constructor() {
        this.index = 0;
        this.events = {
        // "click": {
        //   0: fn,
        //   "a": fn
        // }
        };
        this.trigger = this.trigger.bind(this);
        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
    }
    trigger(event, data) {
        const [key, name] = event.split(".");
        for (const k of Object.keys(this.events)) {
            if (k === key && this.events[k]) {
                const evts = this.events[k];
                for (const n of Object.keys(evts)) {
                    if (name) {
                        if (n == name) {
                            if (evts[n] instanceof Function) {
                                evts[n].call(this, data);
                            }
                            else {
                                this[key] = evts[n];
                            }
                        }
                    }
                    else {
                        if (evts[n] instanceof Function) {
                            evts[n].call(this, data);
                        }
                        else {
                            this[key] = evts[n];
                        }
                    }
                }
            }
        }
        return this;
    }
    on(event, fn) {
        const [key, name] = event.split(".");
        // 不存在则新建一个空白对象存放
        if (!this.events[key]) {
            this.events[key] = {};
        }
        // 如果有[key.name]name属性
        if (name) {
            this.events[key][name] = fn;
        }
        else {
            this.events[key][this.index++] = fn;
        }
        return this;
    }
    off(keys) {
        const keyArr = keys.split(" ");
        const len = keyArr.length;
        const _off = (keyStr) => {
            const [key, name] = keyStr.split(".");
            if (key) {
                for (const k in this.events) {
                    if (k === key) {
                        if (name && this.events[key]) {
                            for (const n in this.events[key]) {
                                if (n === name) {
                                    delete this.events[key][name];
                                }
                            }
                        }
                        else {
                            delete this.events[key];
                        }
                    }
                }
            }
            else if (typeof key === "undefined") {
                this.events = {};
            }
        };
        for (let i = 0; i < len; i++) {
            _off.call(this, keyArr[i]);
        }
        return this;
    }
}
const eventBus = new EventBus();

exports.default = EventBus;
exports.eventBus = eventBus;
//# sourceMappingURL=eventbus.js.map
