# 06 Assistants Api   Index



# Assistants API

## 💡 这节课会带给你

1. 原生 API、GPTs 和 Assistants API 的适用场景
2. 用 Assistants API 做一个 GPT

开始上课！

## 🎓 这节课怎么学

代码能力要求：**中低**，AI/数学基础要求：**无**

1. 有编程基础的同学
   - 关注代码实现细节、应用场景
2. 没有编程基础的同学
   - 关注 OpenAI 提供的能力和产品形态，多思考为什么/有什么优缺点

## 前言

### 0.1、从轰动一时的 OpenAI DevDay 说起

2023 年 11 月 6 日，OpenAI DevDay 发表了一系列新能力，其中包括：**GPT Store** 和 **Assistants API**

![image](./assets/06-assistants-api/dawn_of_gpts.jpg)

这一波操作一度被认为是创业公司终结者

![image](./assets/06-assistants-api/post.jpg)

### 0.2、GPTs 和 Assistants API 本质是降低开发门槛

可操控性和易用性之间的权衡与折中：

1. 更多技术路线选择：原生 API、GPTs 和 Assistants API
2. GPTs 的示范，起到教育客户的作用，有助于打开市场
3. 要更大自由度，需要用 Assistants API 开发
4. 想极致调优，还得原生 API + RAG

### 0.3、Assistants API 的主要能力

1. 创建和管理 assistant，每个 assistant 有独立的配置
2. 支持无限长的多轮对话，对话历史保存在 OpenAI 的服务器上
3. 通过自有向量数据库支持基于文件的 RAG
4. 支持 Code Interpreter
   1. 在沙箱里编写并运行 Python 代码
   2. 自我修正代码
   3. 可传文件给 Code Interpreter
5. 支持 Function Calling
6. 支持在线调试的 Playground


收费：

1. 按 token 收费。无论多轮对话，还是 RAG，所有都按实际消耗的 token 收费
2. 如果对话历史过多超过大模型上下文窗口，会自动放弃最老的对话消息
3. 文件按数据大小和存放时长收费。1 GB **向量存储** 一天收费 0.10 美元
4. Code interpreter 跑一次 $0.03

## 一、GPT Store：创建自己的 GPT

![image](./assets/06-assistants-api/create_gpt.png)

![image](./assets/06-assistants-api/gpt.png)

发布链接：https://chat.openai.com/g/g-iU8hVr4jR-wo-de-demogpt

## 二、Assistants API

```python
!pip install --upgrade openai
```

```python
from openai import OpenAI
client = OpenAI()

ids = []
assistants = client.beta.assistants.list()
for assistant in assistants:
    ids.append(assistant.id)
# 清理一下教学环境
for id in ids:
    client.beta.assistants.delete(id)
```

### 2.1、创建一个 Assistant

可以为每个应用，甚至应用中的每个有对话历史的使用场景，创建一个 assistant。

虽然可以用代码创建，也不复杂，例如：

```python
from openai import OpenAI

# 初始化 OpenAI 服务
client = OpenAI()

# 创建助手
assistant = client.beta.assistants.create(
    name="AGIClass Demo",
    instructions="你叫瓜瓜，你是AGI课堂的智能助理。你负责回答与AGI课堂有关的问题。",
    model="gpt-4o",
)
```

