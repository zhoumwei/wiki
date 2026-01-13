# Spring Cloud

## 1. Spring Cloud基础

### Q1: 什么是Spring Cloud？它解决了什么问题？
**答：** Spring Cloud是一系列框架的有序集合，基于Spring Boot实现，用于快速构建分布式系统的常见模式。

解决的问题：
- **配置管理**：统一管理微服务的配置
- **服务发现**：自动发现和注册服务实例
- **断路器**：防止服务雪崩
- **智能路由**：负载均衡和服务路由
- **微代理**：API网关
- **控制总线**：分布式系统中的消息传递
- **一次性令牌**：安全认证
- **全局锁**：分布式锁
- **领导选举**：集群中的主节点选举
- **分布式会话**：跨服务的会话管理
- **集群状态**：监控集群健康状态

### Q2: Spring Cloud的核心组件有哪些？
**答：** Spring Cloud的核心组件包括：

1. **服务注册与发现**：
   - Eureka：Netflix开源的服务发现组件
   - Consul：HashiCorp开源的服务发现和配置工具
   - Zookeeper：Apache开源的分布式协调服务

2. **负载均衡**：
   - Ribbon：客户端负载均衡器
   - Spring Cloud LoadBalancer：Spring官方的负载均衡器

3. **服务调用**：
   - Feign：声明式的Web服务客户端
   - OpenFeign：Feign的升级版

4. **熔断器**：
   - Hystrix：断路器模式实现
   - Resilience4j：轻量级容错库

5. **API网关**：
   - Zuul：Netflix开源的API网关
   - Spring Cloud Gateway：Spring官方的API网关

6. **配置中心**：
   - Spring Cloud Config：分布式配置管理

7. **消息总线**：
   - Spring Cloud Bus：消息总线

8. **链路追踪**：
   - Sleuth：分布式链路追踪
   - Zipkin：分布式追踪系统

### Q3: 微服务架构的优缺点？
**答：** 

**优点：**
- 技术多样性：不同服务可以使用不同技术栈
- 独立部署：每个服务可以独立部署和扩展
- 故障隔离：单个服务故障不会影响整个系统
- 团队自治：不同团队可以独立开发和维护各自的服务
- 可扩展性强：可以根据业务需求独立扩展特定服务

**缺点：**
- 分布式复杂性：网络延迟、数据一致性等问题
- 运维复杂：需要管理多个服务实例
- 测试复杂：需要考虑服务间的依赖关系
- 网络通信开销：服务间调用增加网络延迟
- 数据一致性：分布式事务处理复杂

## 2. 服务注册与发现

### Q4: Eureka的工作原理？
**答：** Eureka是Netflix开源的服务发现组件，包含两个核心组件：

1. **Eureka Server（服务注册中心）**：
   - 提供服务注册和发现功能
   - 维护服务实例的注册信息

2. **Eureka Client（服务提供者/消费者）**：
   - 向Eureka Server注册自身服务
   - 定期发送心跳维持连接
   - 获取其他服务的注册信息

**工作流程：**
1. 服务启动时向Eureka Server注册服务信息
2. Eureka Server保存服务注册信息
3. 服务消费者定期从Eureka Server获取服务注册信息
4. 服务提供者定期向Eureka Server发送心跳
5. Eureka Server根据心跳检测服务可用性
6. 服务下线时主动注销或超时后自动剔除

### Q5: Eureka和Consul的区别？
**答：**

| 特性 | Eureka | Consul |
|------|--------|--------|
| 一致性算法 | AP（可用性优先） | CP（一致性优先） |
| 服务健康检查 | 心跳检测 | 多种健康检查方式 |
| KV存储 | 不支持 | 支持 |
| 多数据中心 | 不支持 | 支持 |
| CAP理论 | AP | CP |
| Web UI | 支持 | 支持 |
| 安全性 | 相对简单 | ACL和TLS支持 |

### Q6: 服务下线的处理机制？
**答：** 服务下线的处理机制包括：

1. **主动下线**：
   - 服务正常关闭时调用unregister接口
   - Eureka Server立即移除服务实例

2. **被动下线**：
   - 服务异常终止，无法发送取消注册请求
   - Eureka Server通过心跳检测发现服务不可用
   - 超过一定时间（默认90秒）未收到心跳则移除实例

3. **自我保护机制**：
   - 当短时间内大量服务实例失去联系时触发
   - 防止因网络故障误删正常服务实例
   - 保证注册中心的高可用性

## 3. 负载均衡

### Q7: Ribbon和Spring Cloud LoadBalancer的区别？
**答：**

**Ribbon：**
- Netflix开源的客户端负载均衡器
- 已进入维护模式，不再积极开发
- 基于HTTP和TCP客户端
- 集成在Netflix OSS栈中

**Spring Cloud LoadBalancer：**
- Spring官方推出的负载均衡器
- 用于替代Ribbon
- 响应式编程支持
- 更好的与Spring生态系统集成

### Q8: 负载均衡策略有哪些？
**答：** 常见的负载均衡策略包括：

1. **轮询（Round Robin）**：按顺序依次分配请求
2. **随机（Random）**：随机选择服务实例
3. **权重（Weighted）**：根据权重分配请求
4. **最少连接（Least Connections）**：选择连接数最少的实例
5. **响应时间（Response Time）**：选择响应时间最短的实例
6. **可用性（Availability）**：根据实例的可用性分配请求

## 4. 服务调用

### Q9: OpenFeign的工作原理？
**答：** OpenFeign是声明式的Web服务客户端，使编写Web服务客户端变得更加简单。

