# JDK版本变化详解（JDK 1.7 - 最新版）

## JDK 1.7 (Java 7) - 2011年发布

### 主要特性
1. **Diamond Operator（钻石操作符）**
   ```java
   // Java 7之前
   Map<String, List<String>> map = new HashMap<String, List<String>>();
   
   // Java 7
   Map<String, List<String>> map = new HashMap<>();
   ```

2. **Try-with-resources语句**
   ```java
   // 自动关闭资源，无需手动close()
   try (FileInputStream fis = new FileInputStream("file.txt")) {
       // 使用资源
   } catch (IOException e) {
       // 处理异常
   }
   ```

3. **Switch语句支持String**
   ```java
   switch (str) {
       case "one":
           // 处理one
           break;
       case "two":
           // 处理two
           break;
       default:
           // 默认处理
   }
   ```

4. **Fork/Join框架**
   - 引入了java.util.concurrent包中的ForkJoinPool
   - 用于并行执行任务，特别适合分治算法

5. **NIO.2 (New I/O 2)**
   - 新增java.nio.file包
   - 提供更好的文件系统操作API
   - 支持符号链接、文件属性访问等

## JDK 1.8 (Java 8) - 2014年发布

### 主要特性
1. **Lambda表达式**
   ```java
   // Java 8之前
   Collections.sort(list, new Comparator<String>() {
       public int compare(String s1, String s2) {
           return s1.compareTo(s2);
       }
   });
   
   // Java 8
   Collections.sort(list, (s1, s2) -> s1.compareTo(s2));
   ```

2. **Stream API**
   ```java
   List<String> filtered = list.stream()
                               .filter(s -> s.startsWith("A"))
                               .collect(Collectors.toList());
   ```

3. **默认方法**
   ```java
   public interface MyInterface {
       void existingMethod();
       
       // 默认方法
       default void newMethod() {
           System.out.println("Default implementation");
       }
   }
   ```

4. **新的日期时间API**
   - java.time包（JSR-310）
   - LocalDate, LocalTime, LocalDateTime, ZonedDateTime等

5. **Optional类**
   - 用于避免NullPointerException
   - 提供更优雅的空值处理方式

6. **CompletableFuture**
   - 异步编程增强
   - 支持链式调用和组合操作

## JDK 9 - 2017年发布

### 主要特性
1. **模块系统（Project Jigsaw）**
   ```java
   module my.module {
       requires java.base;
       exports com.my.package;
   }
   ```

2. **JShell（交互式Java REPL）**
   - 提供命令行交互式编程环境

3. **集合工厂方法**
   ```java
   List<String> list = List.of("a", "b", "c");
   Map<String, Integer> map = Map.of("key1", 1, "key2", 2);
   ```

4. **改进的Stream API**
   - takeWhile(), dropWhile(), iterate()等新方法

5. **私有接口方法**
   ```java
   public interface MyInterface {
       void normalMethod();
       
       private void helperMethod() {
           // 私有辅助方法
       }
   }
   ```

## JDK 10 - 2018年发布

### 主要特性
1. **局部变量类型推断（var关键字）**
   ```java
   var list = new ArrayList<String>();  // 自动推断为ArrayList<String>
   var stream = list.stream();          // 自动推断为Stream<String>
   ```

2. **并行全垃圾回收器G1**
   - 改进G1垃圾回收器，使其能并行执行Full GC

3. **应用类数据共享（AppCDS）**
   - 扩展了JDK 5中引入的类数据共享功能

## JDK 11 - 2018年发布（LTS版本）

### 主要特性
1. **HTTP Client（标准化）**
   ```java
   HttpClient client = HttpClient.newHttpClient();
   HttpRequest request = HttpRequest.newBuilder()
                                    .uri(URI.create("https://example.com"))
                                    .build();
   HttpResponse<String> response = client.send(request, 
                                              HttpResponse.BodyHandlers.ofString());
   ```