但是，更佳做法是，到 [Playground](https://platform.openai.com/playground?mode=assistant) 在线创建，因为：

1. 更方便调整
2. 更方便测试

```python
from openai import OpenAI

# 初始化 OpenAI 服务
client = OpenAI()

# 创建助手
assistant = client.beta.assistants.create(
    name="AGIClass Demo TempLive",
    instructions="你叫瓜瓜，你是AGI课堂的智能助理。你负责回答与AGI课堂有关的问题。",
    model="gpt-4o",
)

print(assistant.id)
```

**Output:**
```
asst_XDrRV6h6cKJ29jxCf5tzlluT
```

### 2.2、样例 Assistant 的配置

Instructions:

```
你叫瓜瓜。你是AGI课堂的助手。你只回答跟AI大模型有关的问题。不要跟学生闲聊。每次回答问题前，你要拆解问题并输出一步一步的思考过程。
```

Functions:

```JSON
{
  "name": "ask_database",
  "description": "Use this function to answer user questions about course schedule. Output should be a fully formed SQL query.",
  "parameters": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "SQL query extracting info to answer the user's question.\nSQL should be written using this database schema:\n\nCREATE TABLE Courses (\n\tid INT AUTO_INCREMENT PRIMARY KEY,\n\tcourse_date DATE NOT NULL,\n\tstart_time TIME NOT NULL,\n\tend_time TIME NOT NULL,\n\tcourse_name VARCHAR(255) NOT NULL,\n\tinstructor VARCHAR(255) NOT NULL\n);\n\nThe query should be returned in plain text, not in JSON.\nThe query should only contain grammars supported by SQLite."
      }
    },
    "required": [
      "query"
    ]
  }
}
```

上传文件:

## 三、代码访问 Assistant

### 3.1、管理 thread

Threads：

1. Threads 里保存的是对话历史，即 messages
2. 一个 assistant 可以有多个 thread
3. 一个 thread 可以有无限条 message
4. 一个用户与 assistant 的多轮对话历史可以维护在一个 thread 里

```python
import json


def show_json(obj):
    """把任意对象用排版美观的 JSON 格式打印出来"""
    print(json.dumps(
        json.loads(obj.model_dump_json()),
        indent=4,
        ensure_ascii=False
    ))
```

```python
from openai import OpenAI
import os

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# 初始化 OpenAI 服务
client = OpenAI()   # openai >= 1.3.0 起，OPENAI_API_KEY 和 OPENAI_BASE_URL 会被默认使用

# 创建 thread
thread = client.beta.threads.create()
show_json(thread)
```

**Output:**
```
{
    "id": "thread_uCIK4JvAtuJJD3g500z34kDS",
    "created_at": 1727181042,
    "metadata": {},
    "object": "thread",
    "tool_resources": {
        "code_interpreter": null,
        "file_search": null
    }
}
```

可以根据需要，自定义 `metadata`，比如创建 thread 时，把 thread 归属的用户信息存入。

```python
thread = client.beta.threads.create(
    metadata={"fullname": "王卓然", "username": "wzr"}
)
show_json(thread)
```

**Output:**
```
{
    "id": "thread_RwAiRg6IR8VwQYSHIkz4qbV7",
    "created_at": 1727181200,
    "metadata": {
        "fullname": "王卓然",
        "username": "wzr"
    },
    "object": "thread",
    "tool_resources": {
        "code_interpreter": null,
        "file_search": null
    }
}
```

Thread ID 如果保存下来，是可以在下次运行时继续对话的。

从 thread ID 获取 thread 对象的代码：

```python
thread = client.beta.threads.retrieve(thread.id)
show_json(thread)
```

**Output:**
```
{
    "id": "thread_RwAiRg6IR8VwQYSHIkz4qbV7",
    "created_at": 1727181200,
    "metadata": {
        "fullname": "王卓然",
        "username": "wzr"
    },
    "object": "thread",
    "tool_resources": {
        "code_interpreter": {
            "file_ids": []
        },
        "file_search": null
    }
}
```

此外，还有：

1. `threads.modify()` 修改 thread 的 `metadata` 和 `tool_resources`
2. `threads.retrieve()` 获取 thread
3. `threads.delete()` 删除 thread。

具体文档参考：https://platform.openai.com/docs/api-reference/threads

### 3.2、给 Threads 添加 Messages

这里的 messages 结构要复杂一些：

1.  不仅有文本，还可以有图片和文件
2.  也有 `metadata`

```python
message = client.beta.threads.messages.create(
    thread_id=thread.id,  # message 必须归属于一个 thread
    role="user",          # 取值是 user 或者 assistant。但 assistant 消息会被自动加入，我们一般不需要自己构造
    content="你都能做什么？",
)
show_json(message)
```

**Output:**
```
{
    "id": "msg_QiGaPZCyExW8nKtgXhSqF3cd",
    "assistant_id": null,
    "attachments": [],
    "completed_at": null,
    "content": [
        {
            "text": {
                "annotations": [],
                "value": "你都能做什么？"
            },
            "type": "text"
        }
    ],
    "created_at": 1727181255,
    "incomplete_at": null,
    "incomplete_details": null,
    "metadata": {},
    "object": "thread.message",
    "role": "user",
    "run_id": null,
    "status": null,
    "thread_id": "thread_RwAiRg6IR8VwQYSHIkz4qbV7"
}
```

还有如下函数：

1. `threads.messages.retrieve()` 获取 message
2. `threads.messages.update()` 更新 message 的 `metadata`
3. `threads.messages.list()` 列出给定 thread 下的所有 messages

具体文档参考：https://platform.openai.com/docs/api-reference/messages

也可以在创建 thread 同时初始化一个 message 列表

```python
thread = client.beta.threads.create(
    messages=[
        {
            "role": "user",
            "content": "你好",
        },
        {
            "role": "assistant",
            "content": "有什么可以帮您？",
        },
        {
            "role": "user",
            "content": "你是谁？",
        },
    ]
)

show_json(thread)  # 显示 thread
print("-----")
show_json(client.beta.threads.messages.list(
    thread.id))  # 显示指定 thread 中的 message 列表
```

**Output:**
```
{
    "id": "thread_bfsb24BRI9xgdFkEC8jD7KdN",
    "created_at": 1727181315,
    "metadata": {},
    "object": "thread",
    "tool_resources": {
        "code_interpreter": null,
        "file_search": null
    }
}
-----
{
    "data": [
        {
            "id": "msg_FK5484kj6ATUKvcO5VffW3aa",
            "assistant_id": null,
            "attachments": [],
            "completed_at": null,
            "content": [
                {
                    "text": {
                        "annotations": [],
                        "value": "你是谁？"
                    },
                    "type": "text"
                }
            ],
            "created_at": 1727181315,
            "incomplete_at": null,
            "incomplete_details": null,
            "metadata": {},
            "object": "thread.message",
            "role": "user",
            "run_id": null,
            "status": null,
            "thread_id": "thread_bfsb24BRI9xgdFkEC8jD7KdN"
        },
        {
            "id": "msg_CTQwkEsa33NpM8Q0M93halia",
            "assistant_id": null,
            "attachments": [],
            "completed_at": null,
            "content": [
                {
                    "text": {
                        "annotations": [],
                        "value": "有什么可以帮您？"
                    },
                    "type": "text"
                }
            ],
            "created_at": 1727181315,
            "incomplete_at": null,
            "incomplete_details": null,
            "metadata": {},
            "object": "thread.message",
            "role": "assistant",
            "run_id": null,
            "status": null,
            "thread_id": "thread_bfsb24BRI9xgdFkEC8jD7KdN"
        },
        {
            "id": "msg_Paitr5C6MLJ7gVsYITTrKlef",
            "assistant_id": null,
            "attachments": [],
            "completed_at": null,
            "content": [
                {
                    "text": {
                        "annotations": [],
                        "value": "你好"
                    },
                    "type": "text"
                }
            ],
            "created_at": 1727181315,
            "incomplete_at": null,
            "incomplete_details": null,
            "metadata": {},
            "object": "thread.message",
            "role": "user",
            "run_id": null,
            "status": null,
            "thread_id": "thread_bfsb24BRI9xgdFkEC8jD7KdN"
        }
    ],
    "object": "list",
    "first_id": "msg_FK5484kj6ATUKvcO5VffW3aa",
    "last_id": "msg_Paitr5C6MLJ7gVsYITTrKlef",
    "has_more": false
}
```

## 3.3、开始 Run

- 用 run 把 assistant 和 thread 关联，进行对话
- 一个 prompt 就是一次 run

### 3.1、直接运行

```python
assistant_id = "asst_psmawyqIV5HrDiwxYAesO4ia"  # 从 Playground 中拷贝

run = client.beta.threads.runs.create_and_poll(
    thread_id=thread.id,
    assistant_id=assistant_id,
)
```

```python
if run.status == 'completed':
    messages = client.beta.threads.messages.list(
        thread_id=thread.id
    )
    show_json(messages)
else:
    print(run.status)
```

**Output:**
```
{
    "data": [
        {
            "id": "msg_dI90Q3SDEvXA55seDIvbSn7U",
            "assistant_id": "asst_psmawyqIV5HrDiwxYAesO4ia",
            "attachments": [],
            "completed_at": null,
            "content": [
                {
                    "text": {
                        "annotations": [],
                        "value": "我是瓜瓜，AGI课堂的智能助理。我可以帮助回答与AGI课堂有关的问题，包括课程安排、内容查询等。如果您有任何问题，请随时告诉我！"
                    },
                    "type": "text"
                }
            ],
            "created_at": 1727181442,
            "incomplete_at": null,
            "incomplete_details": null,
            "metadata": {},
            "object": "thread.message",
            "role": "assistant",
            "run_id": "run_71Eapzff4usAOcKvFManpSJK",
            "status": null,
            "thread_id": "thread_bfsb24BRI9xgdFkEC8jD7KdN"
        },
        {
            "id": "msg_FK5484kj6ATUKvcO5VffW3aa",
            "assistant_id": null,
            "attachments": [],
            "completed_at": null,
            "content": [
                {
                    "text": {
                        "annotations": [],
                        "value": "你是谁？"
                    },
                    "type": "text"
                }
            ],
            "created_at": 1727181315,
            "incomplete_at": null,
            "incomplete_details": null,
            "metadata": {},
            "object": "thread.message",
            "role": "user",
            "run_id": null,
            "status": null,
            "thread_id": "thread_bfsb24BRI9xgdFkEC8jD7KdN"
        },
        {
            "id": "msg_CTQwkEsa33NpM8Q0M93halia",
            "assistant_id": null,
            "attachments": [],
            "completed_at": null,
            "content": [
                {
                    "text": {
                        "annotations": [],
                        "value": "有什么可以帮您？"
                    },
                    "type": "text"
                }
            ],
            "created_at": 1727181315,
            "incomplete_at": null,
            "incomplete_details": null,
            "metadata": {},
            "object": "thread.message",
            "role": "assistant",
            "run_id": null,
            "status": null,
            "thread_id": "thread_bfsb24BRI9xgdFkEC8jD7KdN"
        },
        {
            "id": "msg_Paitr5C6MLJ7gVsYITTrKlef",
            "assistant_id": null,
            "attachments": [],
            "completed_at": null,
            "content": [
                {
                    "text": {
                        "annotations": [],
                        "value": "你好"
                    },
                    "type": "text"
                }
            ],
            "created_at": 1727181315,
            "incomplete_at": null,
            "incomplete_details": null,
            "metadata": {},
            "object": "thread.message",
            "role": "user",
            "run_id": null,
            "status": null,
            "thread_id": "thread_bfsb24BRI9xgdFkEC8jD7KdN"
        }
    ],
    "object": "list",
    "first_id": "msg_dI90Q3SDEvXA55seDIvbSn7U",
    "last_id": "msg_Paitr5C6MLJ7gVsYITTrKlef",
    "has_more": false
}
```

还有如下函数：

1. `threads.runs.list()` 列出 thread 归属的 run
2. `threads.runs.retrieve()` 获取 run
3. `threads.runs.update()` 修改 run 的 metadata
4. `threads.runs.cancel()` 取消 `in_progress` 状态的 run

具体文档参考：https://platform.openai.com/docs/api-reference/runs

### 3.2、Run 的状态（选）

Run 的底层是个异步调用，意味着它不等大模型处理完，就返回。我们通过 `run.status` 了解大模型的工作进展情况，来判断下一步该干什么。

`run.status` 有的状态，和状态之间的转移关系如图。

![image](./assets/06-assistants-api/statuses.png)

### 3.3、流式运行

1. 创建回调函数

```python
from typing_extensions import override
from openai import AssistantEventHandler


class EventHandler(AssistantEventHandler):
    @override
    def on_text_created(self, text) -> None:
        """响应输出创建事件"""
        print(f"\nassistant > ", end="", flush=True)

    @override
    def on_text_delta(self, delta, snapshot):
        """响应输出生成的流片段"""
        print(delta.value, end="", flush=True)
```

2. 运行 run

```python
# 添加新一轮的 user message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="你说什么？",
)
# 使用 stream 接口并传入 EventHandler
with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant_id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

**Output:**
```
assistant > 我是瓜瓜，AGI课堂的智能助理。我可以帮助您解答与AGI课堂相关的问题，比如课程安排、内容查询等。如果您有任何问题或需要帮助，请告诉我！
```

> ⚠️ **Note:** 思考： 进一步理解 run 与 thread 的设计

    抛开 Assistants API，假设你要开发任意一个多轮对话的 AI 机器人
    从架构设计的角度，应该怎么维护用户、对话历史、对话引擎、对话服务？

## 四、使用 Tools

### 4.1、创建 Assistant 时声明 Code_Interpreter

如果用代码创建：

```python
assistant = client.beta.assistants.create(
    name="Demo Assistant",
    instructions="你是人工智能助手。你可以通过代码回答很多数学问题。",
    tools=[{"type": "code_interpreter"}],
    model="gpt-4o"
)
```

在回调中加入 code_interpreter 的事件响应

```python
from typing_extensions import override
from openai import AssistantEventHandler


class EventHandler(AssistantEventHandler):
    @override
    def on_text_created(self, text) -> None:
        """响应输出创建事件"""
        print(f"\nassistant > ", end="", flush=True)

    @override
    def on_text_delta(self, delta, snapshot):
        """响应输出生成的流片段"""
        print(delta.value, end="", flush=True)

    @override
    def on_tool_call_created(self, tool_call):
        """响应工具调用"""
        print(f"\nassistant > {tool_call.type}\n", flush=True)

    @override
    def on_tool_call_delta(self, delta, snapshot):
        """响应工具调用的流片段"""
        if delta.type == 'code_interpreter':
            if delta.code_interpreter.input:
                print(delta.code_interpreter.input, end="", flush=True)
        if delta.code_interpreter.outputs:
            print(f"\n\noutput >", flush=True)
            for output in delta.code_interpreter.outputs:
                if output.type == "logs":
                    print(f"\n{output.logs}", flush=True)
```

发个 Code Interpreter 请求

```python
# 创建 thread
thread = client.beta.threads.create()

# 添加新一轮的 user message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="用代码计算 1234567 的平方根",
)
# 使用 stream 接口并传入 EventHandler
with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant_id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

