# ToC业务高可用解决方案

## 1. 高可用架构基础

### Q1: 什么是高可用性？ToC业务为什么需要高可用？
**答：** 高可用性（High Availability, HA）是指系统在面对各种故障时仍能持续提供服务的能力，通常用可用性百分比来衡量。

ToC业务需要高可用的原因：
- **用户体验**：用户对服务中断容忍度极低，直接影响用户满意度和留存率
- **商业损失**：服务中断直接导致收入损失，如电商交易、广告展示等
- **品牌声誉**：频繁故障损害品牌形象和用户信任
- **竞争优势**：高可用成为差异化竞争的重要因素

可用性等级标准：
- 99%：每年宕机约3.65天
- 99.9%：每年宕机约8.76小时
- 99.99%：每年宕机约52.6分钟
- 99.999%：每年宕机约5.26分钟

### Q2: 高可用架构设计原则？
**答：** 高可用架构设计的核心原则：

1. **冗余设计**：
```yaml
# 多可用区部署示例
regions:
  - region: cn-north-1
    zones:
      - zone: cn-north-1a
        services:
          - web_server
          - database_master
      - zone: cn-north-1b
        services:
          - web_server
          - database_slave
```

2. **故障隔离**：
```python
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_count = 0
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.last_failure_time = None
        self.state = "CLOSED"  # CLOSED, OPEN, HALF_OPEN
    
    def call(self, func, *args, **kwargs):
        if self.state == "OPEN":
            if self._should_attempt_reset():
                return self._attempt_half_open(func, args, kwargs)
            else:
                raise ServiceUnavailable("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self._on_success()
            return result
        except Exception as e:
            self._on_failure()
            raise e
    
    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = "OPEN"
    
    def _on_success(self):
        self.failure_count = 0
        if self.state == "HALF_OPEN":
            self.state = "CLOSED"
```

3. **优雅降级**：
```python
class DegradationManager:
    def __init__(self):
        self.strategies = {
            'normal': self.normal_mode,
            'degraded': self.degraded_mode,
            'emergency': self.emergency_mode
        }
    
    def handle_request(self, request):
        current_mode = self.get_current_mode()
        strategy = self.strategies.get(current_mode, self.normal_mode)
        return strategy(request)
    
    def degraded_mode(self, request):
        # 简化处理逻辑
        # 禁用非核心功能
        # 返回缓存数据
        # 降低服务质量但仍保持可用
        return self.simplified_response(request)
```

### Q3: 高可用架构的核心组件？
**答：** 高可用架构的核心组件包括：

1. **负载均衡器**：
```nginx
upstream backend_servers {
    least_conn;  # 最少连接数算法
    server 10.0.0.1:8080 max_fails=3 fail_timeout=30s;
    server 10.0.0.2:8080 max_fails=3 fail_timeout=30s;
    server 10.0.0.3:8080 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend_servers;
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }
}
```

2. **服务注册与发现**：
```python
class ServiceRegistry:
    def __init__(self):
        self.services = {}
        self.health_check_interval = 30
    
    def register_service(self, service_name, host, port):
        service_id = f"{service_name}_{host}_{port}"
        self.services[service_id] = {
            'name': service_name,
            'host': host,
            'port': port,
            'status': 'UP',
            'last_heartbeat': time.time()
        }
        return service_id
    
    def heartbeat(self, service_id):
        if service_id in self.services:
            self.services[service_id]['last_heartbeat'] = time.time()
    
    def get_healthy_services(self, service_name):
        current_time = time.time()
        healthy_services = []
        
        for service in self.services.values():
            if (service['name'] == service_name and 
                service['status'] == 'UP' and
                current_time - service['last_heartbeat'] < self.health_check_interval * 2):
                healthy_services.append(service)
        
        return healthy_services
```

## 2. 数据库高可用方案

### Q4: 数据库主从复制与读写分离？
**答：** 数据库高可用的核心方案之一是主从复制和读写分离：

