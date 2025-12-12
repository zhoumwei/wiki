# React学习教程

## 1. React基础概念

### Q1: 什么是React？它有什么特点？
**答：** React是由Facebook开发的用于构建用户界面的JavaScript库。

主要特点：
- **组件化开发**：将UI拆分为独立可复用的组件
- **虚拟DOM**：提高渲染性能
- **单向数据流**：数据从父组件流向子组件
- **声明式编程**：描述UI应该是什么样子
- **JSX语法**：JavaScript的语法扩展
- **丰富的生态系统**：大量的第三方库和工具

### Q2: React的核心概念有哪些？
**答：** React的核心概念包括：

1. **组件（Components）**：
   - 函数组件和类组件
   - 可复用的UI构建块

2. **JSX**：
   - JavaScript的语法扩展
   - 允许在JS中写HTML-like代码

3. **虚拟DOM**：
   - 内存中的DOM表示
   - 提高渲染性能

4. **状态（State）**：
   - 组件内部的数据
   - 状态变化触发重新渲染

5. **属性（Props）**：
   - 组件间传递数据的方式
   - 父组件向子组件传递数据

6. **生命周期**：
   - 组件从创建到销毁的过程
   - 不同类组件有不同的生命周期方法

### Q3: React与Vue、Angular的区别？
**答：** 

| 特性 | React | Vue | Angular |
|------|-------|-----|---------|
| 类型 | 库 | 框架 | 框架 |
| 学习曲线 | 中等 | 简单 | 陡峭 |
| 数据绑定 | 单向 | 双向 | 双向 |
| 模板 | JSX | 模板语法 | 模板语法 |
| 状态管理 | Redux/MobX等 | Vuex | RxJS |
| 大小 | 较小 | 小 | 大 |

## 2. React组件和JSX

### Q4: 函数组件和类组件的区别？
**答：** 

**函数组件**：
```jsx
// React 16.8之前
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// React Hooks（推荐）
import { useState } from 'react';

function Welcome({ name }) {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Hello, {name}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

**类组件**：
```jsx
import { Component } from 'react';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  render() {
    return (
      <div>
        <h1>Hello, {this.props.name}</h1>
        <p>Count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

区别：
- 函数组件更简洁，性能更好
- 类组件有完整的生命周期方法
- Hooks让函数组件具备了类组件的能力

### Q5: JSX语法详解？
**答：** JSX是JavaScript的语法扩展，允许在JS中写类似HTML的代码。

**基本语法**：
```jsx
// 表达式
const name = 'Alice';
const element = <h1>Hello, {name}!</h1>;

// 属性
const element2 = <img src="image.jpg" alt="description" />;

// 子元素
const element3 = (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// 条件渲染
const element4 = (
  <div>
    {isLoggedIn ? <UserPanel /> : <LoginForm />}
  </div>
);

// 列表渲染
const items = ['Apple', 'Banana', 'Orange'];
const listItems = items.map((item, index) =>
  <li key={index}>{item}</li>
);
```

**注意事项**：
- 必须有根元素
- className代替class
- htmlFor代替for
- 使用驼峰命名法

### Q6: 组件间通信方式？
**答：** React组件间通信的方式：

1. **父子组件通信**：
```jsx
// 父组件向子组件传递数据（Props）
function Parent() {
  const [message] = useState("Hello from parent");
  return <Child message={message} />;
}

function Child({ message }) {
  return <div>{message}</div>;
}

// 子组件向父组件传递数据（回调函数）
function Parent() {
  const [childData, setChildData] = useState("");
  
  const handleChildData = (data) => {
    setChildData(data);
  };
  
  return (
    <div>
      <Child onData={handleChildData} />
      <p>Child data: {childData}</p>
    </div>
  );
}

function Child({ onData }) {
  return (
    <button onClick={() => onData("Data from child")}>
      Send data to parent
    </button>
  );
}
```

2. **兄弟组件通信**：
   - 通过共同父组件传递
   - 使用Context API
   - 使用状态管理库（Redux、MobX等）

3. **跨层级组件通信**：
   - Context API
   - 状态管理库

## 3. React Hooks

### Q7: React Hooks是什么？有哪些常用Hooks？
**答：** React Hooks是React 16.8引入的特性，允许在函数组件中使用状态和其他React特性。

**常用Hooks**：

1. **useState**：状态管理
```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

2. **useEffect**：副作用处理
```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  
  // 相当于 componentDidMount 和 componentDidUpdate
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });
  
  // 相当于 componentWillUnmount
  useEffect(() => {
    return () => {
      console.log('Cleanup');
    };
  }, []); // 空数组表示只在挂载和卸载时执行
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

