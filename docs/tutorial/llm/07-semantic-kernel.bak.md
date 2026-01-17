# 07 Semantic Kernel.Bak   Index



# 💡 这节课会带给你

1. Semantic Kernel 的特点和基本用法
2. 了解 Semantic Kernel 内置的工具
3. 如何用好 SDK 简化基于 LLM 的应用开发

开始上课！

## 🎓 这节课怎么学

代码能力要求：**中高**，AI/数学基础要求：**无**

1. 有编程基础的同学
   - 关注设计模式，实现细节
2. 没有编程基础的同学
   - 尽量理解 SDK 的概念和价值，尝试体会使用 SDK 前后的差别与意义

## 1、大语言模型开发框架的价值是什么？

所有开发框架（SDK）的核心价值，都是降低开发、维护成本。

大语言模型开发框架的价值，是让开发者可以更方便地开发基于大语言模型的应用。主要提供两类帮助：

1. 第三方能力抽象。比如 LLM、向量数据库、搜索引擎等
2. 常用工具、方案封装
3. 底层实现封装。比如流式接口、超时重连、异步与并行等

好的开发框架，需要具备以下特点：

1. 可靠性、鲁棒性
2. 可维护性高
3. 高内聚、低耦合
4. 易用

举些通俗的例子：

- 与外部功能解依赖
  - 比如可以随意更换 LLM 而不用大量重构代码
  - 更换三方工具也同理
- 经常变的部分要在外部维护而不是放在代码里
  - 比如 Prompt 模板
- 各种环境下都适用
  - 比如线程安全
- 方便调试和测试
  - 至少要能感觉到用了比不用方便吧
  - 合法的输入不会引发框架内部的报错

> ✅ **Tip:** 划重点：选对了框架，事半功倍；反之，事倍功半。

## 2、Semantic Kernel

「 Today's AI models can easily generate messages and images for users. While this is helpful when building a simple chat app, it is not enough to build fully automated AI agents that can automate business processes and empower users to achieve more. To do so, you would need a framework that can take the responses from these models and use them to call existing code to actually do something productive. 」

1. Semantic Kernel 是微软研发的一个开源的，面向大模型的开发框架（SDK）；
2. 它支持你用不同开发语言（C#/Python/Java）基于 OpenAI API/Azure OpenAI API/Huggingface 开发大模型应用；
3. 它封装了一系列开箱即用的工具，包括：提示词模板、链式调用、规划能力等；
4. 它定位在将基于「Prompt」的 AI 能力，与传统的程序开发无缝整合。

_SDK：Software Development Kit，它是一组软件工具和资源的集合，旨在帮助开发者创建、测试、部署和维护应用程序或软件。_

> ℹ️ **Info:** 什么是 SDK? https://aws.amazon.com/cn/what-is/sdk/

SDK 和 API 的区别是什么? https://aws.amazon.com/cn/compare/the-difference-between-sdk-and-api/

## 2.1、SK 的开发进展