**Output:**
```
assistant > code_interpreter

import math

# Calculate the square root of 1234567
sqrt_value = math.sqrt(1234567)
sqrt_value
assistant > 1234567 的平方根是约 1111.11。
```

### 4.1.1、Code_Interpreter 操作文件

```python
# 上传文件到 OpenAI
file = client.files.create(
    file=open("mydata.csv", "rb"),
    purpose='assistants'
)

# 创建 assistant
my_assistant = client.beta.assistants.create(
    name="CodeInterpreterWithFileDemo",
    instructions="你是数据分析师，按要求分析数据。",
    model="gpt-4o",
    tools=[{"type": "code_interpreter"}],
    tool_resources={
        "code_interpreter": {
          "file_ids": [file.id]  # 为 code_interpreter 关联文件
        }
    }
)
```

```python
# 创建 thread
thread = client.beta.threads.create()

# 添加新一轮的 user message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="统计csv文件中的总销售额",
)
# 使用 stream 接口并传入 EventHandler
with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=my_assistant.id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

**Output:**
```
assistant > 让我们先读取您上传的CSV文件，并查看其内容以理解数据结构。接着，我会统计出总销售额。
assistant > code_interpreter

import pandas as pd

# 加载用户上传的CSV文件
file_path = '/mnt/data/file-DbKPWWPin0rnhpYAEgtVlYYi'
df = pd.read_csv(file_path)