**MySQL主从复制配置**：
```sql
-- 主库配置 (my.cnf)
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog-format = ROW
sync_binlog = 1
innodb_flush_log_at_trx_commit = 1

-- 从库配置 (my.cnf)
[mysqld]
server-id = 2
relay-log = relay-bin
read_only = 1
```

**应用层读写分离**：
```python
class DatabaseRouter:
    def __init__(self):
        self.master_db = self._connect_master()
        self.slave_dbs = self._connect_slaves()
        self.current_slave_index = 0
    
    def get_write_connection(self):
        return self.master_db
    
    def get_read_connection(self):
        # 轮询选择从库
        slave = self.slave_dbs[self.current_slave_index]
        self.current_slave_index = (self.current_slave_index + 1) % len(self.slave_dbs)
        return slave
    
    def execute_query(self, sql, params=None, write=False):
        if write:
            conn = self.get_write_connection()
            # 写操作同时同步到从库
            self._sync_to_slaves(sql, params)
        else:
            conn = self.get_read_connection()
        
        cursor = conn.cursor()
        cursor.execute(sql, params)
        return cursor.fetchall()
```

### Q5: 数据库集群方案？
**答：** 数据库集群提供更高的可用性和扩展性：

**MySQL Group Replication**：
```sql
-- 启用Group Replication
SET GLOBAL group_replication_bootstrap_group=ON;
START GROUP_REPLICATION;
SET GLOBAL group_replication_bootstrap_group=OFF;

-- 查看集群状态
SELECT * FROM performance_schema.replication_group_members;

-- 配置多主模式
SET GLOBAL group_replication_single_primary_mode = OFF;
SET GLOBAL group_replication_enforce_update_everywhere_checks = ON;
```

**应用层数据库集群访问**：
```python
class ClusterDatabaseManager:
    def __init__(self):
        self.cluster_nodes = [
            {'host': 'db1.example.com', 'port': 3306, 'role': 'primary'},
            {'host': 'db2.example.com', 'port': 3306, 'role': 'secondary'},
            {'host': 'db3.example.com', 'port': 3306, 'role': 'secondary'}
        ]
        self.connections = {}
        self._initialize_connections()
    
    def _initialize_connections(self):
        for node in self.cluster_nodes:
            try:
                conn = self._create_connection(node)
                self.connections[node['host']] = {
                    'connection': conn,
                    'status': 'healthy',
                    'last_check': time.time()
                }
            except Exception as e:
                self.connections[node['host']] = {
                    'connection': None,
                    'status': 'unhealthy',
                    'last_check': time.time()
                }
    
    def get_connection(self, operation_type='read'):
        healthy_nodes = self._get_healthy_nodes()
        
        if operation_type == 'write':
            # 写操作选择主节点
            primary_node = self._get_primary_node(healthy_nodes)
            if primary_node:
                return self.connections[primary_node]['connection']
        else:
            # 读操作可以选择任意健康节点
            if healthy_nodes:
                # 简单轮询负载均衡
                selected_node = healthy_nodes[hash(str(time.time())) % len(healthy_nodes)]
                return self.connections[selected_node]['connection']
        
        raise Exception("No healthy database node available")
```

### Q6: 数据库分库分表策略？
**答：** 面对大数据量和高并发，分库分表是必要手段：

**水平分片策略**：
```python
class ShardingStrategy:
    def __init__(self, shard_count=16):
        self.shard_count = shard_count
    
    def get_shard_key(self, user_id):
        """基于用户ID的分片键计算"""
        return user_id % self.shard_count
    
    def get_database_name(self, shard_key):
        """获取数据库名称"""
        return f"user_db_{shard_key // 4}"  # 每4个分片一个数据库
    
    def get_table_name(self, shard_key):
        """获取表名称"""
        return f"user_info_{shard_key % 4}"  # 每个数据库4张表

class ShardedDatabaseManager:
    def __init__(self):
        self.sharding_strategy = ShardingStrategy()
        self.connection_pools = {}
        self._initialize_pools()
    
    def _initialize_pools(self):
        # 初始化所有分片的连接池
        for i in range(16):
            db_name = self.sharding_strategy.get_database_name(i)
            if db_name not in self.connection_pools:
                self.connection_pools[db_name] = self._create_connection_pool(db_name)
    
    def get_user_info(self, user_id):
        shard_key = self.sharding_strategy.get_shard_key(user_id)
        db_name = self.sharding_strategy.get_database_name(shard_key)
        table_name = self.sharding_strategy.get_table_name(shard_key)
        
        connection = self.connection_pools[db_name].get_connection()
        try:
            cursor = connection.cursor()
            sql = f"SELECT * FROM {table_name} WHERE user_id = %s"
            cursor.execute(sql, (user_id,))
            return cursor.fetchone()
        finally:
            connection.close()
```

