# Node.js 面试题

## 1. Node.js基础

### Q1: 什么是Node.js？它有什么特点？
**答：** Node.js是一个基于Chrome V8引擎的JavaScript运行环境，用于构建快速、可扩展的网络应用。

特点：
- **单线程**：使用单线程事件循环模型处理请求
- **非阻塞I/O**：异步I/O操作，提高并发处理能力
- **事件驱动**：基于事件驱动的编程模型
- **跨平台**：支持Windows、Linux、macOS等操作系统
- **高性能**：V8引擎提供高性能的JavaScript执行环境
- **npm生态**：拥有庞大的第三方模块生态系统

### Q2: Node.js的事件循环机制？
**答：** Node.js的事件循环是单线程的，但它通过事件循环和线程池实现了非阻塞I/O操作。

事件循环的六个阶段：
1. **timers阶段**：执行setTimeout()和setInterval()的回调
2. **pending callbacks阶段**：执行系统操作的回调
3. **idle, prepare阶段**：仅内部使用
4. **poll阶段**：检索新的I/O事件，执行I/O回调
5. **check阶段**：执行setImmediate()的回调
6. **close callbacks阶段**：执行关闭事件的回调

### Q3: Node.js为什么适合I/O密集型应用？
**答：** Node.js适合I/O密集型应用的原因：

1. **非阻塞I/O模型**：当执行I/O操作时，不会阻塞线程，可以继续处理其他请求
2. **事件驱动**：通过事件循环机制高效处理并发请求
3. **轻量级**：相比多线程模型，内存占用更少
4. **高并发**：能够同时处理大量连接

相比之下，CPU密集型任务会占用事件循环，影响整体性能。

## 2. 模块系统

### Q4: Node.js的模块系统有哪些类型？
**答：** Node.js的模块系统包括：

1. **核心模块**：Node.js内置模块，如fs、http、path等
2. **第三方模块**：通过npm安装的模块
3. **自定义模块**：开发者自己编写的模块

模块加载机制：
- 核心模块优先级最高
- 使用require()加载模块
- 模块会被缓存，多次加载返回同一对象

### Q5: CommonJS和ES Module的区别？
**答：**

| 特性 | CommonJS | ES Module |
|------|----------|-----------|
| 加载方式 | 运行时加载 | 编译时加载 |
| 导出方式 | module.exports | export/import |
| 导入方式 | require() | import |
| this指向 | 当前模块 | undefined |
| 文件扩展名 | .js | .mjs 或 package.json中type:"module" |
| 循环依赖 | 可以处理 | 可能报错 |

### Q6: module.exports和exports的区别？
**答：** 

```javascript
// exports是指向module.exports的引用
console.log(exports === module.exports); // true

// 正确的导出方式
module.exports = {
  name: 'Node.js'
};

// 错误的导出方式（会破坏引用关系）
exports = {
  name: 'Node.js'
};

// 正确的导出方式
exports.name = 'Node.js';
```

注意事项：
- 不能直接给exports赋值
- module.exports可以赋值任意类型
- exports只能添加属性

## 3. 异步编程

### Q7: 回调函数、Promise、async/await的区别？
**答：**