1. C# 版最成熟，已开始 1.10：https://github.com/microsoft/semantic-kernel
2. Python 是 beta 版：https://github.com/microsoft/semantic-kernel
3. Java 版目前单独维护在 Java-V1分支下：https://github.com/microsoft/semantic-kernel/tree/java-v1
4. 文档写得特别好，但追不上代码更新速度：
   - 更多讲解：https://learn.microsoft.com/en-us/semantic-kernel/overview/
   - 更偏实操：https://github.com/microsoft/semantic-kernel/blob/main/python/notebooks/00-getting-started.ipynb
   - API Reference (目前只有 C#): https://learn.microsoft.com/en-us/dotnet/api/microsoft.semantickernel?view=semantic-kernel-dotnet
5. 更多生态：https://github.com/geffzhang/awesome-semantickernel

这里可以了解最新进展：https://learn.microsoft.com/en-us/semantic-kernel/get-started/supported-languages

不同语言之间的概念都是相通的。本课程以 Python 版为例。

## 2.2、SK 的生态位

微软将此技术栈命名为 Copilot Stack。现在官方也常说 Agent Stack。

![SK 的生态位](./assets/07-semantic-kernel.bak//copilot-stack.png)

解释：

- Plugin extensibility: 插件扩展
- Copilots: AI 助手（副驾驶），例如 GitHub Copilot、Office 365 Copilot、Windows Copilot
- AI orchestration: AI 编排，SK 就在这里
- Foundation models: 基础大模型，例如 GPT-4
- AI infrastructure: AI 基础设施，例如 PyTorch、GPU

### 怎么理解这个 **AI 编排**

SK 是个野心勃勃的项目，它希望：

1. 让开发者更容易的把 LLM 的能力集成到应用中，像调用函数一样简单
2. 让 Prompt 构成的「函数」（Semantic Function，见下文）与原生函数之间，可以很方便的互相嵌套调用
3. 让 AI 自动调用本地函数（Native Function）执行相应功能或操作
4. 让开发者开发的 LLM 能力与应用解耦，高度可复用
5. 让开发者能与微软的整个 Copilot 生态紧密结合，互相提供养料

请带着这个视角，逐步体会后面所讲的知识。

> ✅ **Tip:** 使用 SK 的作为 AI 编排器的案例： https://github.com/Azure-Samples/miyagi

## 2.3、SK 基础架构

![SK 的架构](./assets/07-semantic-kernel.bak/mind-and-body-of-semantic-kernel.png)

解释：

- Models and Memory: 类比为大脑
- Connectors: 用来连接各种外部服务，类似驱动程序
- Plugins: 用来连接内部技能
- Triggers and actions: 外部系统的触发器和动作，类比为四肢

**类比：** Semantic Kernel 用 **Kernel** 命名，是因为它确实像个操作系统 kernel，做核心资源调配，各种资源都可以挂在它上。

**说明：** Sematic Kernel 通过 **Kernel** 链接 LLM 与 **Functions**（功能）:

- Semantic Functions：通过 Prompt 实现的 LLM 能力
- Native Functions: 编程语言原生的函数功能

在 SK 中，一组 Function 组成一个技能（Skill/Plugin）。要运行 Skill/Plugin，需要有一个配置和管理的单元，这个组织管理单元就是 Kernel。

Kernel 负责管理底层接口与调用顺序，例如：OpenAI/Azure OpenAI 的授权信息、默认的 LLM 模型选择、对话上下文、技能参数的传递等等。

## 3、环境搭建

1. 安装 Python 3.x：https://www.python.org/downloads/
2. 安装 SK 包：`pip install semantic-kernel`
3. 在项目目录创建 .env 文件，添加以下内容：

```bash
# .env
OPENAI_API_KEY=""
OPENAI_BASE_URL=""
AZURE_OPENAI_DEPLOYMENT_NAME=""
AZURE_OPENAI_ENDPOINT=""
AZURE_OPENAI_API_KEY=""
```

OpenAI 和 Azure，配置好一个就行。

```bash
#!pip install semantic-kernel==0.9.6b1
```

```bash
#!pip install --upgrade pydantic
```

## 3.1、Hello, World!

这是一个简单示例。

第一段代码是初始化。后面所有代码都要在执行过这段代码后，才能执行。

```python
import os
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion


# 加载 .env 到环境变量
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# 创建 semantic kernel
kernel = sk.Kernel()

# 配置 OpenAI 服务。OPENAI_BASE_URL 会被自动加载生效
api_key = os.getenv('OPENAI_API_KEY')
service_id = "default"

service = OpenAIChatCompletion(
        service_id=service_id, 
        ai_model_id="gpt-3.5-turbo-1106", 
        api_key=api_key
    )
# 将 LLM 服务添加到 kernel 中
kernel.add_service(
    service
)
```

Prompt 调用大模型，被当做一个 **Semantic Function** （下文详述）

```python
# 定义 semantic function

joke_function = kernel.add_function(
    function_name="joke", # function 名字，必填
    plugin_name="MyDemoPlugin", # function 所属的 plugin，必填
    prompt="讲个笑话" # prompt，必填
)

# 运行 function 看结果
result = await kernel.invoke(joke_function)
print(result)
```

**Output:**
```
为什么猫咪不喜欢打扑克牌？
因为他们总是被抓住！
```

**注意**：以上代码是在 Jupyter 笔记运行的形式，如果本地运行，请参考以下形式

```python
import asyncio

async def run_function(*args):
    return await kernel.invoke(*args)

result = asyncio.run(
    run_function(joke_function)
)
```

> ✅ **Tip:** 划重点：
用我们熟悉的操作系统来类比，可以更好地理解 SK。

启动操作系统：kernel = sk.Kernel()
安装驱动程序：kernel.add_service()
安装应用程序：func = kernel.add_function()
运行应用程序：kernel.invoke(func...)

基于 SK 开发的主要工作是写「应用程序」，也就是 Plugins（见下文）

### 3.2、Prompt 模板

```python
from semantic_kernel.prompt_template.prompt_template_config import PromptTemplateConfig
from semantic_kernel.prompt_template.input_variable import InputVariable
from semantic_kernel.functions import KernelArguments

# 获取当前默认设定
req_settings = kernel.get_service(service_id).get_prompt_execution_settings_class()(service_id=service_id)

# 定义 Prompt 模板 
# 模板中，变量以 {{$变量名}} 表示
prompt_template_config = PromptTemplateConfig(
    template="讲个关于{{$topic}}的笑话",
    description="Generate a joke about a specific topic",
    execution_settings={service_id: req_settings},
    input_variables=[
        InputVariable(name="topic", description="The topic", is_required=True),
    ],
)

# 注册 function
topical_joke_function = kernel.add_function(
    function_name="topical_joke",
    plugin_name="MyDemoPlugin",
    prompt_template_config=prompt_template_config,
)
```

```python
# 运行 function 看结果
result = await kernel.invoke(
    topical_joke_function, 
    KernelArguments(topic="小明") # 传入参数
)
print(result)
```

**Output:**
```
小明去参加一个面试，面试官问他：“你有什么特长吗？”
小明说：“我可以一口气说完整个《三国演义》。”
面试官很惊讶地问：“真的吗？那你来试试看。”
小明开始：“刘备、关羽、张飞三人结义，桃园三结义……”
面试官打断他：“好了好了，我相信你了，你可以停下来了。”
小明笑着说：“我还没说到赤壁之战呢！”
```

### 3.3、Semantic Functions

Semantic Functions 是纯用数据（Prompt + 配置）定义的，不需要编写任何代码。所以它与编程语言无关，可以被任何编程语言调用。

### 3.3.1、持久化存储

我们可以将 semantic function 与源代码分离存储。这样更易于维护与复用。

一个典型的 semantic function 包含两个文件：

- skprompt.txt: 存放 prompt，可以包含参数，还可以调用其它函数
- config.json: 存放配置，包括函数功能，参数的数据类型，以及调用大模型时的参数

举例：根据用户的自然语言指示，生成 SQL 查询

### skprompt.txt

### config.json

说明：

- `type` 只有 `"completion"` 和 `"embedding"` 两种

上面两个文件都在 [demo/MyPlugins/Text2SQL/](demo/MyPlugins/Text2SQL/) 目录下。

### 3.3.2、导入 Semantic Functions

```python
# 加载 semantic function。注意目录结构
my_plugins = kernel.add_plugin(parent_directory="./demo", plugin_name="MyPlugins")

func = my_plugins["Text2SQL"]

# 运行
result = await kernel.invoke(
    func,
    KernelArguments(input="2024年4月有哪些课") ,
)
print(result)
```

**Output:**
```
SELECT * FROM Courses WHERE course_date BETWEEN '2024-04-01' AND '2024-04-30';
```

### 3.4、多个输入变量

例如我们要维护一个多轮对话，通过 request 和 history 两个变量分别存储 当前输入 和 对话历史

```python
prompt = """对话历史如下:
{{$history}}
---
User: {{$request}}
Assistant:  """

# 定义 Prompt 模板 
# 模板中，变量以 {{$变量名}} 表示
prompt_template_config = PromptTemplateConfig(
    template=prompt,
    description="Multi-turn dialogue",
    execution_settings={service_id: req_settings},
    input_variables=[
        InputVariable(name="request", description="The user input", is_required=True),
        InputVariable(name="history", description="The dialogue history", is_required=True),
    ],
)

# 注册 function
chat = kernel.add_function(
    function_name="chat",
    plugin_name="MyDemoPlugin",
    prompt_template_config=prompt_template_config,
)
```

> ⚠️ **Note:** 注意：实际开发中，将 Prompt 模板以文件形式存储更容易维护。

```python
from semantic_kernel.contents import ChatHistory

chat_history = ChatHistory()
chat_history.add_system_message("You are a helpful chatbot who is good at answering user's questions.")

while True:
    request = input("User > ").strip()
    if not request:
        break
    result = await kernel.invoke(
        chat,
        KernelArguments(
            request=request,
            history=chat_history
        ),
    )
    print(f"Assistant > {result}")
    chat_history.add_user_message(request)
    chat_history.add_assistant_message(str(result))
```

**Output:**
```
User >  我叫王卓然
Assistant > 你好，王卓然！有什么我可以帮助你的吗？
User >  我是谁
Assistant > 你是王卓然。有什么我可以帮助你的吗？
User >
User >
```

### 3.5、Native Functions

用编程语言写的函数，如果用 SK 的 Native Function 方式定义，就能纳入到 SK 的编排体系，可以被 Planner、其它 Plugin 调用。

下面，写一个查询数据库的函数。

这个函数名是 `query_database`。输入为一个 SQL 表达式

```python
from semantic_kernel.functions import kernel_function

class DBConnectorPlugin:
    def __init__(self, db_cursor):
        self.db_cursor = db_cursor

    @kernel_function(
        description="查询数据库",  # function 描述
        name="query_database",  # function 名字
    )
    def exec(self, sql_exp: str) -> str:
        self.db_cursor.execute(sql_exp)
        records = cursor.fetchall()
        return str(records)
```

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
```

```python
# 加载 native function
db_connector = kernel.add_plugin(DBConnectorPlugin(cursor), "DBConnectorPlugin")

# 看结果
result = await kernel.invoke(
    db_connector["query_database"],
    KernelArguments(
        sql_exp="SELECT COUNT(*) as count FROM Courses WHERE instructor = '王卓然'"
    )
)

print(result)
```

**Output:**
```
[(9,)]
```

> ✅ **Tip:** 在 SK 中，Semantic Function 和 Native Function 被 Kernel 平等对待。

**注意**: 另一种 native function 的调用方法，可以写成下述形式。但上面的形式更符合 SK 的设计理念。

```python
result = await db_connector["query_database"](
    kernel, sql_exp="SELECT COUNT(*) as count FROM Courses WHERE instructor = '王卓然'"
)
print(result)
```

**Output:**
```
[(9,)]
```

### 3.5.1、函数参数 Annotation

我们可以通过 Python 的 typing 库中的 Annotated 对象标识每个参数的类型和含义，以便未来在 agent 中使用

```python
from typing import Annotated

class DBConnectorPlugin:
    def __init__(self, db_cursor):
        self.db_cursor = db_cursor

    @kernel_function(
        description="查询数据库",  # function 描述
        name="query_database",  # function 名字
    )
    def exec(
            self, 
            sql_exp: Annotated[str, "SQL查询表达式"]
        ) -> Annotated[str, "数据库查询结果"]:
        self.db_cursor.execute(sql_exp)
        records = cursor.fetchall()
        return str(records)
```

### 3.6、Plugins

简单说，plugin 就是一组函数的集合。也可以理解为 namespace。它可以包含两种函数：

- Semantic Functions - 语义函数，本质是 Prompt Engineering
- Native Functions - 原生函数，将本地代码功能注册在 Kernel 中

值得一提的是，SK 的 plugin 会和 ChatGPT、Bing、Microsoft 365 通用。「很快」你用 SK 写的 plugin 就可以在这些平台上无缝使用了。这些平台上的 plugin 也可以通过 SK 被你调用。

> ⚠️ **Note:** 注意：Plugins 最初命名为 Skills，后来改为 Plugins。如果文档中还有「Skill」遗留。见到后，就知道两者是一回事就好。

回顾微软的设计理念：应用通过 SK 调用 Plugins 完成各种任务

![image](./assets/07-semantic-kernel.bak/cross-platform-plugins.png)

### 3.6.1、内置 Plugins

SK 内置了若干好用的 plugin

加载方法：

```python
from semantic_kernel.core_plugins import <PluginName>
```

它们是：

- [`ConversationSummaryPlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/conversation_summary_plugin.py) - 生成对话的摘要
- [`HttpPlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/http_plugin.py) - 发出 HTTP 请求，支持 GET、POST、PUT 和 DELETE
- [`MathPlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/math_plugin.py) - 加法和减法计算
- [`TextMemoryPlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/text_memory_plugin.py) - 保存文本到 memory 中，可以对其做向量检索
- [`TextPlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/text_plugin.py) - 把文本全部转为大写或小写，去掉头尾的空格（trim）
- [`TimePlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/time_plugin.py) - 获取当前时间及用多种格式获取时间参数
- [`WaitPlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/wait_plugin.py) - 等待指定的时间
- [`WebSearchEnginePlugin`](https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/core_plugins/web_search_engine_plugin.py) - 在互联网上搜索给定的文本
  ) - 在互联网上搜索给定的文本