## 3. 缓存高可用方案

### Q7: Redis高可用集群方案？
**答：** Redis高可用主要通过Redis Cluster和Sentinel实现：

**Redis Cluster配置**：
```bash
# redis-cluster.conf
port 7000
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
appendonly yes

# 启动集群节点
redis-server redis-cluster.conf

# 创建集群
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 \
  --cluster-replicas 1
```

**应用层Redis集群访问**：
```python
import redis
from redis.cluster import RedisCluster

class RedisClusterManager:
    def __init__(self, startup_nodes):
        self.cluster = RedisCluster(
            startup_nodes=startup_nodes,
            decode_responses=True,
            skip_full_coverage_check=True
        )
    
    def get(self, key):
        try:
            return self.cluster.get(key)
        except redis.RedisError as e:
            # 降级到本地缓存或数据库
            return self._fallback_get(key)
    
    def set(self, key, value, ex=None):
        try:
            return self.cluster.set(key, value, ex=ex)
        except redis.RedisError as e:
            # 记录错误但不影响主流程
            self._log_error(f"Redis set failed: {e}")
            return False
    
    def _fallback_get(self, key):
        # 实现降级逻辑
        # 可以查询本地缓存、数据库等
        pass
```

### Q8: 多级缓存架构？
**答：** 多级缓存架构提供更好的性能和可用性：

```python
class MultiLevelCache:
    def __init__(self):
        # L1: 本地缓存（最快的访问）
        self.l1_cache = LocalCache(max_size=1000)
        
        # L2: 分布式缓存（共享缓存）
        self.l2_cache = RedisClusterManager(startup_nodes=[
            {"host": "127.0.0.1", "port": "7000"},
            {"host": "127.0.0.1", "port": "7001"}
        ])
        
        # L3: 数据库（持久化存储）
        self.database = DatabaseManager()
    
    def get(self, key):
        # L1缓存查询
        value = self.l1_cache.get(key)
        if value is not None:
            return value
        
        # L2缓存查询
        value = self.l2_cache.get(key)
        if value is not None:
            # 回种到L1缓存
            self.l1_cache.set(key, value, ttl=300)
            return value
        
        # L3数据库查询
        value = self.database.get(key)
        if value is not None:
            # 回种到L1和L2缓存
            self.l1_cache.set(key, value, ttl=300)
            self.l2_cache.set(key, value, ex=600)
            return value
        
        return None
    
    def set(self, key, value, ttl=600):
        # 同时写入各级缓存
        self.l1_cache.set(key, value, ttl=min(ttl, 300))
        self.l2_cache.set(key, value, ex=ttl)
        # 异步写入数据库
        self._async_write_to_db(key, value)

class LocalCache:
    def __init__(self, max_size=1000):
        self.cache = {}
        self.max_size = max_size
        self.access_times = {}
    
    def get(self, key):
        if key in self.cache:
            self.access_times[key] = time.time()
            return self.cache[key]
        return None
    
    def set(self, key, value, ttl):
        if len(self.cache) >= self.max_size:
            # LRU淘汰策略
            self._evict_lru()
        
        self.cache[key] = value
        self.access_times[key] = time.time()
        
        # 设置过期时间
        threading.Timer(ttl, self._expire_key, args=[key]).start()
    
    def _evict_lru(self):
        if self.access_times:
            oldest_key = min(self.access_times.keys(), 
                           key=lambda k: self.access_times[k])
            del self.cache[oldest_key]
            del self.access_times[oldest_key]
```