2. **字符串增强**
   ```java
   " ".isBlank();        // 检查是否为空白
   "Java".repeat(3);     // "JavaJavaJava"
   "A\nB\nC".lines();    // 返回Stream<String>
   ```

3. **Optional增强**
   ```java
   Optional.of("hello").isEmpty();  // 检查是否为空
   ```

4. **移除Java EE和CORBA模块**
   - 从JDK中移除了Java EE和CORBA相关的模块

## JDK 12 - 2019年发布

### 主要特性
1. **Switch表达式（预览特性）**
   ```java
   switch (day) {
       case MONDAY, FRIDAY, SUNDAY -> 6;
       case TUESDAY                -> 7;
       case THURSDAY, SATURDAY     -> 8;
       case WEDNESDAY              -> 9;
   }
   ```

2. **Shenandoah垃圾回收器（实验性）**
   - 低延迟垃圾回收器

## JDK 13 - 2019年发布

### 主要特性
1. **Switch表达式（预览特性增强）**
   ```java
   // 支持yield语句
   int result = switch (day) {
       case MONDAY, FRIDAY, SUNDAY -> 6;
       case TUESDAY                -> 7;
       default                     -> {
           int fallback = day.toString().length();
           yield fallback;
       }
   };
   ```

2. **文本块（预览特性）**
   ```java
   String html = """
                 <html>
                     <body>
                         <p>Hello, world</p>
                     </body>
                 </html>
                 """;
   ```

## JDK 14 - 2020年发布

### 主要特性
1. **Records（预览特性）**
   ```java
   // 简化数据载体类的定义
   record Point(int x, int y) { }
   
   // 自动生成构造函数、getter、toString、equals和hashCode
   Point p = new Point(1, 2);
   System.out.println(p.x());  // 1
   ```

2. **Pattern Matching for instanceof（预览特性）**
   ```java
   // Java 14之前
   if (obj instanceof String) {
       String str = (String) obj;
       // 使用str
   }
   
   // Java 14
   if (obj instanceof String str) {
       // 直接使用str，无需强制转换
       System.out.println(str.length());
   }
   ```

3. **有用的NullPointerExceptions**
   - 提供更精确的空指针异常信息

## JDK 15 - 2020年发布

### 主要特性
1. **Sealed Classes（密封类，预览特性）**
   ```java
   public sealed class Shape
       permits Circle, Rectangle, Square { }
   
   public final class Circle extends Shape { }
   public final class Rectangle extends Shape { }
   public final class Square extends Shape { }
   ```

2. **Hidden Classes**
   - 支持在运行时动态创建不可发现的类

## JDK 16 - 2021年发布

### 主要特性
1. **Records（正式特性）**
   - Records从预览特性转为正式特性

2. **Pattern Matching for instanceof（正式特性）**
   - instanceof模式匹配转为正式特性

3. **Unix-Domain Socket Channels**
   - 支持Unix域套接字通道

## JDK 17 - 2021年发布（LTS版本）

### 主要特性
1. **Sealed Classes（正式特性）**
   - 密封类从预览特性转为正式特性

2. **恢复严格的浮点语义**
   - 恢复Java 17之前的严格浮点运算语义

3. **增强型伪随机数生成器**
   - 新增RandomGenerator接口和实现

4. **Deprecate Applet API for Removal**
   - 标记Applet API为待删除状态

## JDK 18 - 2022年发布

### 主要特性
1. **UTF-8默认字符集**
   - 将UTF-8设置为标准Java API的默认字符集

2. **简单Web服务器**
   - 提供一个简单的命令行Web服务器用于开发和测试

3. **代码片段（Snippet Files）**
   - javadoc工具新增-snippet-files选项

## JDK 19 - 2022年发布

### 主要特性
1. **Virtual Threads（虚拟线程，预览特性）**
   ```java
   // 创建虚拟线程
   Thread vt = Thread.ofVirtual()
                     .start(() -> System.out.println("Hello Virtual Thread"));
   ```