# 显示数据的前几行以了解文件的结构
df.head(), df.columns
assistant > 从数据的前几行和列名可以看出，CSV文件包含以下列：

- `Product Name`: 产品名称
- `Unit Price`: 单价
- `Quantity Sold`: 销售数量

我们可以通过计算 `Unit Price` 和 `Quantity Sold` 的乘积来求得每个产品的销售额，然后求和以得到总销售额。让我们来计算一下。# 计算每个产品的销售额
df['Total Sales'] = df['Unit Price'] * df['Quantity Sold']

# 计算总销售额
total_sales = df['Total Sales'].sum()
total_sales
assistant > 根据数据计算，总销售额为 \(182,100\) 元。

如果您需要进一步的分析或有其他问题，请告诉我！
```

### 4.2、创建 Assistant 时声明 Function

```python
assistant = client.beta.assistants.create(
  instructions="你叫瓜瓜。你是AGI课堂的助手。你只回答跟AI大模型有关的问题。不要跟学生闲聊。每次回答问题前，你要拆解问题并输出一步一步的思考过程。",
  model="gpt-4o",
  tools=[{
    "type": "function",
    "function": {
      "name": "course_info",
      "description": "用于查看具体课程信息，包括时间表，题目，讲师，等等。Function输入必须是一个合法的SQL表达式。",
      "parameters": {
        "type": "object",
        "properties": {
          "query": {
            "type": "string",
            "description": "SQL query extracting info to answer the user's question.\nSQL should be written using this database schema:\n\nCREATE TABLE Courses (\n\tid INT AUTO_INCREMENT PRIMARY KEY,\n\tcourse_date DATE NOT NULL,\n\tstart_time TIME NOT NULL,\n\tend_time TIME NOT NULL,\n\tcourse_name VARCHAR(255) NOT NULL,\n\tinstructor VARCHAR(255) NOT NULL\n);\n\nThe query should be returned in plain text, not in JSON.\nThe query should only contain grammars supported by SQLite."
          }
        },
        "required": [
          "query"
        ]
      }
    }
  }]
)
```

创建一个 Function

```python
# 定义本地函数和数据库

import sqlite3

# 创建数据库连接
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# 创建orders表
cursor.execute("""
CREATE TABLE Courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL
);
""")

# 插入5条明确的模拟记录
timetable = [
    ('2024-01-23', '20:00', '22:00', '大模型应用开发基础', '孙志岗'),
    ('2024-01-25', '20:00', '22:00', 'Prompt Engineering', '孙志岗'),
    ('2024-01-29', '20:00', '22:00', '赠课：软件开发基础概念与环境搭建', '西树'),
    ('2024-02-20', '20:00', '22:00', '从AI编程认知AI', '林晓鑫'),
    ('2024-02-22', '20:00', '22:00', 'Function Calling', '孙志岗'),
    ('2024-02-29', '20:00', '22:00', 'RAG和Embeddings', '王卓然'),
    ('2024-03-05', '20:00', '22:00', 'Assistants API', '王卓然'),
    ('2024-03-07', '20:00', '22:00', 'Semantic Kernel', '王卓然'),
    ('2024-03-14', '20:00', '22:00', 'LangChain', '王卓然'),
    ('2024-03-19', '20:00', '22:00', 'LLM应用开发工具链', '王卓然'),
    ('2024-03-21', '20:00', '22:00', '手撕 AutoGPT', '王卓然'),
    ('2024-03-26', '20:00', '22:00', '模型微调（上）', '王卓然'),
    ('2024-03-28', '20:00', '22:00', '模型微调（下）', '王卓然'),
    ('2024-04-09', '20:00', '22:00', '多模态大模型（上）', '多老师'),
    ('2024-04-11', '20:00', '22:00', '多模态大模型（中）', '多老师'),
    ('2024-04-16', '20:00', '22:00', '多模态大模型（下）', '多老师'),
    ('2024-04-18', '20:00', '22:00', 'AI产品部署和交付（上）', '王树冬'),
    ('2024-04-23', '20:00', '22:00', 'AI产品部署和交付（下）', '王树冬'),
    ('2024-04-25', '20:00', '22:00', '抓住大模型时代的创业机遇', '孙志岗'),
    ('2024-05-07', '20:00', '22:00', '产品运营和业务沟通', '孙志岗'),
    ('2024-05-09', '20:00', '22:00', '产品设计', '孙志岗'),
    ('2024-05-14', '20:00', '22:00', '项目方案分析与设计', '王卓然'),
]

for record in timetable:
    cursor.execute('''
    INSERT INTO Courses (course_date, start_time, end_time, course_name, instructor)
    VALUES (?, ?, ?, ?, ?)
    ''', record)

# 提交事务
conn.commit()


def query_database(query):
    cursor.execute(query)
    records = cursor.fetchall()
    return str(records)


# 可以被回调的函数放入此字典
available_functions = {
    "course_info": query_database,
}
```

增加回调事件的响应

```python
from typing_extensions import override
from openai import AssistantEventHandler