## 4、函数的嵌套调用

### 4.1、Semantic Function 嵌套调用

SK 允许在 Prompt 模板中直接调用一个函数

```python
translate_prompt = """
将中文词'{{$chinese}}'翻译为日语
直接给出一个翻译结果，不要评论。
尽可能用Hanji表示。
"""
```

```python
joke_prompt = """
'{{$input}}'的日语是：{{MyDemoPlugin.translate $input}}
根据以上词汇在中日文中的语义差异，讲一个笑话。
"""
```

```python
import os
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion


# 加载 .env 到环境变量
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# 创建 semantic kernel
kernel = sk.Kernel()

# 配置 OpenAI 服务。OPENAI_BASE_URL 会被自动加载生效
api_key = os.getenv('OPENAI_API_KEY')
service_id = "default"

# 将 LLM 服务添加到 kernel 中
kernel.add_service(
    OpenAIChatCompletion(
        service_id=service_id, 
        ai_model_id="gpt-3.5-turbo-1106", 
        api_key=api_key
    ),
)
```

```python
from semantic_kernel.prompt_template.prompt_template_config import PromptTemplateConfig
from semantic_kernel.prompt_template.input_variable import InputVariable
from semantic_kernel.functions import KernelArguments

# 获取当前默认设定
req_settings = kernel.get_service(service_id).get_prompt_execution_settings_class()(service_id=service_id)

trans_prompt_template_config = PromptTemplateConfig(
    template=translate_prompt,
    description="Translate Chinese to Japanese",
    execution_settings={service_id: req_settings},
    input_variables=[
        InputVariable(name="chinese", description="The source", is_required=True),
    ],
)

joke_prompt_template_config = PromptTemplateConfig(
    template=joke_prompt,
    description="Generate a joke about a specific topic",
    execution_settings={service_id: req_settings},
    input_variables=[
        InputVariable(name="input", description="The topic", is_required=True),
    ],
)

translate_function = kernel.add_function(
    function_name="translate",
    plugin_name="MyDemoPlugin",
    prompt_template_config=trans_prompt_template_config,
)

joke_function = kernel.add_function(
    function_name="joke",
    plugin_name="MyDemoPlugin",
    prompt_template_config=joke_prompt_template_config,
)
```