3. **useContext**：使用Context
```jsx
import { useContext } from 'react';
import { ThemeContext } from './theme-context';

function Button() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

4. **useReducer**：复杂状态管理
```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  );
}
```

### Q8: 自定义Hooks的使用？
**答：** 自定义Hooks是复用组件逻辑的方式，名称必须以"use"开头。

```jsx
// 自定义Hook示例
import { useState, useEffect } from 'react';

// 自定义Hook：获取窗口尺寸
function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

// 使用自定义Hook
function ShowWindowDimensions() {
  const { width, height } = useWindowDimensions();
  
  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}
```

另一个示例：
```jsx
// 自定义Hook：数据获取
function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// 使用
function UserProfile({ userId }) {
  const { data, loading, error } = useApi(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data</div>;

  return <div>Hello, {data.name}!</div>;
}
```

## 4. 状态管理和数据流

### Q9: React状态管理方案？
**答：** React状态管理的几种方案：

1. **组件内部状态（useState/useReducer）**：
```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
  };
  
  return (
    <div>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} />
    </div>
  );
}
```

2. **Context API**：
```jsx
import { createContext, useContext, useReducer } from 'react';

const TodoContext = createContext();

function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

function useTodo() {
  return useContext(TodoContext);
}
```

3. **Redux**：
```jsx
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Redux store
const store = createStore(todoReducer);

// React组件中使用
function TodoApp() {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  
  return (
    <div>
      {todos.map(todo => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onToggle={() => dispatch(toggleTodo(todo.id))}
        />
      ))}
    </div>
  );
}
```

### Q10: React性能优化策略？
**答：** React性能优化的策略：

1. **使用React.memo**：
```jsx
import { memo } from 'react';

const MyComponent = memo(function MyComponent(props) {
  /* 只有props变化时才重新渲染 */
  return <div>{props.children}</div>;
});
```

2. **使用useMemo和useCallback**：
```jsx
import { useMemo, useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  
  // 缓存计算结果
  const expensiveValue = useMemo(() => {
    // 复杂计算
    return computeExpensiveValue(count);
  }, [count]);
  
  // 缓存函数
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return (
    <div>
      <ChildComponent onClick={handleClick} />
      <p>{expensiveValue}</p>
    </div>
  );
}
```

3. **懒加载组件**：
```jsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

4. **虚拟滚动**：
```jsx
// 对于大型列表使用虚拟滚动
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

## 5. React Router和路由管理

### Q11: React Router的基本使用？
**答：** React Router是React应用的路由管理库。

**基本配置**：
```jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />}>
          <Route path=":id" element={<UserDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Users() {
  return (
    <div>
      <h2>Users</h2>
      <Outlet /> {/* 子路由出口 */}
    </div>
  );
}
```

**编程式导航**：
```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // 登录逻辑
    navigate('/dashboard');
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 表单内容 */}
    </form>
  );
}
```

### Q12: 路由参数和导航守卫？
**答：** 

**路由参数**：
```jsx
import { useParams, useSearchParams } from 'react-router-dom';

// 动态路由参数
function UserDetail() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}

// 查询参数
function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery });
  };
  
  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => handleSearch(e.target.value)} 
      />
      <p>Search query: {query}</p>
    </div>
  );
}
```

**导航守卫**：
```jsx
import { Navigate, useLocation } from 'react-router-dom';

// 私有路由组件
function PrivateRoute({ children }) {
  const isAuthenticated = useAuth(); // 自定义Hook检查认证状态
  const location = useLocation();
  
  if (!isAuthenticated) {
    // 重定向到登录页，同时保存当前位置
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// 使用私有路由
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}
```

## 6. React生态系统

### Q13: React常用状态管理库？
**答：** React常用的状态管理库：

1. **Redux**：
```jsx
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Reducer
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    default:
      return state;
  }
};

// Store
const store = createStore(counterReducer);

// React组件
function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
    </div>
  );
}

// App组件
function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}
```

2. **MobX**：
```jsx
import { observable, action, makeObservable } from 'mobx';
import { observer } from 'mobx-react-lite';

class CounterStore {
  count = 0;
  
  constructor() {
    makeObservable(this, {
      count: observable,
      increment: action,
      decrement: action
    });
  }
  
  increment = () => {
    this.count++;
  };
  