class EventHandler(AssistantEventHandler):
    @override
    def on_text_created(self, text) -> None:
        """响应回复创建事件"""
        print(f"\nassistant > ", end="", flush=True)

    @override
    def on_text_delta(self, delta, snapshot):
        """响应输出生成的流片段"""
        print(delta.value, end="", flush=True)

    @override
    def on_tool_call_created(self, tool_call):
        """响应工具调用"""
        print(f"\nassistant > {tool_call.type}\n", flush=True)

    @override
    def on_tool_call_delta(self, delta, snapshot):
        """响应工具调用的流片段"""
        if delta.type == 'code_interpreter':
            if delta.code_interpreter.input:
                print(delta.code_interpreter.input, end="", flush=True)
            if delta.code_interpreter.outputs:
                print(f"\n\noutput >", flush=True)
                for output in delta.code_interpreter.outputs:
                    if output.type == "logs":
                        print(f"\n{output.logs}", flush=True)

    @override
    def on_event(self, event):
        """
        响应 'requires_action' 事件
        """
        if event.event == 'thread.run.requires_action':
            run_id = event.data.id  # 获取 run ID
            self.handle_requires_action(event.data, run_id)

    def handle_requires_action(self, data, run_id):
        tool_outputs = []

        for tool in data.required_action.submit_tool_outputs.tool_calls:
            arguments = json.loads(tool.function.arguments)
            print(
                f"{tool.function.name}({arguments})",
                flush=True
            )
            # 运行 function
            tool_outputs.append({
                "tool_call_id": tool.id,
                "output": available_functions[tool.function.name](
                    **arguments
                )}
            )

        # 提交 function 的结果，并继续运行 run
        self.submit_tool_outputs(tool_outputs, run_id)

    def submit_tool_outputs(self, tool_outputs, run_id):
        """提交function结果，并继续流"""
        with client.beta.threads.runs.submit_tool_outputs_stream(
            thread_id=self.current_run.thread_id,
            run_id=self.current_run.id,
            tool_outputs=tool_outputs,
            event_handler=EventHandler(),
        ) as stream:
            stream.until_done()
```

```python
# 创建 thread
thread = client.beta.threads.create()

# 添加 user message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="平均一堂课长时间",
)
# 使用 stream 接口并传入 EventHandler
with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant.id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

**Output:**
```
assistant > 为了计算一堂课的平均时长，我需要知道每堂课的开始和结束时间。接下来我会执行以下步骤：

1. 获取所有课程的开始时间和结束时间。
2. 计算每堂课的时长。
3. 计算这些时长的平均值。

首先，拆解问题并形成查询语句，以获取课程信息。

## 步骤：
1. 编写SQL查询来获取所有课程的开始时间和结束时间。

```sql
SELECT start_time, end_time FROM Courses;
```

2. 使用获取的数据来计算每堂课的时长。
3. 计算这些时长的平均值。

现在我将执行第1步，检索所有课程的开始和结束时间。
assistant > function

course_info({'query': 'SELECT start_time, end_time FROM Courses;'})

assistant > 通过获取的数据，可以看到所有课程的开始时间和结束时间都很一致（从20:00到22:00）。接下来，计算每堂课的时长及其平均值。

1. 一堂课的时长：
   - 结束时间：22:00
   - 开始时间：20:00
   - 时长 = 22:00 - 20:00 = 2小时

2. 由于所有课程的时长都一样，所以平均时长也就是每堂课的时长，即：
   - 平均时长 = 2小时

因此，平均一堂课的时长为2小时。
```

### 4.3、两个无依赖的 function 会在一次请求中一起被调用

```python
# 创建 thread
thread = client.beta.threads.create()

# 添加 user message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="王卓然上几堂课，比孙志岗多上几堂",
)
# 使用 stream 接口并传入 EventHandler
with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant.id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

**Output:**
```
assistant > 好的，首先我们需要确认每位讲师的授课次数。以下是具体的步骤：

1. 查询王卓然的授课次数。
2. 查询孙志岗的授课次数。
3. 计算两者的授课次数差异。

以下是实现这些步骤的SQL查询：

```sql
SELECT COUNT(*) FROM Courses WHERE instructor = '王卓然';
SELECT COUNT(*) FROM Courses WHERE instructor = '孙志岗';
```

然后我们会根据查询结果计算差异。现在我将执行这些查询。
assistant > function


assistant > function

course_info({'query': "SELECT COUNT(*) as count FROM Courses WHERE instructor = '王卓然';"})
course_info({'query': "SELECT COUNT(*) as count FROM Courses WHERE instructor = '孙志岗';"})

assistant > 根据查询结果：

- 王卓然上了9堂课。
- 孙志岗上了6堂课。

因此，王卓然比孙志岗多上了 \(9 - 6 = 3\) 堂课。
```

> ℹ️ **Info:** 更多流中的 Event： https://platform.openai.com/docs/api-reference/assistants-streaming/events

## 五、内置的 RAG 功能

### 5.1、创建 Vector Store，上传文件

- 通过代码创建 Vector Store

```python
vector_store = client.beta.vector_stores.create(
  name="MyVectorStore"
)
```

```

```

- 通过代码上传文件到 OpenAI 的存储空间

```python
file = client.files.create(
  file=open("agiclass_intro.pdf", "rb"),
  purpose="assistants"
)
```

- 通过代码将文件添加到 Vector Store

```python
vector_store_file = client.beta.vector_stores.files.create(
  vector_store_id=vector_store.id,
  file_id=file.id
)
```

- 批量上传文件到 Vector Store

```python
files = ['file1.pdf','file2.pdf']

file_batch = client.beta.vector_stores.file_batches.upload_and_poll(
    vector_store_id=vector_store.id,
    files=[open(filename, "rb") for filename in files]
)
```

Vector store 和 vector store file 也有对应的 `list`, `retrieve`, 和 `delete` 等操作。

具体文档参考：

- Vector store: https://platform.openai.com/docs/api-reference/vector-stores
- Vector store file: https://platform.openai.com/docs/api-reference/vector-stores-files
- Vector store file 批量操作: https://platform.openai.com/docs/api-reference/vector-stores-file-batches

关于文件操作，还有如下函数：

1. `client.files.list()` 列出所有文件
2. `client.files.retrieve()` 获取文件对象
3. `client.files.delete()` 删除文件
4. `client.files.content()` 读取文件内容

具体文档参考：https://platform.openai.com/docs/api-reference/files

### 5.2、创建 Assistant 时声明 RAG 能力

RAG 实际被当作一种 tool

```python
assistant = client.beta.assistants.create(
  instructions="你是个问答机器人，你根据给定的知识回答用户问题。",
  model="gpt-4o",
  tools=[{"type": "file_search"}],
)
```

指定检索源

```python
assistant = client.beta.assistants.update(
  assistant_id=assistant.id,
  tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}},
)
```

试试 RAG 请求

```python
# 创建 thread
thread = client.beta.threads.create()

# 添加 user message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content="AI⼤模型全栈⼯程师适合哪些人",
)
# 使用 stream 接口并传入 EventHandler
with client.beta.threads.runs.stream(
    thread_id=thread.id,
    assistant_id=assistant_id,
    event_handler=EventHandler(),
) as stream:
    stream.until_done()
```

**Output:**
```
assistant > file_search


assistant > AI大模型全栈工程师适合以下几类人群：