```python
result = await kernel.invoke(
    joke_function,
    KernelArguments(
        input="信件"
    )
)

print(result)
```

**Output:**
```
有一天，小明收到了一封日本朋友寄来的信件。他兴奋地打开一看，却发现里面只有一张空白纸。他有些疑惑地问日本朋友：“你寄给我的‘信件’怎么只有一张空白纸？”
日本朋友笑着回答：“因为在日语中，‘信件’就是‘手紙’啊！”
```

> ✅ **Tip:** 在 Prompt 模板中直接调用 Native Function 也可以。

```python
prompt = """
已知，数据库形式为
CREATE TABLE Courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    instructor VARCHAR(255) NOT NULL
);

用自然语言解释用户的SQL查询的意图和查询结果

用户输入：{{$input}}

查询结果：{{DBConnectorPlugin.query_database $input}}
"""
```

```python
# 加载 native function
kernel.add_plugin(DBConnectorPlugin(cursor), "DBConnectorPlugin")


prompt_template_config = PromptTemplateConfig(
    template=prompt,
    description="查询数据库",
    execution_settings={service_id: req_settings},
    input_variables=[
        InputVariable(name="input", description="The user query", is_required=True),
    ],
)

db_query_function = kernel.add_function(
    function_name="db_query",
    plugin_name="MyDemoPlugin",
    prompt_template_config=prompt_template_config,
)

result = await kernel.invoke(
    db_query_function,
    KernelArguments(
        input="SELECT COUNT(*) as count FROM Courses WHERE instructor = '王卓然'"
    )
)

print(result)
```