## 4. 消息队列高可用

### Q9: Kafka高可用集群部署？
**答：** Kafka通过多副本机制实现高可用：

**Kafka集群配置**：
```properties
# server.properties
broker.id=0
listeners=PLAINTEXT://:9092
advertised.listeners=PLAINTEXT://localhost:9092

# Zookeeper配置
zookeeper.connect=localhost:2181,localhost:2182,localhost:2183

# 副本配置
num.replica.fetchers=4
replica.lag.time.max.ms=30000
replica.socket.timeout.ms=30000

# 日志配置
log.retention.hours=168
log.segment.bytes=1073741824
log.retention.check.interval.ms=300000

# 分区配置
num.partitions=16
default.replication.factor=3
min.insync.replicas=2
```

**应用层Kafka高可用访问**：
```python
from kafka import KafkaProducer, KafkaConsumer
from kafka.errors import KafkaError

class HighAvailableKafkaClient:
    def __init__(self, bootstrap_servers):
        self.bootstrap_servers = bootstrap_servers
        self.producer = None
        self._initialize_producer()
    
    def _initialize_producer(self):
        try:
            self.producer = KafkaProducer(
                bootstrap_servers=self.bootstrap_servers,
                acks='all',  # 等待所有副本确认
                retries=5,
                retry_backoff_ms=1000,
                compression_type='snappy',
                batch_size=16384,
                linger_ms=10,
                buffer_memory=33554432
            )
        except Exception as e:
            self._handle_kafka_error(e)
    
    def send_message(self, topic, message, key=None):
        try:
            future = self.producer.send(topic, key=key, value=message.encode('utf-8'))
            # 等待发送结果
            record_metadata = future.get(timeout=10)
            return {
                'success': True,
                'topic': record_metadata.topic,
                'partition': record_metadata.partition,
                'offset': record_metadata.offset
            }
        except KafkaError as e:
            self._handle_kafka_error(e)
            return {'success': False, 'error': str(e)}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def create_consumer(self, topics, group_id):
        return KafkaConsumer(
            *topics,
            bootstrap_servers=self.bootstrap_servers,
            group_id=group_id,
            enable_auto_commit=True,
            auto_commit_interval_ms=1000,
            auto_offset_reset='earliest',
            session_timeout_ms=30000,
            heartbeat_interval_ms=10000,
            max_poll_records=500
        )
```

### Q10: 消息队列可靠性保证？
**答：** 消息队列的可靠性保证机制：

**生产者可靠性**：
```python
class ReliableMessageProducer:
    def __init__(self):
        self.kafka_client = HighAvailableKafkaClient(['localhost:9092'])
        self.message_store = DatabaseMessageStore()
        self.retry_queue = RetryQueue()
    
    def send_reliable_message(self, topic, message, key=None):
        # 1. 持久化消息到数据库
        message_id = self.message_store.save_message({
            'topic': topic,
            'key': key,
            'message': message,
            'status': 'sending',
            'created_at': time.time()
        })
        
        # 2. 发送到Kafka
        result = self.kafka_client.send_message(topic, message, key)
        
        if result['success']:
            # 3. 更新消息状态为已发送
            self.message_store.update_status(message_id, 'sent')
            return result
        else:
            # 4. 发送失败，加入重试队列
            self.message_store.update_status(message_id, 'failed')
            self.retry_queue.add_message(message_id, retry_count=0)
            return result
    
    def process_retry_queue(self):
        """处理重试队列"""
        while True:
            message_info = self.retry_queue.get_next_message()
            if not message_info:
                time.sleep(1)
                continue
            
            # 重试发送
            result = self.kafka_client.send_message(
                message_info['topic'],
                message_info['message'],
                message_info['key']
            )
            
            if result['success']:
                self.message_store.update_status(message_info['id'], 'sent')
                self.retry_queue.remove_message(message_info['id'])
            else:
                # 增加重试次数
                new_retry_count = message_info['retry_count'] + 1
                if new_retry_count < 3:  # 最多重试3次
                    self.retry_queue.update_retry_count(
                        message_info['id'], 
                        new_retry_count
                    )
                else:
                    # 超过重试次数，标记为永久失败
                    self.message_store.update_status(
                        message_info['id'], 
                        'permanently_failed'
                    )
                    self._alert_permanent_failure(message_info)
```

