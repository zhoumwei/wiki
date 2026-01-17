# 09 Llm Tools   Index



# 💡 这节课会带给你

1. 系统性维护、测试、监控一个 LLM 应用
2. 学习使用主流的工具完成上述工作

## 🎓 这节课怎么学

代码能力要求：**中高**，AI/数学基础要求：**低**

1. 有编程基础的同学
   - 从软件工程角度体会一个 AI 应用的开发与维护流程
2. 没有编程基础的同学
   - 了解一个 AI 应用开发与维护过程中涉及到的技术与问题

## 维护一个生产级的 LLM 应用，我们需要做什么？

1. 各种指标监控与统计：访问记录、响应时长、Token 用量、计费等等
2. 调试 Prompt
3. 测试/验证系统的相关评估指标
4. 数据集管理（便于回归测试）
5. Prompt 版本管理（便于升级/回滚）

## 针对以上需求，我们介绍两个生产级 LLM App 维护平台

1. **LangFuse**: 开源 + SaaS（免费/付费），LangSmith 平替，可集成 LangChain 也可直接对接 OpenAI API；
2. **LangSmith**: LangChain 的官方平台，SaaS 服务（免费/付费），非开源，企业版支持私有部署；

## 1、LangFuse

开源，支持 LangChain 集成或原生 OpenAI API 集成

官方网站：https://langfuse.com/

项目地址：https://github.com/langfuse

文档地址：https://langfuse.com/docs

API文档：https://api.reference.langfuse.com/

  - Python SDK: https://python.reference.langfuse.com/

  - JS SDK: https://js.reference.langfuse.com/

1. 通过官方云服务使用：
   - 注册: cloud.langfuse.com
   - 创建 API Key

```sh
LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-..."
LANGFUSE_HOST="https://cloud.langfuse.com" # EU 服务器
# LANGFUSE_HOST="https://us.cloud.langfuse.com" # US 服务器
```

2. 通过 Docker 本地部署

```sh
# Clone repository
git clone https://github.com/langfuse/langfuse.git
cd langfuse

# Run server and db
docker compose up -d
```

```sh
# 在自己部署的系统中生成上述两个 KEY
# 并在环境变量中指定服务地址

LANGFUSE_SECRET_KEY="sk-lf-..."
LANGFUSE_PUBLIC_KEY="pk-lf-.."
LANGFUSE_HOST="http://localhost:3000"

```

```python
# !pip install --upgrade langfuse
```

### 1.1、通过装饰器记录

```python
from langfuse.decorators import observe, langfuse_context
from langfuse.openai import openai # OpenAI integration

@observe()
def run():
    return openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "user", "content": "对我说Hello, World!"}
        ],
    ).choices[0].message.content
 
print(run())
langfuse_context.flush()
```

**Output:**
```
Hello, World! Nice to meet you!
```

### 1.1.1、几个基本概念

- Trace 一般表示用户与系统的一次交互，其中记录输入、输出，也包括自定义的 metadata 比如用户名、session id 等；
- 一个 trace 内部可以包含多个子过程，这里叫 observarions；
- Observation 可以是多个类型：
  - Event 是最基本的单元，用于记录一个 trace 中的每个事件；
  - Span 表一个 trace 中的一个"耗时"的过程；
  - Generation 是用于记录与 AI 模型交互的 span，例如：调用 embedding 模型、调用 LLM。
- Observation 可以嵌套使用。

![image](./assets/09-llm-tools/span.png)

### 1.1.2、`observe()` 装饰器的参数

```python
def observe(
	self,
	*,
	name: Optional[str] = None, # Trace 或 Span 的名称，默认为函数名
	as_type: Optional[Literal['generation']] = None, # 将记录定义为 Observation (LLM 调用）
	capture_input: bool = True, # 记录输入
	capture_output: bool = True, # 记录输出
	transform_to_string: Optional[Callable[[Iterable], str]] = None # 将输出转为 string
) -> Callable[[~F], ~F]:
```

```python
from langfuse.decorators import observe, langfuse_context
from langfuse.openai import openai

@observe(name="HelloWorld")
def run():
    return openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "user", "content": "对我说Hello, World!"}
        ],
    ).choices[0].message.content
 
print(run())
langfuse_context.flush()
```

**Output:**
```
Hello, World! Nice to meet you!
```

### 1.1.3、通过 `langfuse_context` 记录 User ID、Metadata 等