**Output:**
```
用户的SQL查询意图是统计数据库中由王卓然教授的课程数量。查询结果显示数据库中有9门由王卓然教授的课程。
```

## 5、Memory

SK 中把向量数据库的操作封装在 `Memory` 中。

SK 的 memory 使用非常简单：

1. 用 `kernel.add_service()` 添加一个文本向量生成服务
2. 用 `kernel.add_plugin()` 添加一个连接向量数据库的
3. 用 `memory.save_information()` 保存信息到 memory store
4. 用 `memory.search()` 搜索信息

使用 ChatALL 的 README.md 做数据，使用内存作为 memory store，我们演示下基于文档对话。

### 5.1、初始化 Embedding

```python
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion, OpenAITextEmbedding
import os

# 加载 .env 到环境变量
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# 创建 semantic kernel
kernel = sk.Kernel()

# 配置 OpenAI 服务。OPENAI_BASE_URL 会被自动加载生效
api_key = os.getenv('OPENAI_API_KEY')
service_id = "default"

llm_service = OpenAIChatCompletion(
    service_id=service_id, 
    ai_model_id="gpt-3.5-turbo-1106", 
    api_key=api_key
)

# 将 LLM 服务添加到 kernel 中
kernel.add_service(llm_service)

embedding_gen = OpenAITextEmbedding(
    ai_model_id="text-embedding-ada-002", 
    api_key=api_key
)
# 将 Embedding 服务添加到 kernel 中
kernel.add_service(embedding_gen)
```