1. **自己干**：有能力独立完成AI应用从策划、开发到落地的全过程，包括商业分析、需求分析、产品设计、开发、测试、市场推广和运营等。这类人通常懂至少一门编程语言，并有过真实项目开发经验，如软件开发工程师、高级工程师、技术总监、研发经理、架构师、测试工程师等。

2. **合伙干**：领导或者配合懂AI技术的人，一起完成AI应用从策划、开发到落地的全过程。这类人可能不懂编程，但可以是产品经理、需求分析师、设计师、运营、创业者、老板、解决方案工程师、项目经理、市场、销售等。如果能善用AI学习编程、辅助编程，也可以向“自己干”迈进【4:0†source】【4:1†source】。
```

### 5.3 内置的 RAG 是怎么实现的

[官方原文](https://platform.openai.com/docs/assistants/tools/file-search/how-it-works)

The file_search tool implements several retrieval best practices out of the box to help you extract the right data from your files and augment the model’s responses. The file_search tool:

- Rewrites user queries to optimize them for search. (面向检索的 Query 改写)
- Breaks down complex user queries into multiple searches it can run in parallel.（复杂 Query 拆成多个，并行执行）
- Runs both keyword and semantic searches across both assistant and thread vector stores.（关键字与向量混合检索）
- Reranks search results to pick the most relevant ones before generating the final response.（检索后排序）

默认配置：

- Chunk size: 800 tokens
- Chunk overlap: 400 tokens
- Embedding model: text-embedding-3-large at 256 dimensions
- Maximum number of chunks added to context: 20 (could be fewer)

以上配置可以通过 [`chunking_strategy`](https://platform.openai.com/docs/api-reference/vector-stores-files/createFile#vector-stores-files-createfile-chunking_strategy) 参数自定义修改。

承诺未来增加：

1. Support for deterministic pre-search filtering using custom metadata.
2. Support for parsing images within documents (including images of charts, graphs, tables etc.)
3. Support for retrievals over structured file formats (like csv or jsonl).
4. Better support for summarization — the tool today is optimized for search queries.

> ⚠️ **Note:** 我们为什么仍然需要了解整个实现过程？

如果不能使用 OpenAI，还是需要手工实现 RAG 流程
了解 RAG 的原理，可以指导你的产品开发（回忆 GitHub Copilot）
用私有知识增强 LLM 的能力，是一个通用的方法论

## 六、多个 Assistants 协作：做个实验

> ✅ **Tip:** 划重点：使用 assistant 的意义之一，是可以隔离不同角色的 instruction 和 function 能力。

我们用多个 Assistants 模拟一场“六顶思维帽”方法的讨论。

```python
hats = {
    "蓝色": "思考过程的控制和组织者。你负责会议的组织、思考过程的概览和总结。"
    + "首先，整个讨论从你开场，你只陈述问题不表达观点。最后，再由你对整个讨论做简短的总结并给出最终方案。",
    "白色": "负责提供客观事实和数据。你需要关注可获得的信息、需要的信息以及如何获取那些还未获得的信息。"
    + "思考“我们有哪些数据？我们还需要哪些信息？”等问题，并提供客观答案。",
    "红色": "代表直觉、情感和直觉反应。不需要解释和辩解你的情感或直觉。"
    + "这是表达未经过滤的情绪和感受的时刻。",
    "黑色": "代表谨慎和批判性思维。你需要指出提案的弱点、风险以及为什么某些事情可能无法按计划进行。"
    + "这不是消极思考，而是为了发现潜在的问题。",
    "黄色": "代表乐观和积极性。你需要探讨提案的价值、好处和可行性。这是寻找和讨论提案中正面方面的时候。",
    "绿色": "代表创造性思维和新想法。鼓励发散思维、提出新的观点、解决方案和创意。这是打破常规和探索新可能性的时候。",
}
```

```python
queue = ["蓝色", "白色", "红色", "黑色", "黄色", "绿色", "蓝色"]
```

```python
from openai import OpenAI
import os
import json

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# 初始化 OpenAI 服务
client = OpenAI()
```

```python
existing_assistants = {}

def create_assistant(color):
    if color in existing_assistants:
        return existing_assistants[color]
    assistant = client.beta.assistants.create(
        name=f"{color}帽子角色",
        instructions=f"我们在进行一场Six Thinking Hats讨论。按{queue}顺序。你的角色是{color}帽子。",
        model="gpt-4o",
    )
    existing_assistants[color] = assistant
    return assistant
```

```python
# 创建 thread
thread = client.beta.threads.create()

topic = "面向非AI背景的程序员群体设计一门AI大语言模型课程，应该包含哪些内容。"

# 添加 user message
message = client.beta.threads.messages.create(
    thread_id=thread.id,
    role="user",
    content=f"讨论话题：{topic}\n\n[开始]\n",
)

for hat in queue:
    assistant = create_assistant(hat)
    with client.beta.threads.runs.stream(
        thread_id=thread.id,
        assistant_id=assistant.id,
        event_handler=EventHandler(),
    ) as stream:
        stream.until_done()
    print()
```

**Output:**
```
assistant > 好的，大家好！欢迎参加我们的Six Thinking Hats讨论。今天，我们的主题是“面向非AI背景的程序员群体设计一门AI大语言模型课程应该包含哪些内容”。

我身为蓝色帽子，负责引导讨论并总结各位的观点。

首先，我们将从白色帽子开始，即焦点在于客观数据和事实。请你们基于已有的知识和数据，讨论这门课程可以包含哪些内容。

assistant > 各位好，我是白色帽子。根据现有的客观数据和事实，我认为这门AI大语言模型课程可以包含以下内容：

1. **基础概念介绍**：简要讲解人工智能和大语言模型的基本概念，以及它们在计算机科学中的位置。这部分内容可以包括：
    - 什么是人工智能和机器学习？
    - 深度学习和神经网络的基础原理。
    - 大语言模型（如GPT-3、BERT）的定义和基本原理。

2. **工具和框架**：介绍一些常用的软件工具和框架，使学员能够动手实践。这部分可以包含：
    - Python编程语言及其在AI开发中的应用。
    - TensorFlow和PyTorch等深度学习框架的基础使用。

3. **数据处理和预处理**：大语言模型训练中数据的重要性，以及常用的处理方法，比如：
    - 数据清洗、数据标注和数据增强的方法。
    - 自然语言处理中的常用技巧，如分词、词性标注、停用词过滤等。

4. **模型训练和优化**：介绍模型训练的流程以及优化的方法，包括：
    - 如何搭建和训练一个简单的神经网络模型。
    - 超参数调优和模型评估的基本方法。