**消费者可靠性**：
```python
class ReliableMessageConsumer:
    def __init__(self, topics, group_id):
        self.consumer = KafkaConsumerFactory.create_consumer(topics, group_id)
        self.message_processor = MessageProcessor()
        self.dlq_producer = DeadLetterQueueProducer()
    
    def consume_messages(self):
        for message in self.consumer:
            try:
                # 1. 处理消息
                result = self.message_processor.process(message)
                
                if result.success:
                    # 2. 手动提交偏移量
                    self.consumer.commit()
                else:
                    # 3. 处理失败，发送到死信队列
                    self._send_to_dlq(message, result.error)
                    
            except Exception as e:
                # 4. 异常处理
                self._handle_processing_exception(message, e)
                
                # 5. 发送到死信队列
                self._send_to_dlq(message, str(e))
    
    def _send_to_dlq(self, message, error):
        """发送消息到死信队列"""
        dlq_message = {
            'original_topic': message.topic,
            'original_partition': message.partition,
            'original_offset': message.offset,
            'key': message.key,
            'value': message.value,
            'error': error,
            'timestamp': time.time()
        }
        
        self.dlq_producer.send('dead_letter_queue', dlq_message)
```

## 5. 微服务高可用

### Q11: 服务网格高可用方案？
**答：** 服务网格通过Sidecar代理实现服务间通信的高可用：

**Istio配置示例**：
```yaml
# DestinationRule定义服务的负载均衡策略
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: user-service
spec:
  host: user-service
  trafficPolicy:
    loadBalancer:
      simple: LEAST_CONN
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 1000
        maxRequestsPerConnection: 10
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 1m
      baseEjectionTime: 5m
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2

---
# VirtualService定义路由规则
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service
spec:
  hosts:
  - user-service
  http:
  - route:
    - destination:
        host: user-service
        subset: v1
      weight: 90
    - destination:
        host: user-service
        subset: v2
      weight: 10
  # 故障注入用于测试高可用
  fault:
    delay:
      percentage:
        value: 0.1
      fixedDelay: 5s
```

**应用层服务调用**：
```python
class MeshAwareServiceClient:
    def __init__(self):
        self.service_discovery = ServiceDiscovery()
        self.circuit_breaker = CircuitBreaker()
        self.retry_policy = RetryPolicy()
    
    def call_service(self, service_name, endpoint, data=None):
        # 1. 服务发现获取实例列表
        instances = self.service_discovery.get_healthy_instances(service_name)
        if not instances:
            raise ServiceUnavailable(f"No healthy instances for {service_name}")
        
        # 2. 负载均衡选择实例
        instance = self._load_balance(instances)
        
        # 3. 熔断器保护
        def make_request():
            return self._make_http_request(instance, endpoint, data)
        
        # 4. 带重试的熔断保护调用
        return self.retry_policy.execute_with_retry(
            lambda: self.circuit_breaker.call(make_request)
        )
    
    def _load_balance(self, instances):
        """负载均衡算法"""
        # 实现最少连接数、轮询等算法
        return min(instances, key=lambda inst: inst.current_connections)
    
    def _make_http_request(self, instance, endpoint, data):
        """发起HTTP请求"""
        url = f"http://{instance.host}:{instance.port}{endpoint}"
        try:
            response = requests.post(url, json=data, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            # 记录实例失败
            self.service_discovery.record_instance_failure(instance)
            raise e
```

### Q12: 微服务容错设计？
**答：** 微服务容错设计的关键模式：