```python
from semantic_kernel.core_plugins.text_memory_plugin import TextMemoryPlugin
from semantic_kernel.memory.semantic_text_memory import SemanticTextMemory
from semantic_kernel.memory.volatile_memory_store import VolatileMemoryStore

# 创建一个（内存）向量数据库
memory = SemanticTextMemory(storage=VolatileMemoryStore(), embeddings_generator=embedding_gen)

# 添加一个连接向量数据库的 Plugin
kernel.add_plugin(TextMemoryPlugin(memory), "TextMemoryPlugin")
```

**Output:**
```
KernelPlugin(name='TextMemoryPlugin', description=None, functions={'recall': KernelFunctionFromMethod(metadata=KernelFunctionMetadata(name='recall', plugin_name='TextMemoryPlugin', description='Recall a fact from the long term memory', parameters=[KernelParameterMetadata(name='ask', description='The information to retrieve', default_value=None, type_='str', is_required=True, type_object=<class 'str'>), KernelParameterMetadata(name='collection', description='The collection to search for information.', default_value='generic', type_='str', is_required=False, type_object=<class 'str'>), KernelParameterMetadata(name='relevance', description='The relevance score, from 0.0 to 1.0; 1.0 means perfect match', default_value=0.75, type_='float', is_required=False, type_object=<class 'float'>), KernelParameterMetadata(name='limit', description='The maximum number of relevant memories to recall.', default_value=1, type_='int', is_required=False, type_object=<class 'int'>)], is_prompt=False, is_asynchronous=True, return_parameter=KernelParameterMetadata(name='return', description='', default_value=None, type_='str', is_required=True, type_object=None)), method=<bound method TextMemoryPlugin.recall of TextMemoryPlugin(memory=SemanticTextMemory())>, stream_method=None), 'save': KernelFunctionFromMethod(metadata=KernelFunctionMetadata(name='save', plugin_name='TextMemoryPlugin', description='Save information to semantic memory', parameters=[KernelParameterMetadata(name='text', description='The information to save.', default_value=None, type_='str', is_required=True, type_object=<class 'str'>), KernelParameterMetadata(name='key', description='The unique key to associate with the information.', default_value=None, type_='str', is_required=True, type_object=<class 'str'>), KernelParameterMetadata(name='collection', description='The collection to save the information.', default_value='generic', type_='str', is_required=False, type_object=<class 'str'>)], is_prompt=False, is_asynchronous=True, return_parameter=KernelParameterMetadata(name='return', description='', default_value=None, type_='', is_required=True, type_object=None)), method=<bound method TextMemoryPlugin.save of TextMemoryPlugin(memory=SemanticTextMemory())>, stream_method=None)})
```

### 5.2、文本向量化

```python
from semantic_kernel.text import split_markdown_lines

# 读取文件内容
with open('ChatALL.md', 'r') as f:
    # with open('sk_samples/SamplePlugin/SamplePlugin.py', 'r') as f:
    content = f.read()

# 将文件内容分片，单片最大 100 token（注意：SK 的 text split 功能目前对中文支持不如对英文支持得好）
lines = split_markdown_lines(content, 100)

collection_id = "generic"

# 将分片后的内容，存入内存
for index, line in enumerate(lines):
    await memory.save_information(collection=collection_id, id=index, text=line)
```

### 5.3、向量搜索

```python
result = await memory.search(collection_id, "ChatALL怎么下载？")
print(result[0].text)
```

**Output:**
```
拥有可以访问这些 AI 的帐号，或 API token。
2. 与 AI 网站有可靠的网络连接。

## 下载 / 安装

从 https://github.com/sunner/ChatALL/releases 下载

### Windows 系统

直接下载 \*-win.exe 安装文件并运行之。

### macOS 系统

对于苹果硅芯片 Mac（M1，M2 CPU），请下载 \*-mac-arm64.
```

### 5.4、现在用函数嵌套做一个简单的 RAG

例：基于 ChatALL 的说明文档，做问答

在自定义的 Semantic Function 中，嵌套调用内置的 `TextMemoryPlugin`。