```python
from langfuse.decorators import observe, langfuse_context
from langfuse.openai import openai # OpenAI integration
 
@observe()
def run():
    langfuse_context.update_current_trace(
        name="HelloWorld",
        user_id="wzr",
        tags=["test","demo"]
    )
    return openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
          {"role": "user", "content": "对我说Hello, World!"}
        ],
    ).choices[0].message.content
 
print(run())
langfuse_context.flush()
```

**Output:**
```
Hello, World! Nice to meet you.
```

### 1.2、通过 LangChain 的回调集成

```python
# 清理环境，避免重复记录
del openai
```

```python
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough

model = ChatOpenAI(model="gpt-3.5-turbo")

prompt = ChatPromptTemplate.from_messages([
    HumanMessagePromptTemplate.from_template("Say hello to {input}!")
])


# 定义输出解析器
parser = StrOutputParser()

chain = (
    {"input": RunnablePassthrough()}
    | prompt
    | model
    | parser
)
```

```python
from langfuse.decorators import langfuse_context, observe

@observe()
def run():
    langfuse_context.update_current_trace(
            name="LangChainDemo",
            user_id="wzr",
        )
    
    # 获取当前 LangChain 回调处理器
    langfuse_handler = langfuse_context.get_current_langchain_handler()
    
    return chain.invoke(input="AGIClass", config={"callbacks": [langfuse_handler]})

print(run())
langfuse_context.flush() # Langfuse 回传记录是异步的，可以通过 flush 强制更新
```

**Output:**
```
Hello AGIClass! How can I assist you today?
```

#### 换个模型试试

```python
# 其它模型分装在 langchain_community 底包中
from langchain_community.chat_models import QianfanChatEndpoint
from langchain_core.messages import HumanMessage
import os

ernie_model = QianfanChatEndpoint(
    qianfan_ak=os.getenv('ERNIE_CLIENT_ID'),
    qianfan_sk=os.getenv('ERNIE_CLIENT_SECRET')
)

chain = (
    {"input": RunnablePassthrough()}
    | prompt
    | ernie_model
    | parser
)

@observe()
def run():
    langfuse_context.update_current_trace(
            name="ErnieDemo",
            user_id="wzr",
        )
    
    # 获取当前 LangChain 回调处理器
    langfuse_handler = langfuse_context.get_current_langchain_handler()
    
    return chain.invoke(input="王卓然", config={"callbacks": [langfuse_handler]})

print(run())
langfuse_context.flush()
```

**Output:**
```
Langfuse was not able to parse the LLM model. The LLM call will be recorded without model name. Please create an issue: https://github.com/langfuse/langfuse/issues/new/choose
[INFO][2024-10-15 12:42:11.383] oauth.py:228 [t:140628858189632]: trying to refresh access_token for ak `cuTPS7***`
[INFO][2024-10-15 12:42:12.265] oauth.py:243 [t:140628858189632]: sucessfully refresh access_token
Hello, Wang Zhuoran!
```

### 1.3、构建一个实际应用

**AGI 课堂跟课助手**，根据课程内容，判断学生问题是否需要老师解答

1. 判断该问题是否需要老师解答，回复'Y'或'N'
2. 判断该问题是否已有同学问过

```python
# 构建 PromptTemplate
from langchain.prompts import PromptTemplate

need_answer = PromptTemplate.from_template("""
*********
你是AIGC课程的助教，你的工作是从学员的课堂交流中选择出需要老师回答的问题，加以整理以交给老师回答。
 
课程内容:
{outlines}
*********
学员输入:
{user_input}
*********
如果这是一个需要老师答疑的问题，回复Y，否则回复N。
只回复Y或N，不要回复其他内容。""")

check_duplicated = PromptTemplate.from_template("""
*********
已有提问列表:
[
{question_list}
]
*********
新提问:
{user_input}
*********
已有提问列表是否有和新提问类似的问题? 回复Y或N, Y表示有，N表示没有。
只回复Y或N，不要回复其他内容。""")
```

```python
outlines = """
LangChain
模型 I/O 封装
模型的封装
模型的输入输出
PromptTemplate
OutputParser
数据连接封装
文档加载器：Document Loaders
文档处理器
内置RAG：RetrievalQA
记忆封装：Memory
链架构：Chain/LCEL
大模型时代的软件架构：Agent
ReAct
SelfAskWithSearch
LangServe
LangChain.js
"""

question_list = [
    "LangChain可以商用吗",
    "LangChain开源吗",
]
```

