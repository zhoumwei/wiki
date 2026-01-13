# Spring Boot

## 1. Spring Boot基础

### Q1: 什么是Spring Boot？它解决了什么问题？
**答：** Spring Boot是Spring框架的一个扩展，旨在简化新Spring应用的初始搭建以及开发过程。

解决的问题：
- **配置复杂**：传统Spring应用需要大量的XML配置或注解配置
- **依赖管理困难**：需要手动管理各种jar包的版本兼容性
- **部署复杂**：需要配置Web服务器
- **开发效率低**：重复性的配置工作占用大量时间

Spring Boot的特点：
- 自动配置：根据类路径中的jar包自动配置Spring应用
- 起步依赖：简化Maven/Gradle配置
- 内嵌服务器：内置Tomcat、Jetty等服务器
- 生产就绪：提供健康检查、指标监控等功能

### Q2: Spring Boot自动配置的原理是什么？
**答：** Spring Boot自动配置的原理基于以下几点：

1. **@EnableAutoConfiguration注解**：这是自动配置的核心注解，会导入AutoConfigurationImportSelector类

2. **SPI机制**：通过META-INF/spring.factories文件定义自动配置类

3. **条件注解**：使用@Conditional系列注解控制配置生效条件
   - @ConditionalOnClass：当classpath下存在指定类时生效
   - @ConditionalOnMissingBean：当容器中不存在指定bean时生效
   - @ConditionalOnProperty：当配置文件中存在指定属性时生效

4. **自动配置过程**：
   - Spring Boot启动时扫描META-INF/spring.factories文件
   - 加载其中定义的自动配置类
   - 根据条件注解判断是否满足配置条件
   - 满足条件则注册相应的Bean到Spring容器中

### Q3: Spring Boot Starter的作用是什么？
**答：** Starter是一组方便的依赖描述符，可以一站式地获取所需的Spring和相关技术的一站式解决方案。

作用：
- **简化依赖管理**：无需单独添加各种依赖及其版本
- **快速开发**：通过一组可传递的依赖关系快速搭建项目
- **约定优于配置**：遵循Spring Boot的最佳实践

常见的Starter：
- spring-boot-starter-web：Web开发
- spring-boot-starter-data-jpa：JPA数据访问
- spring-boot-starter-test：测试框架
- spring-boot-starter-security：安全框架

## 2. Spring Boot配置

### Q4: Spring Boot配置文件的加载顺序是怎样的？
**答：** Spring Boot配置文件的加载顺序（优先级从高到低）：

1. 命令行参数
2. JNDI属性
3. 系统环境变量
4. application-{profile}.properties/yml（jar包外相对路径config目录下）
5. application-{profile}.properties/yml（jar包外当前目录下）
6. application.properties/yml（jar包外相对路径config目录下）
7. application.properties/yml（jar包外当前目录下）
8. application-{profile}.properties/yml（jar包内）
9. application.properties/yml（jar包内）

注意事项：
- 高优先级配置会覆盖低优先级配置
- 相同优先级位置properties优先于yml
- @PropertySource注解指定的配置文件优先级较低

### Q5: 如何实现多环境配置？
**答：** Spring Boot支持多种方式实现多环境配置：

1. **Profile方式**：
   - 创建application-{profile}.properties文件
   - 在application.properties中激活：spring.profiles.active=dev

2. **@Profile注解**：
   ```java
   @Component
   @Profile("dev")
   public class DevService {}
   ```

3. **条件注解**：
   ```java
   @ConditionalOnProperty(name = "app.env", havingValue = "dev")
   ```

4. **配置类方式**：
   ```java
   @Configuration
   @Profile("prod")
   public class ProductionConfig {}
   ```

### Q6: Spring Boot如何实现热部署？
**答：** Spring Boot实现热部署有两种方式：