5. **应用场景**：展示大语言模型在实际应用中的场景和案例，比如：
    - 语音识别和文本生成。
    - 自动摘要、情感分析和对话系统等应用。

6. **项目实践**：通过具体的项目案例，使学员能够实际应用所学内容。
    - 从头到尾设计一个简单项目，如构建一个问答系统或文本分类器。

上述内容基于当前的主流做法和课程设置，并结合了非AI背景程序员的学习诉求和基础，意在为他们提供实用且系统的学习路径。

assistant > 各位好，我是红色帽子。在这里，我要表达一下我对这门课程设计的情绪和直觉上的感受。

从我的角度来看，设计这样一门课程首先要考虑到非AI背景的程序员群体，他们可能会有一些焦虑和不安，担心自己无法掌握这些新的和相对复杂的知识。我们需要在课程中加入一些能够提升他们自信心和成就感的内容，让他们感到自己在逐步进步和取得成效。

其次，我觉得这门课程应该尽可能地有趣和互动。AI和大语言模型是非常前沿的技术，很多人在一开始学习时会感到既兴奋又疑惑。我们应该利用这一点，设计一些能够激发他们好奇心和兴趣的课程内容或项目，比如一些与实际生活紧密相关的应用案例，或者是一些能立竿见影的小实验。

另外，我深信提供持续的支持和反馈机制也非常重要。面对复杂的新知识，他们可能会遇到很多瓶颈和挫折感。因此，课程中应设计一些机制让同学们能够在遇到困难时及时获得帮助和指导，比如配备助教，设置讨论区或者定期举行答疑会等。

总之，我觉得这门课程不仅要传授知识，更要注重学员的情感体验和心理感受，从而确保他们既能学到知识，又能在学习过程中保持积极和愉快的心态。

assistant > 大家好，我是黑色帽子。作为黑色帽子的角色，我将主要关注这门课程设计中的潜在问题和挑战。

1. **学员背景差异**：非AI背景的程序员群体可能在数学基础和机器学习理论方面差异很大。对于那些对数学不太熟悉的学员，复杂的数学概念和公式可能会成为学习的障碍。因此，如何平衡课程内容的难度，使它既不过于简单也不过于复杂，是一个需要考虑的问题。

2. **时间和精力投入**：学习AI大语言模型需要投入相当的时间和精力。非AI背景的程序员在工作之余可能没有足够的时间或精力来完整学习课程各个部分，可能导致学生半途而废。因此，如何设计课时，使得课程既能系统传授知识，又能让学员在短时间内看到学习成效，是一个挑战。

3. **实践操作难度**：AI课程往往需要大量实践操作，但对于没有AI背景的程序员来说，搭建实验环境、理解和调试代码可能会遇到很多问题。如果这些问题不能及时得到解决，可能会挫败学员的信心，导致学习兴趣下降。

4. **资源限制**：AI模型的训练通常需要强大的计算资源，而普通程序员可能没有专业的硬件设备或云资源来支持复杂的模型训练。如果课程要求学员使用高级资源，可能会导致部分学员无法完成课程要求的练习。

5. **未来的实际应用**：虽然学习大语言模型非常具有前景，但非AI背景程序员在实际工作中是否能够真正应用这些技术可能是个问题。如果课程中的知识和技能不能直接应用于他们的日常工作，学员可能会觉得这门课程的实用性不高。

以上是我认为我们在设计这门课程时需要加以重视的潜在问题和挑战。依照这些挑战，我们应采取相应的对策来优化课程设计，确保这门课程能够真正有效地帮助非AI背景的程序员掌握大语言模型的相关知识和技能。

assistant > 大家好，我是黄色帽子。接下来，我将从积极和建设性的角度来探讨这门课程设计的优势和潜力。

1. **填补知识空白**：这门课程面向非AI背景的程序员群体，能够有效地缩小他们与AI领域之间的知识鸿沟，使他们掌握大语言模型的基础知识和实践技能，从而提升他们的职业竞争力。

2. **多样化的职业机会**：通过学习大语言模型相关内容，学生将获得更广泛的技能，能够在数据科学、人工智能、自然语言处理等领域找到更多的职业机会，显著提高他们在职场上的核心竞争力。

3. **提升创新能力**：大语言模型是前沿技术，学习它不仅能增加知识储备，还能激发程序员们的创新思维。他们可以把新学到的AI知识应用到现有项目中，甚至设计出更多跨越传统边界的应用和服务，推动技术进步。

4. **实际项目经验**：课程设计中包含项目实践环节，学生能够在真实环境中应用所学知识，积累实际项目经验。这种实践将大大增强学习效果，使他们更有自信心去面对真实工作中的AI任务。

5. **社区和资源支持**：作为课程的一部分，学员可以接触到大量的学习资源和社区支持，比如在线论坛、答疑会等。这不仅能降低学习的门槛，还能为他们找到志同道合的伙伴，共同解决学习中遇到的问题，增强归属感。

6. **灵活的学习模式**：我们可以设计多种灵活的学习模式，如线上自学、直播课程、互动练习等，便于学员根据自己的时间安排选择合适的学习方式。这将大大方便非全职学习者，增加课程的普适性和吸引力。

7. **行业认可度**：设计时充分考虑到实际应用和行业需求，使得课程内容具有较高的行业认可度。完成课程后，学员可以得到更具含金量的证书或推荐信，这将提升他们在求职市场上的竞争力。

总之，这门课程正好迎合了非AI背景程序员的需求，可以有效帮助他们跨越AI领域的准入门槛，为他们的职业发展提供新的机会和可能性。这不仅能够增加他们的技术储备和项目经验，还能在职场上带来更多的竞争优势。

assistant > 大家好，我是绿色帽子。现在让我来进行一些创新性的思考，以增加这门课程的吸引力和有效性。

1. **多感官学习**：引入多种教学方法，如视频、动画、互动图表和实操练习。我们可以利用VR或AR技术进行沉浸式学习体验，让学员更加直观地理解复杂概念。

2. **模块化学习**：将课程内容设计成多个独立的小模块，每个模块针对一个具体主题或技能。这样，学员可以根据自己的兴趣和需求选择学习路径，逐步深入，不会感到负担过重。

3. **实时反馈系统**：在课程中加入即时反馈机制，如在编程题目中自动评分的系统，帮助学员及时发现和纠正错误，增强学习效果。

4. **案例驱动教学**：使用实际案例驱动教学，将理论知识与现实应用紧密结合。比如，通过具体的行业案例（如医疗、金融、自动驾驶等）展示大语言模型的应用，使学员了解其现实价值。