2. **Structured Concurrency（结构化并发，孵化特性）**
   ```java
   // 简化多线程错误处理和取消操作
   try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
       Future<String> future1 = scope.fork(task1);
       Future<String> future2 = scope.fork(task2);
       
       scope.join();           // 等待所有子任务完成
       scope.throwIfFailed();  // 如果有任何子任务失败则抛出异常
       
       String result1 = future1.get();
       String result2 = future2.get();
   }
   ```

## JDK 20 - 2023年发布

### 主要特性
1. **Scoped Values（作用域值，孵化特性）**
   - 提供在线程内和线程间共享不可变数据的新方式

2. **Virtual Threads（虚拟线程，第二次预览）**
   - 虚拟线程的进一步改进和完善

3. **Record Patterns（记录模式，第二次预览）**
   ```java
   // 增强模式匹配以解构record值
   record Point(int x, int y) {}
   
   void printSum(Object obj) {
       if (obj instanceof Point(int x, int y)) {
           System.out.println(x + y);
       }
   }
   ```

## JDK 21 - 2023年发布（LTS版本）

### 主要特性
1. **Virtual Threads（虚拟线程，正式特性）**
   - 虚拟线程转为正式特性，极大地简化了高吞吐量并发应用的开发

2. **Sequenced Collections（序列集合）**
   ```java
   // 新的 SequencedCollection 接口
   SequencedCollection<String> collection = new ArrayList<>();
   collection.addFirst("first");
   collection.addLast("last");
   String first = collection.getFirst();
   String last = collection.getLast();
   ```

3. **Record Patterns（记录模式，正式特性）**
   - 记录模式转为正式特性

4. **Pattern Matching for switch（switch的模式匹配，正式特性）**
   ```java
   String formatted = switch (obj) {
       case Integer i -> String.format("int %d", i);
       case Long l    -> String.format("long %d", l);
       case Double d  -> String.format("double %f", d);
       case String s  -> String.format("String %s", s);
       default        -> obj.toString();
   };
   ```

5. **String Templates（字符串模板，预览特性）**
   ```java
   // 字符串插值的现代方式
   String name = "John";
   int age = 30;
   String info = STR."My name is \{name} and I am \{age} years old";
   ```

## JDK 22 - 2024年发布

### 主要特性
1. **Region Containers for the Z Garbage Collector（ZGC的区域容器）**
   - 改进了ZGC的内部实现

2. **Unnamed Variables and Patterns（未命名变量和模式，预览特性）**
   ```java
   // 使用下划线(_)表示未使用的变量
   try (var _ = ScopedValue.where(sv, 42).bind()) {
       // 使用绑定的值
   }
   ```

3. **Class-File API（类文件API，孵化特性）**
   - 提供解析、生成和转换Java类文件的API

## JDK 23 - 2024年发布

### 主要特性（目前计划）
1. **Vector API（向量API，第七次孵化）**
   - 提供表达向量计算的API

2. **Module Import Declarations（模块导入声明，预览特性）**
   - 简化模块系统的使用

3. **Primitive Types in Patterns（模式中的基本类型，预览特性）**
   - 扩展模式匹配以支持基本类型

## JDK 24 - 2025年3月发布

### 主要特性
1. **Primitive Types in Patterns（模式中的基本类型，第二次预览）**
   - 扩展模式匹配以支持基本类型，包括在instanceof和switch语句中使用

2. **Flexible Constructor Bodies（灵活的构造函数体，第三次预览）**
   - 允许在显式构造函数调用（super()或this()）之前执行语句
   - 这些语句不能引用正在构造的对象，但可以初始化其字段

3. **Module Import Declarations（模块导入声明，第二次预览）**
   - 简化模块系统的使用，可以简洁地导入模块导出的所有包

4. **Compact Source Files and Instance Main Methods（紧凑源文件和实例主方法，第四次预览）**
   - 使初学者能够编写他们的第一个程序而无需理解为大型程序设计的语言特性