**Bulkhead模式**：
```python
import threading
from concurrent.futures import ThreadPoolExecutor

class Bulkhead:
    def __init__(self, max_concurrent_calls=10, max_queue_size=50):
        self.semaphore = threading.Semaphore(max_concurrent_calls)
        self.executor = ThreadPoolExecutor(
            max_workers=max_concurrent_calls,
            queue_size=max_queue_size
        )
    
    def execute(self, func, *args, **kwargs):
        if self.semaphore.acquire(blocking=False):
            try:
                future = self.executor.submit(func, *args, **kwargs)
                return future.result(timeout=30)  # 30秒超时
            finally:
                self.semaphore.release()
        else:
            raise BulkheadRejectedException("Bulkhead limit exceeded")

class UserService:
    def __init__(self):
        # 为不同服务调用设置不同的舱壁
        self.user_db_bulkhead = Bulkhead(max_concurrent_calls=20)
        self.external_api_bulkhead = Bulkhead(max_concurrent_calls=5)
    
    def get_user_profile(self, user_id):
        # 数据库调用使用独立舱壁
        return self.user_db_bulkhead.execute(
            self._fetch_user_from_db, user_id
        )
    
    def get_external_user_data(self, user_id):
        # 外部API调用使用独立舱壁
        return self.external_api_bulkhead.execute(
            self._call_external_api, user_id
        )
```

**Timeout模式**：
```python
import signal
from functools import wraps

class TimeoutError(Exception):
    pass

def timeout(seconds):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            def timeout_handler(signum, frame):
                raise TimeoutError(f"Function {func.__name__} timed out after {seconds} seconds")
            
            # 设置信号处理器
            old_handler = signal.signal(signal.SIGALRM, timeout_handler)
            signal.alarm(seconds)
            
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                # 恢复原来的信号处理器
                signal.alarm(0)
                signal.signal(signal.SIGALRM, old_handler)
        
        return wrapper
    return decorator

class OrderService:
    def __init__(self):
        self.payment_client = PaymentServiceClient()
        self.inventory_client = InventoryServiceClient()
    
    @timeout(5)  # 5秒超时
    def process_payment(self, order_id, amount):
        return self.payment_client.charge(order_id, amount)
    
    @timeout(3)  # 3秒超时
    def check_inventory(self, product_id, quantity):
        return self.inventory_client.get_stock(product_id, quantity)
```

## 6. 容器化与云原生高可用

### Q13: Kubernetes高可用部署？
**答：** Kubernetes通过多控制平面节点实现高可用：

**Kubernetes高可用架构**：
```yaml
# kube-apiserver高可用配置
apiVersion: v1
kind: Pod
metadata:
  name: kube-apiserver
  namespace: kube-system
spec:
  containers:
  - name: kube-apiserver
    image: k8s.gcr.io/kube-apiserver:v1.21.0
    command:
    - kube-apiserver
    - --advertise-address=$(POD_IP)
    - --allow-privileged=true
    - --authorization-mode=Node,RBAC
    - --enable-admission-plugins=NodeRestriction
    - --enable-bootstrap-token-auth=true
    - --etcd-cafile=/etc/kubernetes/pki/etcd/ca.crt
    - --etcd-certfile=/etc/kubernetes/pki/apiserver-etcd-client.crt
    - --etcd-keyfile=/etc/kubernetes/pki/apiserver-etcd-client.key
    - --etcd-servers=https://10.0.0.1:2379,https://10.0.0.2:2379,https://10.0.0.3:2379
    - --service-cluster-ip-range=10.96.0.0/12
    - --service-node-port-range=30000-32767
    livenessProbe:
      httpGet:
        path: /livez
        port: 6443
        scheme: HTTPS
      initialDelaySeconds: 15
      timeoutSeconds: 15
    readinessProbe:
      httpGet:
        path: /readyz
        port: 6443
        scheme: HTTPS
      initialDelaySeconds: 5
      timeoutSeconds: 15
```

**应用部署高可用配置**：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: user-service
spec:
  replicas: 3  # 至少3个副本
  selector:
    matchLabels:
      app: user-service
  template:
    metadata:
      labels:
        app: user-service
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - user-service
              topologyKey: kubernetes.io/hostname
      containers:
      - name: user-service
        image: user-service:latest
        ports:
        - containerPort: 8080
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
  - port: 80
    targetPort: 8080
  type: ClusterIP