1. **Spring Boot DevTools**：
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-devtools</artifactId>
       <optional>true</optional>
   </dependency>
   ```
   原理：使用两个ClassLoader，一个加载不会改变的类（第三方jar包），一个加载会改变的类（自定义的类）。当检测到文件变化时，重新加载第二个ClassLoader。

2. **JRebel**：
   商业工具，功能更强大，支持更多的框架和场景。

## 3. Spring Boot Web开发

### Q7: Spring MVC和Spring Boot的关系？
**答：** Spring MVC是Spring框架的一部分，专门用于Web开发。Spring Boot是对Spring框架的进一步封装和简化。

关系：
- Spring Boot包含了Spring MVC
- Spring Boot简化了Spring MVC的配置
- Spring Boot提供了自动配置，使得Spring MVC更容易使用

Spring Boot对Spring MVC的增强：
- 自动配置DispatcherServlet
- 自动配置ViewResolver
- 自动配置静态资源处理
- 内置Web服务器

### Q8: Spring Boot如何处理跨域问题？
**答：** Spring Boot处理跨域有以下几种方式：

1. **@CrossOrigin注解**：
   ```java
   @RestController
   @CrossOrigin(origins = "*")
   public class UserController {}
   ```

2. **全局配置**：
   ```java
   @Configuration
   public class CorsConfig {
       @Bean
       public CorsFilter corsFilter() {
           CorsConfiguration config = new CorsConfiguration();
           config.addAllowedOrigin("*");
           config.addAllowedMethod("*");
           config.addAllowedHeader("*");
           
           UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
           source.registerCorsConfiguration("/**", config);
           
           return new CorsFilter(source);
       }
   }
   ```

3. **实现WebMvcConfigurer接口**：
   ```java
   @Configuration
   public class WebConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/**")
                   .allowedOrigins("*")
                   .allowedMethods("*");
       }
   }
   ```

## 4. Spring Boot数据访问

### Q9: Spring Boot整合MyBatis的步骤？
**答：** Spring Boot整合MyBatis的步骤：

1. **添加依赖**：
   ```xml
   <dependency>
       <groupId>org.mybatis.spring.boot</groupId>
       <artifactId>mybatis-spring-boot-starter</artifactId>
       <version>2.1.4</version>
   </dependency>
   ```

2. **配置数据源**：
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/test
   spring.datasource.username=root
   spring.datasource.password=root
   spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
   ```

3. **创建Mapper接口**：
   ```java
   @Mapper
   public interface UserMapper {
       @Select("SELECT * FROM user WHERE id = #{id}")
       User findById(Long id);
   }
   ```

4. **在启动类上添加@MapperScan注解**（可选）：
   ```java
   @SpringBootApplication
   @MapperScan("com.example.mapper")
   public class Application {
       public static void main(String[] args) {
           SpringApplication.run(Application.class, args);
       }
   }
   ```

### Q10: Spring Boot如何实现事务管理？
**答：** Spring Boot实现事务管理的方式：

1. **添加@EnableTransactionManagement注解**（Spring Boot自动开启）：
   ```java
   @SpringBootApplication
   @EnableTransactionManagement
   public class Application {}
   ```

2. **使用@Transactional注解**：
   ```java
   @Service
   public class UserService {
       @Autowired
       private UserMapper userMapper;
       
       @Transactional
       public void saveUser(User user) {
           userMapper.insert(user);
           // 其他业务逻辑
       }
   }
   ```

3. **配置事务管理器**（通常自动配置）：
   ```java
   @Bean
   public PlatformTransactionManager transactionManager(DataSource dataSource) {
       return new DataSourceTransactionManager(dataSource);
   }
   ```

事务传播行为：
- REQUIRED：支持当前事务，如果没有则新建
- REQUIRES_NEW：新建事务，挂起当前事务
- SUPPORTS：支持当前事务，如果没有则以非事务方式执行

## 5. Spring Boot安全

### Q11: Spring Boot如何集成Spring Security？
**答：** Spring Boot集成Spring Security的步骤：

1. **添加依赖**：
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-security</artifactId>
   </dependency>
   ```

2. **创建Security配置类**：
   ```java
   @Configuration
   @EnableWebSecurity
   public class SecurityConfig {
       @Bean
       public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
           http.authorizeRequests()
               .requestMatchers("/public/**").permitAll()
               .anyRequest().authenticated()
               .and()
               .formLogin()
               .and()
               .logout();
           return http.build();
       }
   }
   ```

3. **用户认证配置**：
   ```java
   @Bean
   public UserDetailsService userDetailsService() {
       UserDetails user = User.withDefaultPasswordEncoder()
           .username("user")
           .password("password")
           .roles("USER")
           .build();
       return new InMemoryUserDetailsManager(user);
   }
   ```

### Q12: JWT在Spring Boot中的应用？
**答：** JWT（JSON Web Token）在Spring Boot中的应用：

1. **添加JWT依赖**：
   ```xml
   <dependency>
       <groupId>io.jsonwebtoken</groupId>
       <artifactId>jjwt</artifactId>
       <version>0.9.1</version>
   </dependency>
   ```

2. **JWT工具类**：
   ```java
   public class JwtUtil {
       private static final String SECRET = "mySecret";
       private static final long EXPIRATION = 86400000; // 24小时
       
       public static String generateToken(String username) {
           Date expirationDate = new Date(System.currentTimeMillis() + EXPIRATION);
           return Jwts.builder()
               .setSubject(username)
               .setExpiration(expirationDate)
               .signWith(SignatureAlgorithm.HS512, SECRET)
               .compact();
       }
       
       public static String getUsernameFromToken(String token) {
           return Jwts.parser()
               .setSigningKey(SECRET)
               .parseClaimsJws(token)
               .getBody()
               .getSubject();
       }
   }
   ```

3. **JWT过滤器**：
   ```java
   public class JwtAuthenticationFilter extends OncePerRequestFilter {
       @Override
       protected void doFilterInternal(HttpServletRequest request, 
                                     HttpServletResponse response, 
                                     FilterChain filterChain) throws ServletException, IOException {
           String token = request.getHeader("Authorization");
           if (token != null && token.startsWith("Bearer ")) {
               String username = JwtUtil.getUsernameFromToken(token.substring(7));
               if (username != null) {
                   Authentication auth = new UsernamePasswordAuthenticationToken(username, null, 
                       Collections.emptyList());
                   SecurityContextHolder.getContext().setAuthentication(auth);
               }
           }
           filterChain.doFilter(request, response);
       }
   }
   ```

## 6. Spring Boot测试

### Q13: Spring Boot测试的相关注解有哪些？
**答：** Spring Boot常用的测试注解：

1. **@SpringBootTest**：完整的Spring Boot集成测试
2. **@WebMvcTest**：专注于Web层的测试
3. **@DataJpaTest**：专注于JPA数据访问层的测试
4. **@DataMongoTest**：专注于MongoDB数据访问层的测试
5. **@RestClientTest**：专注于REST客户端的测试
6. **@JsonTest**：专注于JSON序列化/反序列化的测试

示例：
```java
@SpringBootTest
@RunWith(SpringRunner.class)
public class UserServiceTest {
    @Autowired
    private UserService userService;
    
    @Test
    public void testSaveUser() {
        User user = new User();
        user.setName("test");
        User savedUser = userService.save(user);
        assertNotNull(savedUser.getId());
    }
}
```

### Q14: 如何进行Mock测试？
**答：** Mock测试主要用于隔离依赖，专注测试目标类的功能。

1. **@Mock注解**：创建mock对象
2. **@InjectMocks注解**：注入mock对象到目标类
3. **@MockBean注解**：在Spring上下文中替换真实bean

示例：
```java
@RunWith(MockitoJUnitRunner.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    public void testFindById() {
        // 准备测试数据
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setName("test");
        
        // 设置mock行为
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));
        
        // 执行测试
        User user = userService.findById(1L);
        
        // 验证结果
        assertEquals("test", user.getName());
        verify(userRepository).findById(1L);
    }
}
```

## 7. Spring Boot监控和运维

### Q15: Spring Boot Actuator的作用？
**答：** Spring Boot Actuator提供了生产级别的监控和管理功能。

主要功能：
- **健康检查**：/actuator/health
- **指标监控**：/actuator/metrics
- **环境信息**：/actuator/env
- **日志配置**：/actuator/loggers
- **HTTP追踪**：/actuator/httptrace
- **线程转储**：/actuator/threaddump
- **堆转储**：/actuator/heapdump

添加依赖：
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

配置：
```properties
management.endpoints.web.exposure.include=*
management.endpoint.health.show-details=always
```

### Q16: Spring Boot如何实现优雅停机？
**答：** Spring Boot实现优雅停机的方法：

1. **配置优雅停机参数**：
   ```properties
   # Tomcat优雅停机
   server.shutdown=graceful
   spring.lifecycle.timeout-per-shutdown-phase=30s
   ```

2. **使用@PreDestroy注解**：
   ```java
   @Component
   public class GracefulShutdown {
       @PreDestroy
       public void destroy() {
           // 清理资源
           System.out.println("Shutting down gracefully...");
       }
   }
   ```

3. **实现DisposableBean接口**：
   ```java
   @Component
   public class MyService implements DisposableBean {
       @Override
       public void destroy() throws Exception {
           // 清理资源
       }
   }
   ```

4. **注册关闭钩子**：
   ```java
   @SpringBootApplication
   public class Application {
       public static void main(String[] args) {
           ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
           Runtime.getRuntime().addShutdownHook(new Thread(() -> {
               System.out.println("Shutting down...");
               context.close();
           }));
       }
   }
   ```