  decrement = () => {
    this.count--;
  };
}

const counterStore = new CounterStore();

const Counter = observer(() => {
  return (
    <div>
      <span>{counterStore.count}</span>
      <button onClick={counterStore.increment}>+</button>
      <button onClick={counterStore.decrement}>-</button>
    </div>
  );
});
```

3. **Zustand**：
```jsx
import { create } from 'zustand';

// 创建store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

// 使用store
function Counter() {
  const { count, increment, decrement } = useStore();
  
  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

### Q14: React测试策略？
**答：** React应用的测试策略：

1. **单元测试**（Jest + React Testing Library）：
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Counter from './Counter';

test('renders counter with initial value 0', () => {
  render(<Counter />);
  expect(screen.getByText('0')).toBeInTheDocument();
});

test('increments counter when button is clicked', () => {
  render(<Counter />);
  const button = screen.getByText('Increment');
  fireEvent.click(button);
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

2. **组件测试**：
```jsx
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

// Mock数据
jest.mock('../api/user', () => ({
  fetchUser: jest.fn()
}));

test('displays user profile', async () => {
  require('../api/user').fetchUser.mockResolvedValue({
    name: 'Alice',
    email: 'alice@example.com'
  });
  
  render(<UserProfile userId="123" />);
  
  // 等待异步操作完成
  expect(await screen.findByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('alice@example.com')).toBeInTheDocument();
});
```

3. **集成测试**：
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('full app flow', () => {
  render(<App />);
  
  // 导航到某个页面
  fireEvent.click(screen.getByText('Users'));
  
  // 与组件交互
  fireEvent.click(screen.getByText('Add User'));
  
  // 验证结果
  expect(screen.getByText('User added successfully')).toBeInTheDocument();
});
```

## 7. React最佳实践

### Q15: React开发最佳实践？
**答：** React开发的最佳实践：

1. **组件设计原则**：
```jsx
// 好的设计：单一职责
function UserCard({ user }) {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// 避免在render中创建函数
// 不好的做法
function BadComponent() {
  return (
    <button onClick={() => console.log('clicked')}>
      Click me
    </button>
  );
}

// 好的做法
function GoodComponent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);
  
  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

2. **状态管理**：
```jsx
// 将状态提升到合适的层级
function TodoApp() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = useCallback((text) => {
    setTodos(prev => [...prev, {
      id: Date.now(),
      text,
      completed: false
    }]);
  }, []);
  
  return (
    <div>
      <TodoForm onAdd={addTodo} />
      <TodoList todos={todos} />
    </div>
  );
}
```

3. **错误边界**：
```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// 使用
function App() {
  return (
    <ErrorBoundary>
      <MyWidget />
    </ErrorBoundary>
  );
}
```

### Q16: React 18新特性？
**答：** React 18引入的重要新特性：

1. **自动批处理**：
```jsx
// React 18中，即使在异步操作中也会自动批处理状态更新
function Button() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    fetchSomething().then(() => {
      // React 18中这两个更新会被自动批处理
      setCount(c => c + 1);
      setFlag(f => !f);
    });
  }

  return (
    <div>
      <button onClick={handleClick}>Next</button>
      <h1>{count}</h1>
      <h2>{flag ? 'true' : 'false'}</h2>
    </div>
  );
}
```

2. **并发渲染**：
```jsx
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';

// 使用新的createRoot API
const root = createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback="Loading...">
    <App />
  </Suspense>
);
```

3. **Transition API**：
```jsx
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <div>
      <button onClick={() => selectTab('about')}>About</button>
      <button onClick={() => selectTab('posts')}>Posts</button>
      <button onClick={() => selectTab('contact')}>Contact</button>
      {isPending && <div>Loading...</div>}
      <hr />
      {tab === 'about' && <AboutTab />}
      {tab === 'posts' && <PostsTab />}
      {tab === 'contact' && <ContactTab />}
    </div>
  );
}
```

4. **新的Hooks**：
```jsx
// useId：生成稳定的唯一ID
import { useId } from 'react';

function PasswordField() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Password:</label>
      <input id={id} type="password" />
    </>
  );
}

// useSyncExternalStore：订阅外部数据源
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  // 订阅外部数据源
  const token = externalDataSource.subscribe(callback);
  return () => {
    externalDataSource.unsubscribe(token);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe, // 订阅函数
    () => externalDataSource.getSnapshot(), // 获取快照
    () => externalDataSource.getSnapshot()  // 服务端快照
  );
}
```