```python
# 创建 chain
model = ChatOpenAI(temperature=0, seed=42)
parser = StrOutputParser()

need_answer_chain = (
    need_answer
    | model
    | parser
)

is_duplicated_chain = (
    check_duplicated
    | model
    | parser
)
```

### 1.3.1、用 Trace 记录一个多次调用 LLM 的过程

```python
import uuid
from langfuse.decorators import langfuse_context, observe

# 主流程
@observe()
def verify_question(
    question: str,
    outlines: str,
    question_list: list,
    user_id: str,
) -> bool:
    langfuse_context.update_current_trace(
            name="AGIClassAssistant",
            user_id=user_id,
        )
    
    # get the langchain handler for the current trace
    langfuse_handler = langfuse_context.get_current_langchain_handler()
    # 判断是否需要回答
    if need_answer_chain.invoke(
        {"user_input": question, "outlines": outlines},
        config={"callbacks": [langfuse_handler]}
    ) == 'Y':
        # 判断是否为重复问题
        if is_duplicated_chain.invoke(
            {"user_input": question,
                "question_list": "\n".join(question_list)},
            config={"callbacks": [langfuse_handler]}
        ) == 'N':
            question_list.append(question)
            return True
    return False
```

```python
# 实际调用
ret = verify_question(
    # "LangChain支持Java吗",
    "老师好",
    outlines,
    question_list,
    user_id="wzr",
)
print(ret)
langfuse_context.flush()
```

**Output:**
```
False
```

> ✅ **Tip:** 上面的实现是为了演示  trace 和 span 的概念。实际下面的实现方式更优。

```python
import numpy as np
import openai

cache = {}

@observe(as_type="generation")
def get_embeddings(text):
    '''封装 OpenAI 的 Embedding 模型接口'''
    if text in cache: 
        # 如果已经在缓存中，不再重复调用（节省时间、费用）
        return cache[text]
    data = openai.embeddings.create(
        input=[text], 
        model="text-embedding-3-small",
        dimensions=256
    ).data
    cache[text] = data[0].embedding
    return data[0].embedding

@observe()
def cos_sim(v, m):
    '''计算cosine相似度'''
    score = np.dot(m, v)/(np.linalg.norm(m, axis=1)*np.linalg.norm(v))
    return score.tolist()

@observe()
def check_duplicated(query, existing, threshold=0.825):
    '''通过cosine相似度阈值判断是否重复'''
    query_vec = np.array(get_embeddings(query))
    mat = np.array([item[1] for item in existing])
    cos = cos_sim(query_vec, mat)
    return max(cos) >= threshold

@observe()
def need_answer(question, outlints):
    '''判断是否需要回答'''
    langfuse_handler = langfuse_context.get_current_langchain_handler()
    return need_answer_chain.invoke(
        {"user_input": question, "outlines": outlines},
        config={"callbacks": [langfuse_handler]}
    ) == 'Y'
```

```python
# 假设 已有问题
question_list = [
    ("LangChain可以商用吗", get_embeddings("LangChain可以商用吗")),
    ("LangChain开源吗", get_embeddings("LangChain开源吗")),
]
```

```python
@observe()
def verify_question(
    question: str,
    outlines: str,
    question_list: list,
    user_id,
) -> bool:
    
    langfuse_context.update_current_trace(
        name="AGIClassAssistant2",
        user_id=user_id,
    )
    
    # 判断是否需要回答
    if need_answer(question,outlines):
        # 判断是否重复
        if not check_duplicated(question, question_list):
            vec = cache[question]
            question_list.append((question,vec))
            return True
    return False
```

```python
ret = verify_question(
    # "LangChain支持Java吗",
    "LangChain有商用许可吗",
    outlines,
    question_list,
    user_id="wzr"
)
print(ret)
langfuse_context.flush()
```

**Output:**
```
False
```

### 1.3.2、用 Session 记录一个用户的多轮对话

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import (
    AIMessage,  # 等价于OpenAI接口中的assistant role
    HumanMessage,  # 等价于OpenAI接口中的user role
    SystemMessage  # 等价于OpenAI接口中的system role
)
from datetime import datetime
from langfuse.decorators import langfuse_context, observe