**工作原理：**
1. 启动时扫描@FeignClient注解的接口
2. 为每个接口创建动态代理对象
3. 解析接口上的注解（@RequestMapping等）
4. 将方法调用转换为HTTP请求
5. 通过负载均衡器选择服务实例
6. 发送HTTP请求并接收响应
7. 将响应结果反序列化为Java对象

**关键组件：**
- Contract：契约，解析注解
- Encoder：编码器，将请求参数编码为HTTP请求体
- Decoder：解码器，将HTTP响应体解码为Java对象
- Client：客户端，发送HTTP请求

### Q10: Feign如何实现负载均衡？
**答：** Feign通过集成Ribbon或Spring Cloud LoadBalancer实现负载均衡：

1. **服务发现**：通过Eureka等服务注册中心获取服务实例列表
2. **负载均衡算法**：根据配置的负载均衡策略选择服务实例
3. **请求转发**：将请求发送到选定的服务实例

配置示例：
```java
@FeignClient(name = "user-service", configuration = FeignConfig.class)
public interface UserServiceClient {
    @GetMapping("/users/{id}")
    User getUser(@PathVariable("id") Long id);
}
```

## 5. 熔断器

### Q11: Hystrix的熔断机制？
**答：** Hystrix的熔断机制包括三个状态：

1. **Closed（关闭状态）**：
   - 正常状态下，所有请求正常通过
   - 统计失败率和延迟等指标

2. **Open（打开状态）**：
   - 当失败率达到阈值时触发熔断
   - 所有请求直接失败，不调用实际服务
   - 持续一段时间后进入半开状态

3. **Half-Open（半开状态）**：
   - 允许少量请求通过
   - 如果请求成功则恢复到关闭状态
   - 如果请求失败则回到打开状态

### Q12: Resilience4j相比Hystrix的优势？
**答：** Resilience4j相比Hystrix的优势：

1. **轻量级**：体积小，依赖少
2. **响应式支持**：天然支持Reactive Streams
3. **函数式编程**：提供函数式编程接口
4. **模块化设计**：可以按需引入需要的模块
5. **更好的性能**：基于Vavr库，性能更好
6. **活跃的社区**：持续更新和维护

## 6. API网关

### Q13: Zuul和Spring Cloud Gateway的区别？
**答：**

| 特性 | Zuul 1.x | Zuul 2.x | Spring Cloud Gateway |
|------|----------|----------|---------------------|
| 性能 | 同步阻塞 | 异步非阻塞 | 异步非阻塞 |
| 编程模型 | Servlet | Netty + RxJava | WebFlux (Reactor) |
| 过滤器 | 请求级别 | 请求级别 | 交换级别 |
| 路由配置 | properties/yaml | properties/yaml | RouteLocator/DSL |

### Q14: Spring Cloud Gateway的核心概念？
**答：** Spring Cloud Gateway的核心概念包括：

1. **Route（路由）**：路由是构建网关的基本模块，由ID、目标URI、断言集合和过滤器集合组成
2. **Predicate（断言）**：匹配HTTP请求的条件，如路径、方法、头信息等
3. **Filter（过滤器）**：对请求和响应进行修改的组件

配置示例：
```yaml
spring:
  cloud:
    gateway:
      routes:
      - id: user-service
        uri: lb://user-service
        predicates:
        - Path=/api/users/**
        filters:
        - StripPrefix=2
```

## 7. 配置中心

### Q15: Spring Cloud Config的工作原理？
**答：** Spring Cloud Config为分布式系统提供外部化配置支持。

**架构组成：**
1. **Config Server**：配置服务器，提供配置文件的管理
2. **Config Client**：配置客户端，从配置服务器获取配置

**工作流程：**
1. Config Server启动时连接Git仓库或其他存储
2. Client启动时向Config Server请求配置
3. Config Server从存储中读取配置并返回给Client
4. Client将配置加载到应用环境中

**刷新机制：**
- 通过@RefreshScope注解实现配置刷新
- 使用Spring Cloud Bus实现批量刷新

### Q16: 配置的优先级顺序？
**答：** Spring Cloud Config配置的优先级顺序（从高到低）：

1. **bootstrap.properties/yml**：引导配置，最先加载
2. **远程配置中心**：从Config Server获取的配置
3. **本地配置文件**：application.properties/yml
4. **环境变量**
5. **命令行参数**

注意事项：
- bootstrap配置优先级最高，不能被覆盖
- 远程配置可以覆盖本地配置
- 配置刷新时，远程配置会重新加载

## 8. 链路追踪

### Q17: Spring Cloud Sleuth的作用？
**答：** Spring Cloud Sleuth为微服务架构提供分布式链路追踪解决方案。

**主要功能：**
1. **Trace ID和Span ID**：为每个请求分配唯一的Trace ID，为每个操作分配Span ID
2. **日志关联**：将同一请求的所有日志关联起来
3. **性能分析**：统计各服务的响应时间和调用次数
4. **问题定位**：快速定位分布式系统中的性能瓶颈

**集成Zipkin：**
- Sleuth负责生成追踪数据
- Zipkin负责收集、存储和展示追踪数据

### Q18: 分布式事务的解决方案？
**答：** 分布式事务的常见解决方案：

1. **两阶段提交（2PC）**：
   - 准备阶段：协调者询问参与者是否可以提交
   - 提交阶段：协调者根据参与者响应决定提交或回滚

2. **三阶段提交（3PC）**：
   - CanCommit阶段
   - PreCommit阶段
   - DoCommit阶段

3. **补偿事务（TCC）**：
   - Try：预留资源
   - Confirm：确认执行
   - Cancel：取消执行

4. **消息队列**：
   - 通过消息队列保证最终一致性

5. **Seata**：
   - 阿里巴巴开源的分布式事务解决方案
   - 支持AT、TCC、Saga等模式
