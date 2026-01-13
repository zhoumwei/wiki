# Java 高级面

## 1. JVM相关

### Q1: JVM内存模型是什么？
**答：** JVM内存模型主要分为以下几个区域：
1. **方法区（Method Area）**：存储类信息、常量、静态变量等
2. **堆（Heap）**：存放对象实例，是垃圾收集器管理的主要区域
3. **虚拟机栈（VM Stack）**：描述Java方法执行的内存模型，每个方法执行时创建栈帧
4. **本地方法栈（Native Method Stack）**：为虚拟机使用到的Native方法服务
5. **程序计数器（Program Counter Register）**：记录当前线程执行的字节码指令地址

### Q2: 什么是类加载机制？类加载过程是怎样的？
**答：** 类加载机制是指虚拟机把描述类的数据从Class文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的Java类型。

类加载过程包括以下五个阶段：
1. **加载（Loading）**：通过类的全限定名获取定义此类的二进制字节流，将字节流所代表的静态存储结构转化为方法区的运行时数据结构，在内存中生成代表这个类的java.lang.Class对象
2. **验证（Verification）**：确保Class文件的字节流中包含的信息符合当前虚拟机的要求
3. **准备（Preparation）**：为类变量分配内存并设置类变量初始值
4. **解析（Resolution）**：将常量池内的符号引用替换为直接引用
5. **初始化（Initialization）**：执行类构造器&lt;clinit&gt;()方法的过程

### Q3: 什么是双亲委派模型？
**答：** 双亲委派模型是类加载器之间的层次关系，工作过程是：
如果一个类加载器收到了类加载请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成，每一层的类加载器都是如此，因此所有的加载请求最终都应该传送到顶层的启动类加载器中，只有当父加载器反馈自己无法完成这个加载请求时，子加载器才会尝试自己去加载。

优点：
- 避免类的重复加载
- 保证核心类库的安全性



## 2. Java并发编程

### Q4: synchronized关键字的底层原理是什么？
**答：** synchronized关键字底层是通过进入和退出Monitor对象来实现的，Monitor对象是依赖于底层操作系统的Mutex Lock（互斥锁）来实现的，每次进入或退出都需要操作系统调用，导致成本较高。

在Java 6之后进行了优化，增加了偏向锁、轻量级锁、重量级锁三种状态：
- **偏向锁**：减少同一线程获取锁的代价
- **轻量级锁**：减少多线程竞争下的同步开销
- **重量级锁**：即传统的Monitor实现

### Q5: volatile关键字的作用？
**答：** volatile关键字有两个作用：
1. **保证可见性**：当一个线程修改了volatile变量的值，新值对其他线程来说是立即可见的
2. **禁止指令重排序**：volatile变量的赋值操作不会被编译器优化重排序

注意：volatile不能保证原子性，只适用于简单的赋值操作或单一变量的读取。

### Q6: CAS（Compare and Swap）原理？
**答：** CAS是一种无锁算法，在硬件层面实现原子操作。包含三个操作数：
- 内存值V
- 旧的预期值A
- 要修改的新值B

当且仅当预期值A和内存值V相同时，才将内存值V修改为B，否则什么都不做。整个比较并交换的操作是一个原子操作。

优点：避免了传统锁机制的线程阻塞和唤醒时间消耗
缺点：可能导致ABA问题、循环时间长开销大、只能保证一个共享变量的原子操作

## 3. Java集合框架深入

### Q7: ConcurrentHashMap的实现原理？
**答：** ConcurrentHashMap在不同版本中的实现不同：

**JDK 1.7及以前：**
- 采用分段锁（Segment）技术，将数据分成一段一段的存储
- 每一段都有独立的锁，提高了并发度
- Segment继承ReentrantLock，充当锁的角色

**JDK 1.8及以后：**
- 取消了Segment分段锁，采用CAS+synchronized保证并发安全性
- 底层结构与HashMap类似，数组+链表+红黑树
- synchronized只锁定当前链表或红黑树的首节点，提高并发度

### Q8: CopyOnWriteArrayList的实现原理？
**答：** CopyOnWriteArrayList是ArrayList的线程安全版本，采用了写时复制的思想：

**读操作：**
- 不加锁，直接读取

**写操作：**
- 加锁
- 创建一个新的数组，将原数组内容复制到新数组
- 在新数组上进行写操作
- 将原数组引用指向新数组

适用场景：读多写少的并发场景