now = datetime.now()

llm = ChatOpenAI()

messages = [
    SystemMessage(content="你是AGIClass的课程助理。"),
]

session_id = "chat-"+now.strftime("%d/%m/%Y %H:%M:%S")

@observe()
def chat_one_turn(user_input, user_id, turn_id):
    langfuse_context.update_current_trace(
        name=f"ChatTurn{turn_id}",
        user_id=user_id,
        session_id=session_id
    )
    langfuse_handler = langfuse_context.get_current_langchain_handler()
    messages.append(HumanMessage(content=user_input))
    response = llm.invoke(messages, config={"callbacks": [langfuse_handler]})
    messages.append(response)
    return response.content
```

```python
user_id="wzr"
turn_id = 0
while True:
    user_input = input("User: ")
    if user_input.strip() == "":
        break
    reply = chat_one_turn(user_input, user_id, turn_id)
    print("AI: "+reply)
    turn_id += 1
    langfuse_context.flush()
```

**Output:**
```
User:  你好
AI: 你好！有什么我可以帮助你的吗？
User:  你是谁
AI: 我是AGIClass的课程助理，我可以帮助回答关于课程内容和学习的问题。有什么我可以帮助你的吗？
User:
```

### 1.4、数据集与测试

### 1.4.1、在线标注

![image](./assets/09-llm-tools/annotation.png)

### 1.4.2、上传已有数据集

```python
import json

# 调整数据格式 {"input":{...},"expected_output":"label"}
data = []
with open('my_annotations.jsonl', 'r', encoding='utf-8') as fp:
    for line in fp:
        example = json.loads(line.strip())
        item = {
            "input": {
                "outlines": example["outlines"],
                "user_input": example["user_input"]
            },
            "expected_output": example["label"]
        }
        data.append(item)
```

```python
from langfuse import Langfuse
from langfuse.model import CreateDatasetRequest, CreateDatasetItemRequest
from tqdm import tqdm
import langfuse


dataset_name = "my-dataset"

# 初始化客户端
langfuse=Langfuse()

# 创建数据集，如果已存在不会重复创建
try:
    langfuse.create_dataset(
        name=dataset_name,
        # optional description
        description="My first dataset",
        # optional metadata
        metadata={
            "author": "wzr",
            "type": "demo"
        }
    )
except:
    pass

# 考虑演示运行速度，只上传前50条数据
for item in tqdm(data[:50]):
    langfuse.create_dataset_item(
        dataset_name="my-dataset",
        input=item["input"],
        expected_output=item["expected_output"]
    )
```

**Output:**
```
100%|██████████| 50/50 [00:11<00:00,  4.48it/s]
```

### 1.4.3、定义评估函数

```python
def simple_evaluation(output, expected_output):
    return output == expected_output
```

### 1.4.4、运行测试

Prompt 模板与 Chain（LCEL）

```python
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

need_answer = PromptTemplate.from_template("""
*********
你是AIGC课程的助教，你的工作是从学员的课堂交流中选择出需要老师回答的问题，加以整理以交给老师回答。
 
课程内容:
{outlines}
*********
学员输入:
{user_input}
*********
如果这是一个需要老师答疑的问题，回复Y，否则回复N。
只回复Y或N，不要回复其他内容。""")

model = ChatOpenAI(temperature=0, seed=42)
parser = StrOutputParser()

chain_v1 = (
    need_answer
    | model
    | parser
)
```

在数据集上测试效果

```python
from concurrent.futures import ThreadPoolExecutor
import threading
from langfuse import Langfuse
from datetime import datetime

langfuse = Langfuse()
lock = threading.Lock()

def run_evaluation(chain, dataset_name, run_name):
    dataset = langfuse.get_dataset(dataset_name)

    def process_item(item):
        with lock:
            # 注意：多线程调用此处要加锁，否则会有id冲突导致丢数据
            handler = item.get_langchain_handler(run_name=run_name)

        # Assuming chain.invoke is a synchronous function
        output = chain.invoke(item.input, config={"callbacks": [handler]})

        # Assuming handler.root_span.score is a synchronous function
        handler.trace.score(
            name="accuracy",
            value=simple_evaluation(output, item.expected_output)
        )
        print('.', end='', flush=True)

    # for item in dataset.items:
    #    process_item(item)

    with ThreadPoolExecutor(max_workers=4) as executor:
        executor.map(process_item, dataset.items)