```python
# 直接在代码里创建 semantic function。真实工程不建议这么做
# 里面调用了 `recall()`
prompt = """
基于下面的背景信息回答问题。如果背景信息为空，或者和问题不相关，请回答"我不知道"。

[背景信息开始]
{{recall $input}}
[背景信息结束]

问题：{{$input}}
回答：
"""

req_settings = kernel.get_service(service_id).get_prompt_execution_settings_class()(service_id=service_id)

prompt_template_config = PromptTemplateConfig(
    template=prompt,
    description="RAG问答",
    execution_settings={service_id: req_settings},
    input_variables=[
        InputVariable(name="input", description="The user query", is_required=True),
    ],
)

rag_function = kernel.add_function(
    function_name="search_and_answer",
    plugin_name="MyDemoPlugin",
    prompt_template_config=prompt_template_config,
)


result = await kernel.invoke(
    rag_function,
    KernelArguments(input="ChatALL 怎么下载")
)

print(result)
```

**Output:**
```
从 https://github.com/sunner/ChatALL/releases 下载安装文件。对于Windows系统，下载\*-win.exe文件并运行；对于macOS系统，苹果硅芯片Mac（M1，M2 CPU）下载\*-mac-arm64文件。
```

### 5.5、连接其它 VectorDB

Semantic Kernel 目前已与很多主流的向量数据库做了适配

具体参考：https://learn.microsoft.com/en-us/semantic-kernel/memories/vector-db

## 6、Planner

SK 的 Planner 目的是 Agent 开发。只封装了几个基本形式，把更多的探索留给了开发者。

### 6.1、什么是智能体（Agent）

将大语言模型作为一个推理引擎。给定一个任务，智能体自动生成完成任务所需的步骤，执行相应动作（例如选择并调用工具），直到任务完成。

这个多步骤的规划过程，就由 **Planner** 完成。

![image](./assets/07-semantic-kernel.bak/agent-overview.png)

Agent 与 RAG 和 Copilot 的区别

![image](./assets/07-semantic-kernel.bak/types-of-agents.png)

### 6.2、SK Python 提供了四种 Planner：

1. `SequentialPlanner`
   - 制定包含一系列步骤的计划，这些步骤通过自定义生成的输入和输出变量相互连接
   - 核心 https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/planners/sequential_planner/Plugins/SequentialPlanning/skprompt.txt
   - 官方例程：https://github.com/microsoft/semantic-kernel/blob/main/python/samples/kernel-syntax-examples/sequential_planner.py
2. `ActionPlanner`
   - 类似 OpenAI Function Calling，从 kernel 中已注册的所有 plugin 中找到一个该执行的函数
   - 核心 prompt：https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/planners/action_planner/skprompt.txt
   - 官方例程：https://github.com/microsoft/semantic-kernel/blob/main/python/samples/kernel-syntax-examples/action_planner.py
3. `StepwisePlanner`
   - 每执行完一步，都做一下复盘
   - 只输出 action，不执行
   - 核心 prompt：https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/planners/stepwise_planner/Plugins/StepwiseStep/skprompt.txt
4. `BasicPlanner`
   - **不建议使用**。把任务拆解，自动调用各个函数，完成任务。它只是个用于基础验证的功能，最终会被 `SequentialPlanner` 替代
   - 核心 prompt：https://github.com/microsoft/semantic-kernel/blob/main/python/semantic_kernel/planners/basic_planner.py

使用 planner 的步骤非常简单：

1. 把 plugin 注册到 kernel
2. 把 kernel 当参数实例化某个 planner
3. 调用 planner 的 `create_plan_async()` 方法获得 plan
4. 调用 plan 的 `invoke_async()` 方法执行 plan

(注意，不同 planner 接口并不一致，不能简单平替)

### 6.3、用 Planner 实现一个能使用搜索和日历工具的 Agent

例：周杰伦2024墨尔本演唱会是星期几

```python
from semantic_kernel.core_plugins import WebSearchEnginePlugin
from semantic_kernel.connectors.search_engine import BingConnector
from semantic_kernel.planners import SequentialPlanner
import semantic_kernel as sk
from semantic_kernel.connectors.ai.open_ai import OpenAIChatCompletion
import os

# 加载 .env 到环境变量
from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

# 创建 semantic kernel
kernel = sk.Kernel()

# 配置 OpenAI 服务。OPENAI_BASE_URL 会被自动加载生效
api_key = os.getenv('OPENAI_API_KEY')
service_id = "default"

llm_service = OpenAIChatCompletion(
    service_id=service_id, 
    ai_model_id="gpt-4", 
    api_key=api_key
)

# 将 LLM 服务添加到 kernel 中
kernel.add_service(llm_service)
```

