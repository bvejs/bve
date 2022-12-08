# 安装

```
yarn add @bve/eventbus

or

npm install @bve/eventbus
```

# 用法

### 获取实例
---

```javascript
  import EventBus from '@bve/eventbus';

  const eventBus = new EventBus();
```
  或者直接用全局
```javascript
  import { eventBus } from '@bve/eventbus';
```


### 使用
---
```javascript

  // 绑定
  eventBus.on("click", (data)=>{
    console.log(data) // hello world
  })
  // 触发
  eventBus.trigger("click", 'hello world')
  // 移除绑定
  eventBus.off("click")
```

```javascript
  eventBus.on("click.a", (data)=>{
    console.log(data)
  })
  eventBus.on("click", (data)=>{
    console.log(data)
  })

  // 同时触发上面两个事件
  eventBus.trigger("click", 'hello world')

  // 移除所有 click
  eventBus.off("click")
  // 移除所有 click.a
  eventBus.off("click.a") //删除a click
```

```javascript
  // 可以链式写
  eventBus.on("click", ()=>{}).trigger("click")
```

```javascript
eventBus.on("data", "123123");
eventBus.trigger("data").data; //"123123"
```