```

```python
run_evaluation(chain_v1, "my-dataset", "v1-"+datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

# 保证全部数据同步到云端
langfuse_context.flush()
```

**Output:**
```
..................................................
```

### 1.4.5、Prompt 调优与回归测试

优化 Prompt：试试思维链（回忆[第二课](../02-prompt/index.ipynb)）

```python
from langchain.prompts import PromptTemplate

need_answer = PromptTemplate.from_template("""
*********
你是AIGC课程的助教，你的工作是从学员的课堂交流中选择出需要老师回答的问题，加以整理以交给老师回答。

你的选择需要遵循以下原则：
1 需要老师回答的问题是指与课程内容或AI/LLM相关的技术问题；
2 评论性的观点、闲聊、表达模糊不清的句子，不需要老师回答；
3 学生输入不构成疑问句的，不需要老师回答；
4 学生问题中如果用“这”、“那”等代词指代，不算表达模糊不清，请根据问题内容判断是否需要老师回答。
 
课程内容:
{outlines}
*********
学员输入:
{user_input}
*********
Analyse the student's input according to the lecture's contents and your criteria.
Output your analysis process step by step.
Finally, output a single letter Y or N in a separate line.
Y means that the input needs to be answered by the teacher.
N means that the input does not needs to be answered by the teacher.""")
```

```python
from langchain_core.output_parsers import BaseOutputParser
import re


class MyOutputParser(BaseOutputParser):
    """自定义parser，从思维链中取出最后的Y/N"""

    def parse(self, text: str) -> str:
        matches = re.findall(r'[YN]', text)
        return matches[-1] if matches else 'N'
```

```python
chain_v2 = (
    need_answer
    | model
    | MyOutputParser()
)
```

回归测试

```python
run_evaluation(chain_v2, "my-dataset", "cot-"+datetime.now().strftime("%d/%m/%Y %H:%M:%S"))

# 保证全部数据同步到云端
langfuse_context.flush()
```

**Output:**
```
..................................................
```

### 1.5、Prompt 版本管理

![image](./assets/09-llm-tools/prompt_management.png)

目前只支持 Langfuse 自己的 SDK

```python
from langfuse import Langfuse

langfuse = Langfuse()

# 按名称加载
prompt = langfuse.get_prompt("need_answer_v1")

# 按名称和版本号加载
prompt = langfuse.get_prompt("need_answer_v1", version=2)

# 对模板中的变量赋值
compiled_prompt = prompt.compile(input="老师好", outlines="test")

print(compiled_prompt)
```

**Output:**
```
*********
你是AIGC课程的助教，你的工作是从学员的课堂交流中选择出需要老师回答的问题，加以整理以交给老师回答。
 
课程内容:
test
*********
学员输入:
老师好
*********
如果这是一个需要老师答疑的问题，回复Y，否则回复N。
只回复Y或N，不要回复其他内容。
```

```python
# 获取 config

prompt = langfuse.get_prompt("need_answer_v1", version=5)

print(prompt.config)
```

**Output:**
```
{'temperature': 0}
```

### 1.6、如何比较两个句子的相似性：一些经典 NLP 的评测方法（选）

1. **编辑距离**：也叫莱文斯坦距离(Levenshtein),是针对二个字符串的差异程度的量化量测，量测方式是看至少需要多少次的处理才能将一个字符串变成另一个字符串。
   - 具体计算过程是一个动态规划算法：https://zhuanlan.zhihu.com/p/164599274
   - 衡量两个句子的相似度时，可以以词为单位计算
2. **BLEU Score**:
   - 计算输出与参照句之间的 n-gram 准确率（n=1...4）
   - 对短输出做惩罚
   - 在整个测试集上平均下述值
   - 完整计算公式：$\mathrm{BLEU}_4=\min\left(1,\frac{output-length}{reference-length}\right)\left(\prod_{i=1}^4 precision_i\right)^{\frac{1}{4}}$
   - 函数库：https://www.nltk.org/_modules/nltk/translate/bleu_score.html
3. **Rouge Score**:
   - Rouge-N：将模型生成的结果和标准结果按 N-gram 拆分后，只计算召回率；
   - Rouge-L: 利用了最长公共子序列（Longest Common Sequence），计算：$P=\frac{LCS(c,r)}{len(c)}$, $R=\frac{LCS(c,r)}{len(r)}$, $F=\frac{(1+\beta^2)PR}{R+\beta^2P}$
   - 函数库：https://pypi.org/project/rouge-score/
   - 对比 BLEU 与 ROUGE：
     - BLEU 能评估流畅度，但指标偏向于较短的翻译结果（brevity penalty 没有想象中那么强）
     - ROUGE 不管流畅度，所以只适合深度学习的生成模型：结果都是流畅的前提下，ROUGE 反应参照句中多少内容被生成的句子包含（召回）
4. **METEOR**: 另一个从机器翻译领域借鉴的指标。与 BLEU 相比，METEOR 考虑了更多的因素，如同义词匹配、词干匹配、词序等，因此它通常被认为是一个更全面的评价指标。
   - 对语言学和语义词表有依赖，所以对语言依赖强。

> ✅ **Tip:** 划重点：此类方法常用于对文本生成模型的自动化评估。实际使用中，我们通常更关注相对变化而不是绝对值（调优过程中指标是不是在变好）。

### 1.7、基于 LLM 的测试方法

LangFuse 提供了基于 LLM 和 Prompt 的自动测试工具。

具体参考：https://langfuse.com/docs/scores/model-based-evals

> ✅ **Tip:** 划重点：此类方法，对于用于评估的 LLM 自身能力有要求。需根据具体情况选择使用。

### 1.8、与 LlamaIndex 集成

```python
# !pip install --upgrade llama-index
```

```python
from llama_index.core import Settings
from llama_index.core.callbacks import CallbackManager
from langfuse.llama_index import LlamaIndexCallbackHandler

# 定义 LangFuse 的 CallbackHandler
langfuse_callback_handler = LlamaIndexCallbackHandler()

# 修改 LlamaIndex 的全局设定
Settings.callback_manager = CallbackManager([langfuse_callback_handler])
```

```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
from llama_index.readers.file import PyMuPDFReader
from llama_index.core import Settings
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding

# 指定全局llm与embedding模型
Settings.llm = OpenAI(temperature=0, model="gpt-4o")
Settings.embed_model = OpenAIEmbedding(model="text-embedding-3-small", dimensions=512)
Settings.transforms = [SentenceSplitter(chunk_size=300, chunk_overlap=100)]

# 加载 pdf 文档
documents = SimpleDirectoryReader("./data", file_extractor={".pdf": PyMuPDFReader()}).load_data()

# 指定 Vector Store 用于 index
index = VectorStoreIndex.from_documents(documents)

# 构建单轮 query engine
query_engine = index.as_query_engine()
```

```python
response = query_engine.query("llama2有多少参数")

print(response)
```

**Output:**
```
Llama 2 有 7B、13B 和 70B 参数的变体。
```

自定义 Trace 参数

```python
langfuse_callback_handler.set_trace_params(
    user_id="wzr",
    session_id="llamaindex-session",
    tags=["demo"]
  )
```

```python
response = query_engine.query("llama2安全吗")

print(response)
```

**Output:**
```
Llama 2 是一种新技术，具有潜在的使用风险。尽管进行了安全性评估，但由于提示集的局限性、审查指南的主观性以及评估者的主观性，这些评估可能存在偏见。因此，在部署 Llama 2-Chat 的应用程序之前，开发人员应进行针对其特定应用程序的安全测试和调整。
```

更多接口与参数，请参考[官方文档](https://langfuse.com/docs/integrations/llama-index/get-started)。

## 2、LangSmith

> ⚠️ **Note:** 运行以下代码前，请先重启一下 kernel，以重置所有配置。
    
![image](./assets/09-llm-tools/tips.png)

LangChain 官方的 SaaS 服务，不开源。

平台入口：https://www.langchain.com/langsmith

文档地址：https://python.langchain.com/docs/langsmith/walkthrough

将你的 LangChain 应用与 LangSmith 链接，需要：

1. 安装 LangSmith

```python
# %pip install --upgrade langsmith
```

2. 注册账号，并申请一个`LANGCHAIN_API_KEY`
3. 在环境变量中设置以下值

```shell
export LANGCHAIN_TRACING_V2=true
export LANGCHAIN_PROJECT=YOUR_PROJECT_NAME #自定义项目名称（可选）
export LANGCHAIN_API_KEY=LANGCHAIN_API_KEY # LangChain API Key
```

3. 程序中的调用将自动被记录

```python
import os
from datetime import datetime
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = "HelloWorld-Demo"
```

### 2.1、基本功能演示

1. Traces
2. LLM Calls
3. Monitor
4. Playground

![image](./assets/09-llm-tools/langsmith-example.png)

```python
from langchain.prompts import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
)
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnablePassthrough

model = ChatOpenAI(model="gpt-3.5-turbo")

prompt = ChatPromptTemplate.from_messages([
    HumanMessagePromptTemplate.from_template("Say hello to {input}!")
])


# 定义输出解析器
parser = StrOutputParser()

chain = (
    {"input": RunnablePassthrough()}
    | prompt
    | model
    | parser
)
```

```python
chain.invoke("王卓然")
```

**Output:**
```
'Hello 王卓然! Nice to meet you!'
```

### 2.2、数据集管理与测试

### 2.2.1、在线标注演示

![image](./assets/09-llm-tools/langsmith-annotation.png)

### 2.2.2、上传数据集

```python
import json

data = []
with open('my_annotations.jsonl', 'r', encoding='utf-8') as fp:
    for line in fp:
        example = json.loads(line.strip())
        item = {
            "input": {
                "outlines": example["outlines"],
                "user_input": example["user_input"]
            },
            "expected_output": example["label"]
        }
        data.append(item)
```

```python
from langsmith import Client

client = Client()

dataset_name = "Assistant-"+datetime.now().strftime("%d/%m/%Y %H:%M:%S")

dataset = client.create_dataset(
    dataset_name,  # 数据集名称
    description="AGIClass线上跟课助手的标注数据",  # 数据集描述
)

