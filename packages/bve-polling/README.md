# 安装

```
yarn add @bve/polling

or

npm install @bve/polling
```

# 用法

### 获取实例
---

```javascript
  import Polling from '@bve/polling';

  // 默认 1000 毫秒
  const eventBus = new EventBus(2000);
```


### 使用
---
```javascript

// 开始
polling.start();

// 轮询执行
polling.add('getData', () => {
  console.log('getData'); 
});

// 延时轮询执行
polling.add('getData', async () => {
  await delay(5000);
  console.log('getData');
});

// 删除getData的轮询，如果不传则删除所有轮询
polling.del('getData');

// 停止轮询
polling.stop();

```