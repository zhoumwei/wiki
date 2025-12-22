# Java 多线程详解

## 1. 线程基础概念

### Q1: 什么是进程和线程？
**答：**
- **进程**：是操作系统分配资源的基本单位，每个进程都有独立的内存空间
- **线程**：是CPU调度的基本单位，同一进程内的线程共享进程的内存空间

主要区别：
1. 地址空间：进程间相互独立，线程间共享所属进程的资源
2. 开销：进程创建和销毁开销大，线程相对较小
3. 切换：进程切换开销大，线程切换开销小
4. 通信：进程间通信需要IPC机制，线程间可直接读写进程数据

### Q2: 为什么要使用多线程？
**答：** 使用多线程的主要原因包括：
1. **提高性能**：充分利用多核CPU的计算能力
2. **改善用户体验**：避免界面卡顿，提升响应速度
3. **提高资源利用率**：当一个线程等待I/O时，其他线程可以继续执行
4. **简化程序设计**：某些业务逻辑天然适合并发处理

### Q3: 线程有哪些状态？
**答：** Java线程有6种状态：
1. **NEW**：新建状态，线程刚创建还未调用start()方法
2. **RUNNABLE**：就绪状态，线程正在JVM中执行，可能正在等待OS资源（如处理器）
3. **BLOCKED**：阻塞状态，线程等待监视器锁进入同步块/方法
4. **WAITING**：等待状态，线程无限期等待其他线程执行特定动作
5. **TIMED_WAITING**：超时等待状态，线程等待其他线程执行特定动作，但设置了超时时间
6. **TERMINATED**：终止状态，线程执行完毕

## 2. 创建线程的方式

### Q4: 创建线程有哪几种方式？
**答：** 创建线程主要有以下几种方式：

1. **继承Thread类**：
   ```java
   class MyThread extends Thread {
       public void run() {
           // 线程执行代码
       }
   }
   // 使用
   MyThread thread = new MyThread();
   thread.start();
   ```

2. **实现Runnable接口**：
   ```java
   class MyRunnable implements Runnable {
       public void run() {
           // 线程执行代码
       }
   }
   // 使用
   Thread thread = new Thread(new MyRunnable());
   thread.start();
   ```

3. **实现Callable接口**：
   ```java
   class MyCallable implements Callable<String> {
       public String call() throws Exception {
           // 线程执行代码，有返回值
           return "执行结果";
       }
   }
   // 使用
   FutureTask<String> futureTask = new FutureTask<>(new MyCallable());
   Thread thread = new Thread(futureTask);
   thread.start();
   ```

4. **使用线程池**：
   ```java
   ExecutorService executor = Executors.newFixedThreadPool(3);
   executor.execute(() -> {
       // 线程执行代码
   });
   ```

### Q5: Runnable和Callable的区别？
**答：**
| 特性 | Runnable | Callable |
|------|----------|----------|
| 返回值 | 无返回值 | 有返回值 |
| 异常处理 | 不能抛出受检异常 | 可以抛出受检异常 |
| 实现方法 | run() | call() |
| 使用场景 | 一般任务执行 | 有返回结果的任务 |

## 3. 线程同步与锁机制

### Q6: synchronized关键字的作用和用法？
**答：** synchronized关键字用于实现线程同步，确保同一时刻只有一个线程执行特定代码块。

用法：
1. **修饰实例方法**：锁住当前实例对象
   ```java
   public synchronized void method() { /* 代码 */ }
   ```

2. **修饰静态方法**：锁住当前类的Class对象
   ```java
   public static synchronized void method() { /* 代码 */ }
   ```

3. **修饰代码块**：指定加锁对象
   ```java
   synchronized(obj) { /* 代码 */ }
   ```

### Q7: volatile关键字的作用？
**答：** volatile关键字有两个主要作用：
1. **可见性**：确保变量修改对所有线程立即可见
2. **禁止指令重排序**：防止JVM对代码进行优化重排序

注意：volatile不能保证原子性，只保证可见性和有序性。

### Q8: ReentrantLock和synchronized的区别？
**答：**
| 特性 | ReentrantLock | synchronized |
|------|---------------|--------------|
| 锁获取方式 | 显式获取和释放 | 隐式获取和释放 |
| 可中断 | 支持 | 不支持 |
| 超时获取 | 支持 | 不支持 |
| 公平锁 | 支持 | 不支持 |
| 锁绑定条件 | 支持多个Condition | 不支持 |
| 性能 | 竞争激烈时表现更好 | 竞争不激烈时性能较好 |

## 4. 线程间通信

### Q9: wait()、notify()和notifyAll()的作用？
**答：**
- **wait()**：使当前线程等待并释放锁，直到其他线程调用notify()或notifyAll()
- **notify()**：唤醒在此对象监视器上等待的单个线程
- **notifyAll()**：唤醒在此对象监视器上等待的所有线程