inputs, outputs = zip(
    *[({"input": item["input"]}, {"label": item["expected_output"]}) for item in data[:50]]
)
client.create_examples(inputs=inputs, outputs=outputs, dataset_id=dataset.id)
```

### 2.2.3、评估函数

```python
from langsmith.schemas import Example, Run

def correct_label(root_run: Run, example: Example) -> dict:
    score = root_run.outputs.get("output") == example.outputs.get("label")
    return {"score": int(score), "key": "accuracy"}
```

### 2.2.4、运行测试

```python
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser 

need_answer = PromptTemplate.from_template("""
*********
你是AIGC课程的助教，你的工作是从学员的课堂交流中选择出需要老师回答的问题，加以整理以交给老师回答。
 
课程内容:
{outlines}
*********
学员输入:
{user_input}
*********
如果这是一个需要老师答疑的问题，回复Y，否则回复N。
只回复Y或N，不要回复其他内容。""")

model = ChatOpenAI(temperature=0, seed=42)
parser = StrOutputParser()

chain_v1 = need_answer | model | parser
```

```python
from langsmith.evaluation import evaluate

results = evaluate(
    lambda inputs: chain_v1.invoke(inputs["input"]),
    data=dataset_name,
    evaluators=[correct_label],
    experiment_prefix="Acc",
    description="测试ChainV1",
)
```

**Output:**
```
/opt/conda/lib/python3.11/site-packages/tqdm/auto.py:21: TqdmWarning: IProgress not found. Please update jupyter and ipywidgets. See https://ipywidgets.readthedocs.io/en/stable/user_install.html
  from .autonotebook import tqdm as notebook_tqdm
View the evaluation results for experiment: 'Acc-a48d31f8' at:
https://smith.langchain.com/o/97b8262a-9ab9-4b43-afeb-21ea05a90ba7/datasets/e7d27b2a-9f6a-4818-a716-14dbd0da3a05/compare?selectedSessions=e068df01-670a-431b-a5ee-3bbe552572a9
50it [00:08,  5.79it/s]
```

### 2.2.5、基于 LLM 的评估函数

https://docs.smith.langchain.com/evaluation/faq/evaluator-implementations

## 总结

管理一个 LLM 应用的全生命周期，需要用到以下工具：

1. 调试 Prompt 的 Playground
2. 测试/验证系统的相关指标
3. 数据集管理
4. 各种指标监控与统计：访问量、响应时长、Token 费等等

根据自己的技术栈，选择：

1. LangFuse：开源平台，支持 LangChain、LlamaIndex 和原生 OpenAI API
2. LangSmith: LangChain 的原始管理平台

## 作业

选择一个工具平台，对自己之前开发的系统或模型做批量测试