5. **跨学科合作**：鼓励学员组成跨学科团队，共同完成项目，可以是数据科学、产品设计、业务分析等不同背景的人一起合作，从多角度丰富对问题的理解和解决方案的设计。

6. **灵活的导师制度**：引入业界专家和学术导师，定期举行线上或线下讲座、答疑和一对一辅导，提升学员的学习体验和知识深度。

7. **AI工具箱**：为学员提供一个“AI工具箱”，其中包括常用的开源代码、工具库、数据集和教程文档，让学员在学习过程中有实用的资源可以利用，提高自主解决问题的能力。

8. **比赛和挑战**：设定一些小型编程比赛、黑客马拉松或项目挑战，激发学员的竞争意识和团队合作精神，并通过奖励机制鼓励他们主动学习和创新。

9. **持续学习通道**：课程结束后，为学员提供继续学习的资源和社群支持，让他们可以在课程之外保持对AI领域的持续关注和研究。比如，建立校友网络、微信群或推出软件更新通知等。

10. **个性化学习路径**：通过数据分析和机器学习算法，识别每位学员的学习偏好和薄弱环节，动态调整学习内容和难度，使其个性化学习体验最大化。

通过这些创新措施，我们不仅能提高学员的学习兴趣和效果，还能让他们在短时间内获得高效且系统的AI大语言模型知识和技能，为未来的职业发展打下坚实的基础。

assistant > 最后，大家好，回到我蓝色帽子的角色。我们在整个讨论过程中，分别从数据与事实、情感与直觉、潜在问题和挑战以及新的可能性等角度对如何设计面向非AI背景的程序员的大语言模型课程进行了深入探讨。

### 总结与下一步行动

1. **课程内容结构（白色帽子）**：
    - **基础概念**：AI和大语言模型的初步介绍。
    - **工具技术**：Python、TensorFlow、PyTorch等实用工具和框架。
    - **数据处理**：数据清洗、标注等基本技能。
    - **模型训练**：从头搭建、训练和评估模型。
    - **应用场景**：实际案例展示大语言模型的实际应用。
    - **项目实践**：从细到难的项目实战体验。

2. **情感与学员体验（红色帽子）**：
    - 尽量设计课程内容有趣互动，增强学员的学习兴趣。
    - 提供持续的支持和反馈机制，解答学习过程中遇到的困难。
    - 通过实际应用项目提升学员的自信心，给予正向反馈。

3. **潜在挑战（黑色帽子）**：
    - 学员背景差异大，需要平衡课程难度。
    - 时间与精力投入可能不足，需优化学习时间。
    - 实际操作难度高，实践中可能遇到硬件和软件的限制。
    - 学员在未来的实际工作中应用这些知识的可行性。

4. **创新与提升点（绿色帽子）**：
    - **多感官和模块化学习**：丰富学习体验，符合不同学习需求。
    - **即时反馈**：帮助学员迅速理解和掌握知识点。
    - **案例驱动教学**：通过现实案例强调课程内容的实际应用价值。
    - **跨学科合作**：鼓励多背景学员组队完成项目，提升综合能力。
    - **导师制度和AI工具箱**：提供强有力的学习资源和支持。
    - **比赛和挑战**：通过竞赛激发学员主动性和团队合作精神。
    - **个性化学习路径**：让学习更加个性化、高效化。

### 下一步行动
- **具体化课程框架**：整合各帽子观点，具体化课程内容和安排，形成一个较为完整的课程大纲。
- **试点测试**：在小范围内进行课程试点，收集反馈并进行优化调整。
- **持续反馈与迭代**：根据学员的反馈和学习效果，定期迭代和更新课程内容，确保课程始终具有前沿性和实用性。

希望通过此次讨论，能够设计出一门既实用又具吸引力的AI大语言模型课程，真正帮助非AI背景的程序员朋友们掌握这门前沿技术，为他们的职业发展提供新的动力和可能性。谢谢大家的参与与贡献！
```

```python
# 清理实验环境
for _, assistant in existing_assistants.items():
    client.beta.assistants.delete(assistant.id)
```

## 总结

![](https://cdn.openai.com/API/docs/images/diagram-assistant.webp)

## 技术选型参考

**GPTs 现状：**

1. 界面不可定制，不能集成进自己的产品
2. 只有 ChatGPT Plus/Team/Enterprise 用户才能访问
3. 未来开发者可以根据使用量获得报酬，北美先开始
4. 承诺会推出 Team/Enterprise 版的组织内部专属 GPTs

**适合使用 Assistants API 的场景：**

1. 定制界面，或和自己的产品集成
2. 需要传大量文件
3. 服务国外用户，或国内 B 端客户
4. 数据保密性要求不高
5. 不差钱

**适合使用原生 API 的场景：**

1. 需要极致调优
2. 追求性价比
3. 服务国外用户，或国内 B 端客户
4. 数据保密性要求不高

**适合使用国产或开源大模型的场景：**

1. 服务国内用户
2. 数据保密性要求高
3. 压缩长期成本
4. 需要极致调优

### 提供类似 Assistants API 的国产模型：

- 百川：https://platform.baichuan-ai.com/docs/assistants-overview
- Minimax：https://platform.minimaxi.com/document/lbYEaWKRCr5f7EVikjFJjSDK?key=6671906aa427f0c8a570166b
- 智谱 GLM-4-AllTools：https://open.bigmodel.cn/dev/api#glm-4-alltools
- 讯飞星火助手：https://www.xfyun.cn/doc/spark/SparkAssistantAPI.html
- 阿里通义千问：https://help.aliyun.com/zh/model-studio/developer-reference/overview

## 课间的思考题

> ℹ️ **Info:** 思考： 进一步理解 run 与 thread 的设计

    抛开 Assistants API，假设你要开发任意一个多轮对话的 AI 机器人
    从架构设计的角度，应该怎么维护用户、对话历史、对话引擎、对话服务？

![image](./assets/06-assistants-api/dialog_system.png)

## 其它

小知识点：

1. Annotations 获取参考资料地址：https://platform.openai.com/docs/assistants/how-it-works/message-annotations
2. 创建 thread 时立即执行：https://platform.openai.com/docs/api-reference/runs/createThreadAndRun
3. Run 的状态管理 (run steps）: https://platform.openai.com/docs/api-reference/run-steps

官方文档：

1. Guide: https://platform.openai.com/docs/assistants/overview
2. API Reference: https://platform.openai.com/docs/api-reference/assistants

## 作业

实现一个自己 GPT 或 Assistant。