```

### Q14: 服务监控与告警？
**答：** 全面的监控和告警体系是高可用的重要保障：

**Prometheus监控配置**：
```yaml
# Prometheus配置
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert.rules.yml"

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
    - role: pod
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
      action: keep
      regex: true
    - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__

# 告警规则
groups:
- name: example
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 10m
    labels:
      severity: critical
    annotations:
      summary: "High error rate for {{ $labels.job }}"
      description: "{{ $value }}% of requests are failing"
```

**应用层监控埋点**：
```python
import prometheus_client
from prometheus_client import Counter, Histogram, Gauge

class MetricsCollector:
    def __init__(self):
        # 请求计数器
        self.requests_total = Counter(
            'http_requests_total',
            'Total HTTP requests',
            ['method', 'endpoint', 'status']
        )
        
        # 请求延迟直方图
        self.request_duration = Histogram(
            'http_request_duration_seconds',
            'HTTP request duration in seconds',
            ['method', 'endpoint'],
            buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0]
        )
        
        # 在线用户数
        self.online_users = Gauge(
            'online_users',
            'Number of online users'
        )
        
        # 数据库连接数
        self.db_connections = Gauge(
            'database_connections',
            'Number of active database connections'
        )
    
    def record_request(self, method, endpoint, status, duration):
        self.requests_total.labels(method, endpoint, status).inc()
        self.request_duration.labels(method, endpoint).observe(duration)
    
    def set_online_users(self, count):
        self.online_users.set(count)
    
    def set_db_connections(self, count):
        self.db_connections.set(count)

# Flask应用中使用
from flask import Flask, request
import time

app = Flask(__name__)
metrics = MetricsCollector()

@app.before_request
def before_request():
    request.start_time = time.time()

@app.after_request
def after_request(response):
    duration = time.time() - request.start_time
    metrics.record_request(
        request.method,
        request.path,
        response.status_code,
        duration
    )
    return response
```

## 7. 灾备与应急响应

### Q15: 多活架构与灾备方案？
**答：** 多活架构和灾备方案确保业务连续性：

**同城双活架构**：
```python
class MultiActiveArchitecture:
    def __init__(self):
        self.data_centers = {
            'dc1': {
                'region': 'cn-north-1',
                'zone': 'cn-north-1a',
                'services': ['web', 'api', 'database'],
                'status': 'active'
            },
            'dc2': {
                'region': 'cn-north-1',
                'zone': 'cn-north-1b',
                'services': ['web', 'api', 'database'],
                'status': 'active'
            }
        }
        self.global_load_balancer = GlobalLoadBalancer()
    
    def route_request(self, request):
        # 基于用户地理位置路由
        user_region = self._get_user_region(request)
        
        # 健康检查
        healthy_dcs = self._get_healthy_data_centers()
        
        if not healthy_dcs:
            raise ServiceUnavailable("No healthy data centers")
        
        # 优先选择同地域数据中心
        preferred_dc = self._find_preferred_dc(user_region, healthy_dcs)
        
        return self.global_load_balancer.route_to_dc(preferred_dc, request)
    
    def failover(self, failed_dc):
        """故障切换"""
        self.data_centers[failed_dc]['status'] = 'failed'
        
        # 重新路由流量
        self.global_load_balancer.exclude_dc(failed_dc)
        
        # 启动数据同步
        self._start_data_sync_recovery(failed_dc)
        
        # 通知运维团队
        self._alert_operations_team(f"Data center {failed_dc} failed")