注意事项：
1. 这些方法只能在同步方法或同步块中调用
2. 调用wait()后线程会释放锁，而sleep()不会释放锁
3. 通常使用while循环而不是if语句来检查条件

### Q10: ThreadLocal的原理和使用场景？
**答：** ThreadLocal为每个线程提供独立的变量副本，实现了线程间的数据隔离。

原理：
1. 每个Thread对象内部都有一个ThreadLocalMap
2. ThreadLocal作为key，线程本地变量作为value存储在map中
3. 通过Thread.currentThread()获取当前线程，进而访问其ThreadLocalMap

使用场景：
1. 数据库连接管理
2. Session管理
3. SimpleDateFormat等非线程安全对象的使用

## 5. 线程池

### Q11: 为什么要使用线程池？
**答：** 使用线程池的好处包括：
1. **降低资源消耗**：避免频繁创建和销毁线程
2. **提高响应速度**：任务到达时无需等待线程创建
3. **提高线程可管理性**：统一分配、调优和监控线程
4. **防止服务器过载**：通过限制线程数量保护系统

### Q12: ThreadPoolExecutor的核心参数？
**答：** ThreadPoolExecutor的构造函数有7个核心参数：
1. **corePoolSize**：核心线程数，即使空闲也不会被回收
2. **maximumPoolSize**：最大线程数，线程池中允许的最大线程数
3. **keepAliveTime**：空闲线程存活时间
4. **unit**：keepAliveTime的时间单位
5. **workQueue**：任务队列，用于保存等待执行的任务
6. **threadFactory**：线程工厂，用于创建新线程
7. **handler**：拒绝策略，当线程池和队列都满时的处理策略

### Q13: 线程池的拒绝策略有哪些？
**答：** Java提供了4种内置的拒绝策略：
1. **AbortPolicy**：直接抛出RejectedExecutionException异常（默认策略）
2. **CallerRunsPolicy**：由调用线程处理该任务
3. **DiscardPolicy**：丢弃不能执行的任务，不抛出异常
4. **DiscardOldestPolicy**：丢弃队列最前面的任务，然后重新尝试执行

## 6. 并发工具类

### Q14: CountDownLatch和CyclicBarrier的区别？
**答：**
| 特性 | CountDownLatch | CyclicBarrier |
|------|----------------|---------------|
| 作用 | 一个或多个线程等待其他线程完成操作 | 一组线程互相等待到达屏障点 |
| 计数器 | 递减计数，不可重用 | 递增计数，可重用 |
| 调用方式 | 调用countDown()减少计数 | 调用await()增加计数 |
| 应用场景 | 主线程等待多个子线程完成 | 多个线程相互等待 |

### Q15: Semaphore的使用场景？
**答：** Semaphore（信号量）用于控制同时访问特定资源的线程数量，常用于：
1. **流量控制**：限制数据库连接数
2. **资源访问控制**：限制同时访问某个服务的线程数
3. **限流**：保护系统免受突发流量冲击

Semaphore通过acquire()获取许可，release()释放许可来实现资源控制。

## 7. 并发集合

### Q16: ConcurrentHashMap如何保证线程安全？
**答：** ConcurrentHashMap保证线程安全的方式随着JDK版本演进而变化：
1. **JDK 1.7**：采用分段锁（Segment）机制，将数据分成多个段，每段独立加锁
2. **JDK 1.8**：取消分段锁，采用CAS+synchronized实现：
   - 使用CAS操作处理无冲突情况
   - 冲突时使用synchronized锁定链表或红黑树头节点
   - 引入红黑树优化大量冲突的情况

### Q17: CopyOnWriteArrayList的实现原理？
**答：** CopyOnWriteArrayList采用写时复制策略：
1. 读操作不加锁，直接读取
2. 写操作时加锁，并复制整个数组
3. 在新数组上修改，然后将原数组引用指向新数组
4. 适用于读多写少的场景

优点：读操作完全无锁，性能高
缺点：写操作成本高，内存占用大

## 8. 原子类

### Q18: CAS（Compare-And-Swap）原理？
**答：** CAS是一种无锁的原子操作，包含三个操作数：
1. **V**：内存位置
2. **A**：预期值
3. **B**：新值

执行过程：当且仅当V的值等于A时，才用B更新V的值，否则不执行任何操作。

优点：避免了传统锁的线程阻塞和唤醒开销
缺点：可能出现ABA问题、循环时间长开销大、只能保证一个共享变量的原子操作

### Q19: AtomicIntegerFieldUpdater的作用？
**答：** AtomicIntegerFieldUpdater是对普通字段进行原子操作的工具类：
1. 可以对指定类的volatile int字段进行原子更新
2. 不创建额外对象，节省内存
3. 使用反射机制实现对字段的原子操作

适用场景：需要对已有类的字段进行原子操作，而不希望修改类的定义。