关于如何注册 BING API KEY ：[BING API KEY](https://agiclass.feishu.cn/wiki/JKV7wXM7IiXJFmk3ktgca1tfnfR)

```python
# 导入搜索 plugin
connector = BingConnector(api_key=os.getenv("BING_API_KEY"))
kernel.add_plugin(WebSearchEnginePlugin(connector), "WebSearch")
```

**Output:**
```
KernelPlugin(name='WebSearch', description=None, functions={'search': KernelFunctionFromMethod(metadata=KernelFunctionMetadata(name='search', plugin_name='WebSearch', description='Performs a web search for a given query', parameters=[KernelParameterMetadata(name='query', description='The search query', default_value=None, type_='str', is_required=True, type_object=<class 'str'>), KernelParameterMetadata(name='num_results', description='The number of search results to return', default_value=1, type_='int', is_required=False, type_object=<class 'int'>), KernelParameterMetadata(name='offset', description='The number of search results to skip', default_value=0, type_='int', is_required=False, type_object=<class 'int'>)], is_prompt=False, is_asynchronous=True, return_parameter=KernelParameterMetadata(name='return', description='', default_value=None, type_='str', is_required=True, type_object=None)), method=<bound method WebSearchEnginePlugin.search of <semantic_kernel.core_plugins.web_search_engine_plugin.WebSearchEnginePlugin object at 0x7fe0e0f0e7d0>>, stream_method=None)})
```

```python
from semantic_kernel.core_plugins import MathPlugin, TextPlugin, TimePlugin

kernel.add_plugin(TimePlugin(), "time")

# 创建 planner
planner = SequentialPlanner(kernel, service_id)

# 开始
#query = "周杰伦2024年4月演唱会，哪场离北京最近，帮我订一张机票"
query = """周杰伦2024墨尔本演唱会是星期几"""

plan = await planner.create_plan(goal=query)    
result = await plan.invoke(kernel)

for i, step in enumerate(plan._steps):
    print(step.description)
    print(step.plugin_name+"."+step.name, end=": ")
    print(step.parameters)
    print(step._outputs[0] + "=" + str(result.metadata["results"][i].value))

print(f"Agent 回复：{result}")
```

**Output:**
```
Performs a web search for a given query
WebSearch.search: {'query': '周杰伦2024墨尔本演唱会日期', 'num_results': 1, 'offset': 0}
CONCERT_DATE=['今年3月，华语乐坛天王周杰伦唱响悉尼，与成千上万的歌迷度过了一场难忘的嘉年华。2024年3月2日晚上7点30分，他将再度站上悉尼户外体育场（GIANTS Stadium）与歌迷同乐。更令人振奋的是，他也将于3月16及17日晚上7点30分，首度登上墨尔本罗德•拉沃竞技场（RodLaverArena）的舞台，带来2场精彩纷呈的 ...']
Get the current day of the week
time.dayOfWeek: {'day_name': '$CONCERT_DATE'}
RESULT__CONCERT_DAY=Tuesday
Agent 回复：Tuesday
```

> ✅ **Tip:** 这里只需要掌握 Agent 的定义和工作原理。SK 自带的 Agent Prompt 其实效果很差。Agent 的实现技巧我们未来专门讲解。

**带着以上知识，重新回顾一下 Kernel 的意义**

![image](./assets/07-semantic-kernel.bak/kernel.png)

## 7、VSCode 插件

这是个 VSCode 的插件，在 VSCode 里可以直接创建和调试 Semantic Function。

安装地址：https://marketplace.visualstudio.com/items?itemName=ms-semantic-kernel.semantic-kernel

## 思考

什么时候适合用：

- 原生 API + Function Calling
- Assistant API
- 三方的 SDK, 例如 Semantic Kernel

## 总结

1. 我是否应该使用开发框架？
2. 什么情况下选择 SK ？

- 如果你经常需要替换不同 LLM 或有大量的 Prompt 调试需求，选择一个开发框架会让生活更容易
- 如果你的 Prompt 里有大量嵌套调用
- 如果你必须使用 C#/JAVA 技术栈，SK 可能是目前唯一的选择
- 如果你用 Python 技术栈，可以对比一下 LangChain 再做取舍（下节课细讲）

## 作业

用 Semantic Kernel 重构 ChatPDF 的作业。