## 4. JVM调优和GC

### Q9: 常见的垃圾回收器有哪些？
**答：** 常见的垃圾回收器包括：

**新生代收集器：**
- Serial收集器：单线程收集器
- ParNew收集器：Serial收集器的多线程版本
- Parallel Scavenge收集器：关注吞吐量的收集器

**老年代收集器：**
- Serial Old收集器：Serial收集器的老年代版本
- Parallel Old收集器：Parallel Scavenge收集器的老年代版本
- CMS收集器：以最短回收停顿时间为目标的收集器

**G1收集器：**
- 面向服务端应用的垃圾收集器
- 将整个Java堆划分为多个大小相等的独立区域（Region）

### Q10: 什么是内存泄漏？如何排查内存泄漏？
**答：** 内存泄漏是指程序中已动态分配的堆内存由于某种原因程序未释放或无法释放，造成内存的浪费。

常见内存泄漏场景：
- 静态集合类引起的内存泄漏
- 监听器和回调
- 内部类持有外部类引用
- 数据库连接、网络连接未关闭

排查方法：
- 使用jmap、jstat等JDK自带工具
- 使用MAT（Memory Analyzer Tool）分析堆转储文件
- 使用VisualVM监控内存使用情况

## 5. 设计模式

### Q11: 单例模式的几种实现方式？
**答：** 单例模式常见的实现方式有：

1. **饿汉式（线程安全）**
```java
public class Singleton {
    private static Singleton instance = new Singleton();
    private Singleton() {}
    public static Singleton getInstance() {
        return instance;
    }
}
```

2. **懒汉式（线程不安全）**
```java
public class Singleton {
    private static Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

3. **双重检查锁定（推荐）**
```java
public class Singleton {
    private volatile static Singleton instance;
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

4. **静态内部类（推荐）**
```java
public class Singleton {
    private Singleton() {}
    private static class SingletonHolder {
        private static final Singleton INSTANCE = new Singleton();
    }
    public static Singleton getInstance() {
        return SingletonHolder.INSTANCE;
    }
}
```

### Q12: 工厂模式的应用场景？
**答：** 工厂模式主要解决以下问题：
- 对象创建逻辑复杂
- 需要根据不同的条件创建不同的对象
- 解耦对象的创建和使用

应用场景：
- JDBC连接工厂
- 日志记录器工厂
- XML解析器工厂

## 6. Java 8新特性

### Q13: Lambda表达式的原理？
**答：** Lambda表达式本质上是一个匿名函数，可以传递代码。其原理基于以下几点：
1. **函数式接口**：Lambda表达式只能应用于函数式接口（只有一个抽象方法的接口）
2. **invokedynamic指令**：JVM新增的指令，用于支持动态类型语言
3. **方法句柄**：通过方法句柄实现Lambda表达式的调用

优点：
- 代码更加简洁
- 函数式编程的支持
- 提高开发效率

### Q14: Stream流的并行处理原理？
**答：** Stream并行处理基于Fork/Join框架实现：
1. 将数据源分割成多个部分
2. 使用ForkJoinPool线程池并行处理各部分
3. 合并各部分的处理结果

并行流适合的场景：
- 数据量较大
- 计算密集型操作
- 无状态操作

注意事项：
- 并行不一定比串行快
- 需要考虑线程安全问题
- 有状态的操作（如sorted）在并行流中开销较大

## 7. 网络编程

### Q15: NIO的核心组件有哪些？
**答：** NIO的核心组件包括：
1. **Channel（通道）**：表示到实体（如硬件设备、文件、网络套接字）的开放连接
2. **Buffer（缓冲区）**：包含数据的容器，提供了对数据的结构化访问以及维护读写位置等信息
3. **Selector（选择器）**：用于监听多个通道的事件（如连接打开、数据到达），实现单个线程管理多个Channel

### Q16: Netty为什么高性能？
**答：** Netty高性能的原因主要包括：
1. **NIO异步非阻塞**：基于NIO，避免了传统BIO的阻塞问题
2. **零拷贝技术**：通过CompositeByteBuf等减少数据拷贝次数
3. **内存池化**：使用池化的ByteBuf减少内存分配和回收开销
4. **高效的Reactor线程模型**：主从Reactor多线程模型
5. **无锁化串行设计**：在Pipeline中ChannelHandler的处理是串行的，避免了多线程竞争
6. **高性能序列化**：支持多种序列化方式，如Protobuf、Kryo等