5. **Stream Gatherers（流收集器）**
   - 增强Stream API以支持自定义中间操作

6. **Class-File API（类文件API）**
   - 提供解析、生成和转换Java类文件的标准API

7. **Compact Object Headers（紧凑对象头，实验性）**
   - 将HotSpot JVM中的对象头大小从96-128位减少到64位

8. **Ahead-of-Time Class Loading & Linking（预先类加载和链接）**
   - 通过缓存类的加载和链接形式来改善启动时间

9. **Synchronize Virtual Threads without Pinning（同步虚拟线程而不固定）**
   - 改善使用同步方法和语句的Java代码的可伸缩性

10. **Key Derivation Function API（密钥派生函数API，预览）**
    - 为从密钥和其他数据派生额外密钥的加密算法提供API

11. **Quantum-Resistant Cryptography（抗量子密码学）**
    - 提供抗量子的模块格基密钥封装机制(ML-KEM)和数字签名算法(ML-DSA)

## JDK 25 - 2025年9月发布

### 主要特性
1. **Primitive Types in Patterns（模式中的基本类型，第三次预览）**
   - 进一步完善模式匹配对基本类型的支持

2. **Module Import Declarations（模块导入声明，正式特性）**
   - 正式引入模块导入声明特性

3. **Compact Source Files and Instance Main Methods（紧凑源文件和实例主方法，正式特性）**
   - 简化类声明和main方法签名，使小型应用程序更容易创建

4. **Flexible Constructor Bodies（灵活的构造函数体，正式特性）**
   - 允许在构造函数体中添加逻辑，增强对象初始化的灵活性

5. **Scoped Values（作用域值，正式特性）**
   - 引入不可变值，在特定应用程序范围内可用，用于上下文信息

6. **Stable Values（稳定值，预览特性）**
   - 引入持有不可变数据的对象，JVM将其视为常量，启用与声明final字段相同的性能优化

7. **Key Derivation Function API（密钥派生函数API，正式特性）**
   - 为密钥派生函数提供最终API

8. **Vector API（向量API，第十次孵化）**
   - 表达向量计算的API，可在支持的CPU上可靠地编译为最优向量指令

9. **PEM Encodings of Cryptographic Objects（加密对象的PEM编码，预览特性）**
   - 为编码表示加密密钥、证书和证书撤销列表的对象提供API

10. **Structured Concurrency（结构化并发，第五次预览）**
    - 简化并发编程，将不同线程中运行的相关任务组视为单一工作单元

11. **Compact Object Headers（紧凑对象头，产品特性）**
    - 将对象头大小从12字节减少到8字节，提高内存效率

12. **Ahead-of-Time Command-Line Ergonomics（预先命令行人机工程学）**
    - 简化创建预先缓存所需的命令，加速Java应用程序启动

13. **Ahead-of-Time Method Profiling（预先方法分析）**
    - 通过使方法执行配置文件在HotSpot JVM启动时立即可用来改善预热时间

14. **JFR CPU-Time Profiling（JFR CPU时间分析，实验性）**
    - 增强JDK Flight Recorder以捕获更准确的CPU时间分析信息

15. **JFR Cooperative Sampling（JFR协作采样）**
    - 通过仅在安全点遍历调用栈来改善JDK Flight Recorder的稳定性

16. **JFR Method Timing & Tracing（JFR方法计时和跟踪）**
    - 通过字节码检测扩展开销记录器的功能

## 总结

Java的发展历程体现了持续创新和改进的理念：
1. **语法简化**：从Lambda表达式到var关键字，不断提升开发效率
2. **并发增强**：从Fork/Join到虚拟线程，不断优化并发处理能力
3. **内存管理**：垃圾回收器的持续改进，提供更好的性能和更低的延迟
4. **现代化特性**：模块系统、记录类、密封类等，使Java更加现代化

随着每个版本的发布，Java都在努力保持向后兼容性的同时，引入新的特性和改进，以满足现代软件开发的需求。