```

**异地灾备方案**：
```python
class DisasterRecoveryPlan:
    def __init__(self):
        self.primary_site = "beijing"
        self.standby_site = "shanghai"
        self.disaster_recovery_site = "guangzhou"
        
        self.data_replication = DataReplicator()
        self.health_checker = HealthChecker()
    
    def execute_failover(self, failure_type):
        """执行故障切换"""
        if failure_type == "REGIONAL_DISASTER":
            # 区域性灾难，切换到异地灾备
            return self._failover_to_dr_site()
        elif failure_type == "SITE_FAILURE":
            # 站点故障，切换到备用站点
            return self._failover_to_standby_site()
        else:
            # 单点故障，本地恢复
            return self._local_recovery()
    
    def _failover_to_dr_site(self):
        """切换到灾备站点"""
        # 1. 停止主站点服务
        self._stop_services(self.primary_site)
        
        # 2. 提升灾备站点数据
        self.data_replication.promote_dr_site(self.disaster_recovery_site)
        
        # 3. 启动灾备站点服务
        self._start_services(self.disaster_recovery_site)
        
        # 4. 更新DNS指向
        self._update_dns_routing(self.disaster_recovery_site)
        
        # 5. 通知相关人员
        self._notify_stakeholders("Failover to DR site completed")
        
        return {
            'status': 'SUCCESS',
            'new_primary': self.disaster_recovery_site,
            'estimated_downtime': '30 minutes'
        }
```

### Q16: 应急响应与故障演练？
**答：** 系统化的应急响应和定期演练确保高可用能力：

**应急响应流程**：
```python
class IncidentResponseManager:
    def __init__(self):
        self.incident_handlers = {
            'DATABASE_FAILURE': DatabaseIncidentHandler(),
            'SERVICE_OUTAGE': ServiceIncidentHandler(),
            'SECURITY_BREACH': SecurityIncidentHandler()
        }
        self.communication_channels = CommunicationChannels()
    
    def handle_incident(self, incident):
        """处理突发事件"""
        # 1. 事件分级
        severity = self._assess_severity(incident)
        
        # 2. 通知相关人员
        self._notify_team(incident, severity)
        
        # 3. 启动应急预案
        handler = self.incident_handlers.get(incident.type)
        if handler:
            response_plan = handler.create_response_plan(incident)
            execution_result = handler.execute_plan(response_plan)
            
            # 4. 持续监控
            self._monitor_recovery(execution_result)
            
            # 5. 事后总结
            self._post_incident_review(incident, execution_result)
            
            return execution_result
        else:
            raise UnknownIncidentType(f"No handler for incident type: {incident.type}")
    
    def _assess_severity(self, incident):
        """评估事件严重程度"""
        scoring_factors = {
            'impact_users': incident.affected_users / incident.total_users,
            'revenue_impact': incident.revenue_loss_per_hour,
            'duration': incident.duration_minutes,
            'escalation_level': incident.escalation_level
        }
        
        total_score = sum(scoring_factors.values())
        
        if total_score > 0.8:
            return 'CRITICAL'
        elif total_score > 0.5:
            return 'HIGH'
        elif total_score > 0.2:
            return 'MEDIUM'
        else:
            return 'LOW'

class ChaosEngineering:
    def __init__(self):
        self.experiments = []
        self.safety_guardrails = SafetyGuardrails()
    
    def run_chaos_experiment(self, experiment_config):
        """运行混沌工程实验"""
        # 1. 验证安全防护措施
        if not self.safety_guardrails.validate():
            raise SafetyValidationFailed("Safety guardrails validation failed")
        
        # 2. 设置监控和告警
        monitors = self._setup_experiment_monitors(experiment_config)
        
        # 3. 执行故障注入
        try:
            experiment_result = self._inject_fault(experiment_config)
            
            # 4. 观察系统行为
            observations = self._collect_observations(monitors)
            
            # 5. 验证系统恢复能力
            recovery_result = self._verify_recovery(observations)
            
            # 6. 生成实验报告
            report = self._generate_report(
                experiment_config, 
                experiment_result, 
                observations, 
                recovery_result
            )
            
            return report
            
        except Exception as e:
            # 7. 紧急回滚
            self._emergency_rollback(experiment_config)
            raise e
        finally:
            # 8. 清理实验环境
            self._cleanup_experiment(experiment_config)
```

通过以上全面的ToC业务高可用解决方案，可以构建一个稳定、可靠的在线服务系统，确保用户体验和业务连续性。