**回调函数：**
```javascript
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

**Promise：**
```javascript
fs.promises.readFile('file.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

**async/await：**
```javascript
async function readFile() {
  try {
    const data = await fs.promises.readFile('file.txt');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

区别：
- 回调函数容易产生回调地狱
- Promise解决了回调地狱问题，但链式调用不够直观
- async/await语法更接近同步代码，易于理解和维护

### Q8: Promise的状态有哪些？
**答：** Promise有三种状态：

1. **Pending（待定）**：初始状态，既没有被兑现，也没有被拒绝
2. **Fulfilled（已兑现）**：操作成功完成
3. **Rejected（已拒绝）**：操作失败

状态转换：
- Pending → Fulfilled（resolve）
- Pending → Rejected（reject）
- 状态一旦改变就不能再变

### Q9: 如何处理Promise的错误？
**答：** 处理Promise错误的方式：

1. **使用.catch()方法**：
```javascript
promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

2. **使用async/await配合try/catch**：
```javascript
async function handlePromise() {
  try {
    const result = await promise;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
```

3. **Promise链中的错误处理**：
```javascript
promise
  .then(result => {
    throw new Error('Something went wrong');
  })
  .catch(error => {
    console.error(error);
    return 'default value';
  });
```

## 4. 文件系统和流

### Q10: Node.js中fs模块的常用方法？
**答：** fs模块的常用方法：

**同步方法：**
- fs.readFileSync()
- fs.writeFileSync()
- fs.readdirSync()
- fs.statSync()

**异步方法：**
- fs.readFile()
- fs.writeFile()
- fs.readdir()
- fs.stat()

**Promise版本：**
- fs.promises.readFile()
- fs.promises.writeFile()
- fs.promises.readdir()
- fs.promises.stat()

示例：
```javascript
const fs = require('fs');

// 异步读取文件
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// 同步读取文件
try {
  const data = fs.readFileSync('file.txt', 'utf8');
  console.log(data);
} catch (err) {
  console.error(err);
}
```

### Q11: 什么是Stream？有哪些类型？
**答：** Stream是Node.js中处理流式数据的抽象接口。

四种基本类型：
1. **Readable**：可读流（fs.createReadStream）
2. **Writable**：可写流（fs.createWriteStream）
3. **Duplex**：可读可写流（net.Socket）
4. **Transform**：转换流（zlib.createGzip）

Stream的优点：
- 内存效率高：不需要将所有数据加载到内存中
- 时间效率高：可以边处理边传输
- 支持管道操作：可以链式处理数据

示例：
```javascript
const fs = require('fs');

// 管道操作
fs.createReadStream('input.txt')
  .pipe(fs.createWriteStream('output.txt'));
```

### Q12: Buffer的作用是什么？
**答：** Buffer是Node.js用来处理二进制数据的类。

作用：
- 处理TCP流或文件系统操作中的字节流
- 存储原始数据
- 在不同编码之间转换数据

特点：
- Buffer是Uint8Array的子类
- 大小固定，创建时确定
- 存储原始二进制数据

示例：
```javascript
// 创建Buffer
const buf1 = Buffer.alloc(10); // 创建10字节的Buffer
const buf2 = Buffer.from('hello'); // 从字符串创建Buffer
const buf3 = Buffer.from([1, 2, 3]); // 从数组创建Buffer

// Buffer操作
console.log(buf2.toString()); // 'hello'
console.log(buf2.length); // 5
```

## 5. 网络编程

### Q13: 如何创建HTTP服务器？
**答：** 使用http模块创建HTTP服务器：

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
```

Express框架方式：
```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Q14: Express中间件的原理？
**答：** Express中间件是一个函数，可以访问请求对象(req)、响应对象(res)和应用请求-响应循环中的下一个中间件函数(next)。

中间件功能：
- 执行任何代码
- 修改请求和响应对象
- 结束请求-响应循环
- 调用堆栈中的下一个中间件

类型：
1. **应用级中间件**：app.use()
2. **路由级中间件**：router.use()
3. **错误处理中间件**：接受四个参数(err, req, res, next)
4. **内置中间件**：express.static等
5. **第三方中间件**：body-parser等

示例：
```javascript
// 应用级中间件
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// 路由级中间件
app.get('/user/:id', (req, res, next) => {
  console.log('ID:', req.params.id);
  next();
}, (req, res, next) => {
  res.send('User Info');
});
```

## 6. 数据库操作

### Q15: Node.js如何连接MySQL数据库？
**答：** 使用mysql或mysql2模块连接MySQL：

```javascript
const mysql = require('mysql2');

// 创建连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test'
});

// 连接数据库
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

// 执行查询
connection.query('SELECT * FROM users', (err, results) => {
  if (err) throw err;
  console.log(results);
});

// 使用连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test',
  connectionLimit: 10
});

pool.execute('SELECT * FROM users WHERE id = ?', [1], (err, results) => {
  if (err) throw err;
  console.log(results);
});
```

### Q16: MongoDB在Node.js中的使用？
**答：** 使用mongodb或mongoose模块操作MongoDB：

```javascript
const { MongoClient } = require('mongodb');

// 连接MongoDB
async function connectToMongo() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('testdb');
    const collection = db.collection('users');
    
    // 插入文档
    const result = await collection.insertOne({
      name: 'John',
      email: 'john@example.com'
    });
    console.log('Inserted document:', result.insertedId);
    
    // 查询文档
    const users = await collection.find({}).toArray();
    console.log('Users:', users);
    
  } finally {
    await client.close();
  }
}

connectToMongo().catch(console.error);
```

Mongoose方式：
```javascript
const mongoose = require('mongoose');

// 定义Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model('User', userSchema);

// 连接数据库
mongoose.connect('mongodb://localhost:27017/testdb');

// 创建文档
const user = new User({
  name: 'John',
  email: 'john@example.com'
});

user.save().then(() => console.log('User saved'));
```

## 7. 性能优化

### Q17: Node.js性能优化策略？
**答：** Node.js性能优化策略包括：

1. **使用缓存**：
   - Redis缓存热点数据
   - 内存缓存临时数据

2. **数据库优化**：
   - 合理设计索引
   - 使用连接池
   - 批量操作

3. **异步处理**：
   - 避免阻塞操作
   - 使用异步API

4. **集群模式**：
   - 使用cluster模块充分利用多核CPU
   - 负载均衡

5. **代码优化**：
   - 避免内存泄漏
   - 减少闭包使用
   - 合理使用全局变量

6. **资源压缩**：
   - Gzip压缩响应数据
   - 静态资源压缩

### Q18: 如何排查Node.js内存泄漏？
**答：** 排查Node.js内存泄漏的方法：

1. **使用内置工具**：
   - process.memoryUsage()：查看内存使用情况
   - --inspect参数配合Chrome DevTools分析

2. **常见内存泄漏场景**：
   - 全局变量意外创建
   - 闭包持有大对象引用
   - 事件监听器未正确移除
   - 定时器未清理
   - 缓存无限增长

3. **监控工具**：
   - 使用heapdump生成堆快照
   - 使用clinic.js分析性能瓶颈
   - 使用pm2监控应用状态

示例：
```javascript
// 监控内存使用
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory Usage:', usage);
}, 5000);

// 生成堆快照
const heapdump = require('heapdump');
heapdump.writeSnapshot();
```

## 8. 错误处理和调试

### Q19: Node.js错误处理最佳实践？
**答：** Node.js错误处理最佳实践：

1. **统一错误处理**：
```javascript
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
```

2. **自定义错误类**：
```javascript
class CustomError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

throw new CustomError('Something went wrong', 'CUSTOM_ERROR');
```

3. **中间件错误处理**（Express）：
```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

### Q20: Node.js调试技巧？
**答：** Node.js调试技巧：

1. **使用console.log()**：
```javascript
console.log('Debug:', variable);
console.table(array);
console.time('timer');
// ... some code
console.timeEnd('timer');
```

2. **使用调试器**：
```bash
node --inspect app.js
# 然后在Chrome中访问 chrome://inspect
```

3. **使用debug模块**：
```javascript
const debug = require('debug')('app:startup');
debug('Starting application...');
```

4. **使用Node.js内置调试工具**：
```bash
node inspect app.js
```

5. **使用第三方调试工具**：
   - VS Code调试器
   - WebStorm调试器
   - ndb（Node.js调试器）
