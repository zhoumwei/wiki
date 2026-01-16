# 03 Func Call   Index



# 结构化输出

## 💡 这节课会带给你

1. 用自然语言连接系统的认知，面向未来思考系统间的集成
2. GPTs 是如何连接外部世界的
3. 用 Function Calling 把大模型和业务连接起来
4. 用 `json_schema` 格式化大模型的输出

开始上课！

## 什么是结构化输出

结构化输出（Structed Outputs）是指让 LLM 输出符合机器可解析的格式，典型的是 JSON 结构。有三条技术路径：

1. JSON mode - 在 Prompt Engineering 课有介绍
2. Function Calling - 本节课会详细讲解
3. JSON Schema - 本节课会简单介绍

## Function Calling 做什么的？

![image](./assets/03-func-call/siri_send_img.gif)

## 接口（Interface）

两种常见接口：

1. 人机交互接口，User Interface，简称 UI
2. 应用程序编程接口，Application Programming Interface，简称 API

接口能「通」的关键，是两边都要遵守约定。

- 人要按照 UI 的设计来操作。UI 的设计要符合人的习惯
- 程序要按照 API 的设计来调用。API 的设计要符合程序惯例

你是不是有很多调接口的痛苦经历？比如：

- 文档坑
- 大小写坑
- 参数顺序坑
- 参数类型坑
- ……

## 接口的进化

UI 进化的趋势是：越来越适应人的习惯，越来越自然

1. 命令行，Command Line Interface，简称 CLI（DOS、Unix/Linux shell, Windows Power Shell）
2. 图形界面，Graphical User Interface，简称 GUI（Windows、MacOS、iOS、Android）
3. 语言界面，Conversational User Interface，简称 CUI，或 Natural-Language User Interface，简称 LUI ← **我们在这里**
4. 脑机接口，Brain–Computer Interface，简称 BCI

![image](./assets/03-func-call/ui-evolution.png)

API：

1. 从本地到远程，从同步到异步，媒介发生很多变化，但本质一直没变：**程序员的约定**
2. 现在，开始进化到自然语言接口，Natural-Language Interface，简称 NLI

## 自然语言连接一切（Natural Language Interface）

NLI 是[《以 ChatGPT 为代表的「大模型」会是多大的技术革命？》](https://mp.weixin.qq.com/s/t0Ml7E-CvlKfdaUMBGKJBg)一文中提出的概念。

> 用户操作习惯的迁移，会逼所有软件，都得提供「自然语言界面（Natural Language Interface，简称 NLI）」。这是我生造的词，指的是以自然语言为输入的接口。
>
> 不仅用户界面要 NLI，API 也要 NLI 化。这是因为用户发出的宏观指令，往往不会是一个独立软件能解决的，它需要很多软件、设备的配合。
>
> 一种实现思路是，入口 AI（比如 Siri、小爱同学，机器人管家）非常强大，能充分了解所有软件和设备的能力，且能准确地把用户任务拆解和分发下去。这对入口 AI 的要求非常高。
>
> 另一种实现思路是，入口 AI 收到自然语言指令，把指令通过 NLI 广播出去（也可以基于某些规则做有选择的广播，保护用户隐私），由各个软件自主决策接不接这个指令，接了要怎么做，该和谁配合。
>
> ……
>
> 当 NLI 成为事实标准，那么互联网上软件、服务的互通性会大幅提升，不再受各种协议、接口的限制。

最自然的接口，就是自然语言接口：

以前因为计算机处理不对自然语言，所以有了那么多编程语言，那么多接口，那么多协议，那么多界面风格。而且，它们每一次进化，都是为了「更自然」。现在，终极的自然，到来了。**我们终于可以把计算机当人看了！**

OpenAI 是如何用自然语言连接一切的呢？

## 为什么要大模型连接外部世界？

> ✅ **Tip:** 大模型两大缺陷：

并非知晓一切
    
    训练数据不可能什么都有。垂直、非公开数据必有欠缺
    不知道最新信息。大模型的训练周期很长，且更新一次耗资巨大，还有越训越傻的风险。所以 ta 不可能实时训练。OpenAI 模型知识截止日期：
    
    GPT-3.5 知识截至 2021 年 9 月
    GPT-4-turbo 知识截至 2023 年 12 月
    GPT-4o-mini 知识截至 2023 年 10 月
    GPT-4o 知识截至 2023 年 10 月
    GPT-4 知识截至 2021 年 9 月
    
    
没有「真逻辑」。它表现出的逻辑、推理，是训练文本的统计规律，而不是真正的逻辑，所以有幻觉。

所以：大模型需要连接真实世界，并对接真逻辑系统执行确定性任务。

比如算加法：

1. 把 100 以内所有加法算式都训练给大模型，ta 就能回答 100 以内的加法算式，但仍有概率出错
2. 如果问 ta 更大数字的加法，出错概率就会更大
3. 因为 ta 并不懂「加法」，只是记住了 100 以内的加法算式的统计规律
4. Ta 是用字面意义做数学

数学能力最强的软件系统是 Wolfram Alpha，推荐阅读这篇文章了解它和 ChatGPT 原理的不同：[《Wolfram|Alpha as the Way to Bring Computational Knowledge Superpowers to ChatGPT》](https://writings.stephenwolfram.com/2023/01/wolframalpha-as-the-way-to-bring-computational-knowledge-superpowers-to-chatgpt/)

PS. Wolfram 的书《[这就是 ChatGPT！](https://u.jd.com/p8x8bdp)》是从神经网络层面解释大模型原理的最好读的书。[英文版免费](https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/)

## ChatGPT 用 Actions 连接外部世界

### 第一次尝试：Plugins

- 2023 年 3 月 24 日发布 Plugins，模型可以调用外部 API
- 2024 年 4 月 9 日正式下线，宣告失败

我们在第 1 期（2023 年 7 月）就告诉大家，Plugins 会失败，不用投入精力了解细节。

### 第二次尝试：Actions

Actions，内置在 GPTs 中，解决了落地场景问题，但没能成功商业化。

工作流程：

![image](./assets/03-func-call/actions.png)

> ✅ **Tip:** 划重点：

通过 Actions 的 schema，GPT 能读懂各个 API 能做什么、怎么调用（相当于人读 API 文档）
拿到 prompt，GPT 分析出是否要调用 API 才能解决问题（相当于人读需求）
如果要调用 API，生成调用参数（相当于人编写调用代码）
ChatGPT（注意，不是 GPT）调用 API（相当于人运行程序）
API 返回结果，GPT 读懂结果，整合到回答中（相当于人整理结果，输出结论）

把 AI 当人看！

这个过程中，GPT 已经是个 agent 了。

## Actions ~~开发~~对接

Actions 官方文档：https://platform.openai.com/docs/actions

把 API 对接到 GPTs 里，只需要配置一段 API 描述信息：

```yaml
openapi: 3.1.0
info:
  title: 高德地图
  description: 获取 POI 的相关信息
  version: v1.0.0
servers:
  - url: https://restapi.amap.com/v5/place
paths:
  /text:
    get:
      description: 根据POI名称，获得POI的经纬度坐标
      operationId: get_location_coordinate
      parameters:
        - name: keywords
          in: query
          description: POI名称，必须是中文
          required: true
          schema:
            type: string
        - name: region
          in: query
          description: POI所在的区域名，必须是中文
          required: false
          schema:
            type: string
      deprecated: false
  /around:
    get:
      description: 搜索给定坐标附近的POI
      operationId: search_nearby_pois
      parameters:
        - name: keywords
          in: query
          description: 目标POI的关键字
          required: true
          schema:
            type: string
        - name: location
          in: query
          description: 中心点的经度和纬度，用逗号分隔
          required: false
          schema:
            type: string
      deprecated: false
components:
  schemas: {}
```

还需要配置 API key 来满足权限要求。（高德地图 API KEY [点此免费申请](https://lbs.amap.com/)）

![image](./assets/03-func-call/actions_api_key.png)

这里的所有 `name`、`description` 都是 prompt，决定了 GPT 会不会调用你的 API，调用得是否正确。

> ⚠️ **Note:** 思考：为什么不干脆整个描述文件都用自然语言写？非要用结构化的 JSON 或 YAML？

## GPTs 与它的平替们

[OpenAI GPTs](https://chat.openai.com/gpts/discovery)

1. 无需编程，就能定制个性对话机器人的平台
2. 可以放入自己的知识库，实现 RAG（后面会讲）
3. 可以通过 actions 对接专有数据和功能
4. 内置 DALL·E 3 文生图和 Code Interpreter 能力
5. 只有 ChatGPT Plus 会员可以使用

推荐两款平替：

字节跳动 Coze（扣子）[中国版](https://www.coze.cn/) [国际版](https://www.coze.com/)

1. 中国版发展势头很猛，支持豆包、Moonshot 等国产大模型
2. 功能很强大，支持工作流、API
3. 但是……

[Dify](https://dify.ai/)

1. 开源，中国公司开发
2. 可以本地部署，支持几乎所有大模型
3. 有 GUI，也有 API

有这类无需开发的工具，为什么还要学大模型开发技术呢？

1. 并不是所有事情都适合用对话解决
2. 它们都无法针对业务需求做极致调优

一个常见的研发场景：先在扣子/Dify 验证原型可行性，再编程落地实现。

Function Calling 技术可以把大模型和业务系统连接，实现更丰富的功能。

## Function Calling 的机制

原理和 Actions 一样，只是使用方式有区别。

![image](./assets/03-func-call/func.png)

Function Calling 完整的官方接口文档：https://platform.openai.com/docs/guides/function-calling

## 示例 1：调用本地函数

需求：实现一个回答问题的 AI。题目中如果有加法，必须能精确计算。

```python
# 初始化
from openai import OpenAI
from dotenv import load_dotenv, find_dotenv
import json

_ = load_dotenv(find_dotenv())

client = OpenAI()


def print_json(data):
    """
    打印参数。如果参数是有结构的（如字典或列表），则以格式化的 JSON 形式打印；
    否则，直接打印该值。
    """
    if hasattr(data, 'model_dump_json'):
        data = json.loads(data.model_dump_json())

    if (isinstance(data, (list))):
        for item in data:
            print_json(item)
    elif (isinstance(data, (dict))):
        print(json.dumps(
            data,
            indent=4,
            ensure_ascii=False
        ))
    else:
        print(data)
```

```python
def get_completion(messages, model="gpt-4o-mini"):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.7,
        tools=[{  # 用 JSON 描述函数。可以定义多个。由大模型决定调用谁。也可能都不调用
            "type": "function",
            "function": {
                "name": "sum",
                "description": "加法器，计算一组数的和",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "numbers": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        }
                    }
                }
            }
        }],
    )
    return response.choices[0].message
```

```python
from math import *

prompt = "Tell me the sum of 1, 2, 3, 4, 5, 6, 7, 8, 9, 10."
# prompt = "桌上有 2 个苹果，四个桃子和 3 本书，还有 3 个番茄，以及三个傻瓜，一共有几个水果？"
# prompt = "1+2+3...+99+100"
# prompt = "1024 乘以 1024 是多少？"   # Tools 里没有定义乘法，会怎样？
# prompt = "太阳从哪边升起？"           # 不需要算加法，会怎样？

messages = [
    {"role": "system", "content": "你是一个数学家"},
    {"role": "user", "content": prompt}
]
response = get_completion(messages)

# 把大模型的回复加入到对话历史中。必须有
messages.append(response)

# 如果返回的是函数调用结果，则打印出来
if (response.tool_calls is not None):
    # 是否要调用 sum
    tool_call = response.tool_calls[0]
    if (tool_call.function.name == "sum"):
        # 调用 sum
        args = json.loads(tool_call.function.arguments)
        result = sum(args["numbers"])

        # 把函数调用结果加入到对话历史中
        messages.append(
            {
                "tool_call_id": tool_call.id,  # 用于标识函数调用的 ID
                "role": "tool",
                "name": "sum",
                "content": str(result)  # 数值 result 必须转成字符串
            }
        )

        # 再次调用大模型
        response = get_completion(messages)
        messages.append(response)
        print("=====最终 GPT 回复=====")
        print(response.content)

print("=====对话历史=====")
print_json(messages)
```

**Output:**
```
=====最终 GPT 回复=====
The sum of the numbers 1 through 10 is 55.
=====对话历史=====
{
    "role": "system",
    "content": "你是一个数学家"
}
{
    "role": "user",
    "content": "Tell me the sum of 1, 2, 3, 4, 5, 6, 7, 8, 9, 10."
}
{
    "content": null,
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": [
        {
            "id": "call_aAIfOBKZiohdqEK1T1S5utvg",
            "function": {
                "arguments": "{\"numbers\":[1,2,3,4,5,6,7,8,9,10]}",
                "name": "sum"
            },
            "type": "function"
        }
    ]
}
{
    "tool_call_id": "call_aAIfOBKZiohdqEK1T1S5utvg",
    "role": "tool",
    "name": "sum",
    "content": "55"
}
{
    "content": "The sum of the numbers 1 through 10 is 55.",
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": null
}
```

> ✅ **Tip:** 划重点：

Function Calling 中的函数与参数的描述也是一种 prompt
这种 prompt 也需要调优，否则会影响函数的召回、参数的准确性，甚至让大模型产生幻觉，调用不存在的函数

## 示例 2：多 Function 调用

需求：查询某个地点附近的酒店、餐厅、景点等信息。即，查询某个 POI 附近的 POI。

```python
def get_completion(messages, model="gpt-4o-mini"):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
        seed=1024,      # 随机种子保持不变，temperature 和 prompt 不变的情况下，输出就会不变
        tool_choice="auto",  # 默认值，由 GPT 自主决定返回 function call 还是返回文字回复。也可以强制要求必须调用指定的函数，详见官方文档
        tools=[{
            "type": "function",
            "function": {
                "name": "get_location_coordinate",
                "description": "根据POI名称，获得POI的经纬度坐标",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "POI名称，必须是中文",
                        },
                        "city": {
                            "type": "string",
                            "description": "POI所在的城市名，必须是中文",
                        }
                    },
                    "required": ["location", "city"],
                }
            }
        },
            {
            "type": "function",
            "function": {
                "name": "search_nearby_pois",
                "description": "搜索给定坐标附近的poi",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "longitude": {
                            "type": "string",
                            "description": "中心点的经度",
                        },
                        "latitude": {
                            "type": "string",
                            "description": "中心点的纬度",
                        },
                        "keyword": {
                            "type": "string",
                            "description": "目标poi的关键字",
                        }
                    },
                    "required": ["longitude", "latitude", "keyword"],
                }
            }
        }],
    )
    return response.choices[0].message
```

```python
import requests
import os

amap_key = os.getenv("AMAP_KEY")
amap_base_url = os.getenv("AMAP_URL") # 默认是 https://restapi.amap.com/v5


def get_location_coordinate(location, city):
    url = f"{amap_base_url}/place/text?key={amap_key}&keywords={location}&region={city}"
    r = requests.get(url)
    result = r.json()
    if "pois" in result and result["pois"]:
        return result["pois"][0]
    return None


def search_nearby_pois(longitude, latitude, keyword):
    url = f"{amap_base_url}/place/around?key={amap_key}&keywords={keyword}&location={longitude},{latitude}"
    r = requests.get(url)
    result = r.json()
    ans = ""
    if "pois" in result and result["pois"]:
        for i in range(min(3, len(result["pois"]))):
            name = result["pois"][i]["name"]
            address = result["pois"][i]["address"]
            distance = result["pois"][i]["distance"]
            ans += f"{name}\n{address}\n距离：{distance}米\n\n"
    return ans
```

```python
prompt = "我想在五道口附近喝咖啡，给我推荐几个"
# prompt = "我到北京出差，给我推荐三里屯的酒店，和五道口附近的咖啡" # 一次请求两个调用

messages = [
    {"role": "system", "content": "你是一个地图通，你可以找到任何地址。"},
    {"role": "user", "content": prompt}
]
response = get_completion(messages)
messages.append(response)  # 把大模型的回复加入到对话中
print("=====GPT回复=====")
print_json(response)

while (response.tool_calls is not None):
    # 支持一次返回多个函数调用请求，所以要考虑到这种情况
    for tool_call in response.tool_calls:
        args = json.loads(tool_call.function.arguments)
        print("函数参数展开：")
        print_json(args)

        # 函数路由
        if (tool_call.function.name == "get_location_coordinate"):
            print("Call: get_location_coordinate")
            result = get_location_coordinate(**args)
        elif (tool_call.function.name == "search_nearby_pois"):
            print("Call: search_nearby_pois")
            result = search_nearby_pois(**args)

        print("=====函数返回=====")
        print_json(result)

        messages.append({
            "tool_call_id": tool_call.id,  # 用于标识函数调用的 ID
            "role": "tool",
            "name": tool_call.function.name,
            "content": str(result)  # 数值result 必须转成字符串
        })

    response = get_completion(messages)
    messages.append(response)  # 把大模型的回复加入到对话中

print("=====最终回复=====")
print(response.content)
print("=====对话历史=====")
print_json(messages)
```

**Output:**
```
=====GPT回复=====
{
    "content": null,
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": [
        {
            "id": "call_BEjN2hy7nriCqmWFGGvoyNmt",
            "function": {
                "arguments": "{\"location\":\"五道口\",\"city\":\"北京\"}",
                "name": "get_location_coordinate"
            },
            "type": "function"
        }
    ]
}
函数参数展开：
{
    "location": "五道口",
    "city": "北京"
}
Call: get_location_coordinate
=====函数返回=====
{
    "parent": "",
    "address": "海淀区",
    "distance": "",
    "pcode": "110000",
    "adcode": "110108",
    "pname": "北京市",
    "cityname": "北京市",
    "type": "地名地址信息;热点地名;热点地名",
    "typecode": "190700",
    "adname": "海淀区",
    "citycode": "010",
    "name": "五道口",
    "location": "116.338611,39.992552",
    "id": "B000A8WSBH"
}
函数参数展开：
{
    "longitude": "116.338611",
    "latitude": "39.992552",
    "keyword": "咖啡"
}
Call: search_nearby_pois
=====函数返回=====
PAGEONE CAFE(五道口购物中心店)
成府路28号五道口购物中心(五道口地铁站B南口步行190米)
距离：9米

星巴克(北京五道口购物中心店)
成府路28号1层101-10B及2层201-09号
距离：39米

luckin coffee 瑞幸咖啡(五道口购物中心店)
成府路28号五道口购物中心负一层101号
距离：67米


=====最终回复=====
在五道口附近有以下几家咖啡店推荐：

1. **PAGEONE CAFE(五道口购物中心店)**
   - 地址：成府路28号五道口购物中心(五道口地铁站B南口步行190米)
   - 距离：9米

2. **星巴克(北京五道口购物中心店)**
   - 地址：成府路28号1层101-10B及2层201-09号
   - 距离：39米

3. **luckin coffee 瑞幸咖啡(五道口购物中心店)**
   - 地址：成府路28号五道口购物中心负一层101号
   - 距离：67米

希望你能找到一个满意的地方享受咖啡时光！
=====对话历史=====
{
    "role": "system",
    "content": "你是一个地图通，你可以找到任何地址。"
}
{
    "role": "user",
    "content": "我想在五道口附近喝咖啡，给我推荐几个"
}
{
    "content": null,
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": [
        {
            "id": "call_BEjN2hy7nriCqmWFGGvoyNmt",
            "function": {
                "arguments": "{\"location\":\"五道口\",\"city\":\"北京\"}",
                "name": "get_location_coordinate"
            },
            "type": "function"
        }
    ]
}
{
    "tool_call_id": "call_BEjN2hy7nriCqmWFGGvoyNmt",
    "role": "tool",
    "name": "get_location_coordinate",
    "content": "{'parent': '', 'address': '海淀区', 'distance': '', 'pcode': '110000', 'adcode': '110108', 'pname': '北京市', 'cityname': '北京市', 'type': '地名地址信息;热点地名;热点地名', 'typecode': '190700', 'adname': '海淀区', 'citycode': '010', 'name': '五道口', 'location': '116.338611,39.992552', 'id': 'B000A8WSBH'}"
}
{
    "content": null,
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": [
        {
            "id": "call_PuOC0rCTct8cSbHoT3rAHTee",
            "function": {
                "arguments": "{\"longitude\":\"116.338611\",\"latitude\":\"39.992552\",\"keyword\":\"咖啡\"}",
                "name": "search_nearby_pois"
            },
            "type": "function"
        }
    ]
}
{
    "tool_call_id": "call_PuOC0rCTct8cSbHoT3rAHTee",
    "role": "tool",
    "name": "search_nearby_pois",
    "content": "PAGEONE CAFE(五道口购物中心店)\n成府路28号五道口购物中心(五道口地铁站B南口步行190米)\n距离：9米\n\n星巴克(北京五道口购物中心店)\n成府路28号1层101-10B及2层201-09号\n距离：39米\n\nluckin coffee 瑞幸咖啡(五道口购物中心店)\n成府路28号五道口购物中心负一层101号\n距离：67米\n\n"
}
{
    "content": "在五道口附近有以下几家咖啡店推荐：\n\n1. **PAGEONE CAFE(五道口购物中心店)**\n   - 地址：成府路28号五道口购物中心(五道口地铁站B南口步行190米)\n   - 距离：9米\n\n2. **星巴克(北京五道口购物中心店)**\n   - 地址：成府路28号1层101-10B及2层201-09号\n   - 距离：39米\n\n3. **luckin coffee 瑞幸咖啡(五道口购物中心店)**\n   - 地址：成府路28号五道口购物中心负一层101号\n   - 距离：67米\n\n希望你能找到一个满意的地方享受咖啡时光！",
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": null
}
```

## 示例 3：通过 Function Calling 查询数据库

需求：从订单表中查询各种信息，比如某个用户的订单数量、某个商品的销量、某个用户的消费总额等等。

```python
#  描述数据库表结构
database_schema_string = """
CREATE TABLE orders (
    id INT PRIMARY KEY NOT NULL, -- 主键，不允许为空
    customer_id INT NOT NULL, -- 客户ID，不允许为空
    product_id STR NOT NULL, -- 产品ID，不允许为空
    price DECIMAL(10,2) NOT NULL, -- 价格，不允许为空
    status INT NOT NULL, -- 订单状态，整数类型，不允许为空。0代表待支付，1代表已支付，2代表已退款
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间，默认为当前时间
    pay_time TIMESTAMP -- 支付时间，可以为空
);
"""
```

```python
def get_sql_completion(messages, model="gpt-4o-mini"):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
        tools=[{  # 摘自 OpenAI 官方示例 https://github.com/openai/openai-cookbook/blob/main/examples/How_to_call_functions_with_chat_models.ipynb
            "type": "function",
            "function": {
                "name": "ask_database",
                "description": "Use this function to answer user questions about business. \
                            Output should be a fully formed SQL query.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": f"""
                            SQL query extracting info to answer the user's question.
                            SQL should be written using this database schema:
                            {database_schema_string}
                            The query should be returned in plain text, not in JSON.
                            The query should only contain grammars supported by SQLite.
                            """,
                        }
                    },
                    "required": ["query"],
                }
            }
        }],
    )
    return response.choices[0].message
```

```python
import sqlite3

# 创建数据库连接
conn = sqlite3.connect(':memory:')
cursor = conn.cursor()

# 创建orders表
cursor.execute(database_schema_string)

# 插入5条明确的模拟记录
mock_data = [
    (1, 1001, 'TSHIRT_1', 50.00, 0, '2023-09-12 10:00:00', None),
    (2, 1001, 'TSHIRT_2', 75.50, 1, '2023-09-16 11:00:00', '2023-08-16 12:00:00'),
    (3, 1002, 'SHOES_X2', 25.25, 2, '2023-10-17 12:30:00', '2023-08-17 13:00:00'),
    (4, 1003, 'SHOES_X2', 25.25, 1, '2023-10-17 12:30:00', '2023-08-17 13:00:00'),
    (5, 1003, 'HAT_Z112', 60.75, 1, '2023-10-20 14:00:00', '2023-08-20 15:00:00'),
    (6, 1002, 'WATCH_X001', 90.00, 0, '2023-10-28 16:00:00', None)
]

for record in mock_data:
    cursor.execute('''
    INSERT INTO orders (id, customer_id, product_id, price, status, create_time, pay_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', record)

# 提交事务
conn.commit()
```

```python
def ask_database(query):
    cursor.execute(query)
    records = cursor.fetchall()
    return records


prompt = "10月的销售额"
# prompt = "统计每月每件商品的销售额"
# prompt = "哪个用户消费最高？消费多少？"

messages = [
    {"role": "system", "content": "你是一个数据分析师，基于数据库的数据回答问题"},
    {"role": "user", "content": prompt}
]
response = get_sql_completion(messages)
if response.content is None:
    response.content = ""
messages.append(response)
print("====Function Calling====")
print_json(response)

if response.tool_calls is not None:
    tool_call = response.tool_calls[0]
    if tool_call.function.name == "ask_database":
        arguments = tool_call.function.arguments
        args = json.loads(arguments)
        print("====SQL====")
        print(args["query"])
        result = ask_database(args["query"])
        print("====DB Records====")
        print(result)

        messages.append({
            "tool_call_id": tool_call.id,
            "role": "tool",
            "name": "ask_database",
            "content": str(result)
        })
        response = get_sql_completion(messages)
        messages.append(response)
        print("====最终回复====")
        print(response.content)

print("=====对话历史=====")
print_json(messages)
```

**Output:**
```
====Function Calling====
{
    "content": "",
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": [
        {
            "id": "call_aeZKffHgmyzOzcNKOXcRe3ha",
            "function": {
                "arguments": "{\"query\":\"SELECT SUM(price) AS total_sales FROM orders WHERE strftime('%Y-%m', create_time) = '2023-10' AND status = 1;\"}",
                "name": "ask_database"
            },
            "type": "function"
        }
    ]
}
====SQL====
SELECT SUM(price) AS total_sales FROM orders WHERE strftime('%Y-%m', create_time) = '2023-10' AND status = 1;
====DB Records====
[(86.0,)]
====最终回复====
10月的销售额为86.00元。
=====对话历史=====
{
    "role": "system",
    "content": "你是一个数据分析师，基于数据库的数据回答问题"
}
{
    "role": "user",
    "content": "10月的销售额"
}
{
    "content": "",
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": [
        {
            "id": "call_aeZKffHgmyzOzcNKOXcRe3ha",
            "function": {
                "arguments": "{\"query\":\"SELECT SUM(price) AS total_sales FROM orders WHERE strftime('%Y-%m', create_time) = '2023-10' AND status = 1;\"}",
                "name": "ask_database"
            },
            "type": "function"
        }
    ]
}
{
    "tool_call_id": "call_aeZKffHgmyzOzcNKOXcRe3ha",
    "role": "tool",
    "name": "ask_database",
    "content": "[(86.0,)]"
}
{
    "content": "10月的销售额为86.00元。",
    "refusal": null,
    "role": "assistant",
    "function_call": null,
    "tool_calls": null
}
```

## 示例 4：用 Function Calling 实现多表查询

把多表的描述给进去就好了。

```python
#  描述数据库表结构
database_schema_string = """
CREATE TABLE customers (
    id INT PRIMARY KEY NOT NULL, -- 主键，不允许为空
    customer_name VARCHAR(255) NOT NULL, -- 客户名，不允许为空
    email VARCHAR(255) UNIQUE, -- 邮箱，唯一
    register_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- 注册时间，默认为当前时间
);
CREATE TABLE products (
    id INT PRIMARY KEY NOT NULL, -- 主键，不允许为空
    product_name VARCHAR(255) NOT NULL, -- 产品名称，不允许为空
    price DECIMAL(10,2) NOT NULL -- 价格，不允许为空
);
CREATE TABLE orders (
    id INT PRIMARY KEY NOT NULL, -- 主键，不允许为空
    customer_id INT NOT NULL, -- 客户ID，不允许为空
    product_id INT NOT NULL, -- 产品ID，不允许为空
    price DECIMAL(10,2) NOT NULL, -- 价格，不允许为空
    status INT NOT NULL, -- 订单状态，整数类型，不允许为空。0代表待支付，1代表已支付，2代表已退款
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 创建时间，默认为当前时间
    pay_time TIMESTAMP -- 支付时间，可以为空
);
"""

prompt = "统计每月每件商品的销售额"
prompt = "这星期消费最高的用户是谁？他买了哪些商品？ 每件商品买了几件？花费多少？"
messages = [
    {"role": "system", "content": "你是一个数据分析师，基于数据库中的表回答用户问题"},
    {"role": "user", "content": prompt}
]
response = get_sql_completion(messages)
sql = json.loads(response.tool_calls[0].function.arguments)["query"]
print(sql)
```

**Output:**
```
SELECT c.customer_name, p.product_name, o.price, COUNT(o.id) as quantity
FROM orders o
JOIN customers c ON o.customer_id = c.id
JOIN products p ON o.product_id = p.id
WHERE o.create_time >= date('now', 'weekday 0', '-6 days')
AND o.create_time < date('now', 'weekday 0', '1 day')
GROUP BY c.id, p.id
ORDER BY SUM(o.price) DESC
LIMIT 1;
```

以上技术叫 NL2SQL。演示很简单，但实际场景里，当数据表数很大，结构很复杂时，有无数细节工作要做。

## 示例 5：Stream 模式

流式（stream）输出不会一次返回完整 JSON 结构，所以需要拼接后再使用。

```python
def get_completion(messages, model="gpt-4o-mini"):
    response = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0,
        tools=[{
            "type": "function",
            "function": {
                "name": "sum",
                "description": "计算一组数的加和",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "numbers": {
                            "type": "array",
                            "items": {
                                "type": "number"
                            }
                        }
                    }
                }
            }
        }],
        stream=True,    # 启动流式输出
    )
    return response


prompt = "1+2+3"
# prompt = "你是谁"

messages = [
    {"role": "system", "content": "你是一个小学数学老师，你要教学生加法"},
    {"role": "user", "content": prompt}
]
response = get_completion(messages)

function_name, args, text = "", "", ""

print("====Streaming====")

# 需要把 stream 里的 token 拼起来，才能得到完整的 call
for msg in response:
    delta = msg.choices[0].delta
    if delta.tool_calls:
        if not function_name:
            function_name = delta.tool_calls[0].function.name
            print(function_name)
        args_delta = delta.tool_calls[0].function.arguments
        print(args_delta)  # 打印每次得到的数据
        args = args + args_delta
    elif delta.content:
        text_delta = delta.content
        print(text_delta)
        text = text + text_delta

print("====done!====")

if function_name or args:
    print(function_name)
    print_json(args)
if text:
    print(text)
```

**Output:**
```
====Streaming====
sum

{
    "numbers":[
        1,
        2,
        3
    ]
}
====done!====
sum
{"numbers":[1,2,3]}
```

## Function Calling 的注意事项

> ✅ **Tip:** 划重点：

函数声明是消耗 token 的。要在功能覆盖、省钱、节约上下文窗口之间找到最佳平衡
Function Calling 不仅可以调用读函数，也能调用写函数。但官方强烈建议，在写之前，一定要有真人做确认

## 国产大模型 Function Calling 能力仍不足

- 国产大模型基本都支持 Function Calling 了
- 实现稳定的 FC 能力，难度挺大。需要模型推理能力强，指令遵从强，格式控制能力强，以及有好的中间层
- 国产大模型比起 GPT 差距仍存在
- 一种取巧的合规做法：**用 GPT 做 FC，用国产大模型生成最终结果**

## 另一种声音

- 有人不喜欢用 FC，更愿意用 prompt 请求 JSON 结果的方式手动实现 FC 的能力。原因：
  - 省 token
  - 更可控
  - 更容易切换基础大模型
- 并没有足够证据表明一定孰优孰劣
- 但我选 FC，因为更主流

## Function Calling 的想象空间

Function Calling 即将成为操作系统中枢

![image](./assets/03-func-call/siri_send_img.gif)

这个集成能力由 [App Intents](https://developer.apple.com/documentation/appintents) 提供。

想象你是下面产品的研发，怎样用 Function Calling 实现下面的功能？

1. 对着微信说：「给我每个好友发一条情真意切的拜年消息，还要带点儿小幽默」
2. 对着富途牛牛说：「人工智能相关股票，市盈率最低的是哪几个？最近交易量如何？都有哪些机构持有？」
3. 对着京东说：「我想买一台 65 寸的电视，不要日货，价格在 5000 元左右」
4. 对着 Siri 说以上内容，Siri 调用各个 App 完成任务

基本上：

1. 我们的任何功能都可以和大模型结合，提供更好的用户体验
2. 通过大模型，完成内部功能的组合调用，逐步 agent 化设计系统架构

当然，「幻觉」仍然是存在的。如何尽量减少幻觉的影响，参考以下资料：

- 自然语言生成中关于幻觉研究的综述：https://arxiv.org/abs/2202.03629
- 语言模型出现的幻觉是如何滚雪球的：https://arxiv.org/abs/2305.13534
- ChatGPT 在推理、幻觉和交互性上的评估：https://arxiv.org/abs/2302.04023
- 对比学习减少对话中的幻觉：https://arxiv.org/abs/2212.10400
- 自洽性提高了语言模型的思维链推理能力：https://arxiv.org/abs/2203.11171
- 生成式大型语言模型的黑盒幻觉检测：https://arxiv.org/abs/2303.08896

## 几条经验总结

> ✅ **Tip:** 在传统与 AI 之间徘徊：

详细拆解业务 SOP，形成任务工作流。每个任务各个击破，当前别幻想模型一揽子解决所有问题
不是所有任务都适合用大模型解决。传统方案，包括传统 AI 方案，可能更合适
一定要能评估大模型的准确率（所以要先有测试集，否则别问「能不能做」）
评估 bad case 的影响面
大模型永远不是 100% 正确的，建立在这个假设基础上推敲产品的可行性

## 用 `json_schema` 控制回复格式

- 这是 OpenAI 2024 年 8 月 6 日发布的新 API
- 未见国产大模型跟进，因为没那么容易跟进
- 但很可能又成为一个标准
- 比 JSON mode 更稳定，更容易控制

```python
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI()

class CalendarEvent(BaseModel):
    name: str
    date: str
    address: str
    participants: list[str]

completion = client.beta.chat.completions.parse( # 使用 beta 接口
    model="gpt-4o-mini-2024-07-18",  # 必须是版本大于 gpt-4o-mini-2024-07-18 或 gpt-4o-2024-08-06 的模型
    messages=[
        {"role": "system", "content": "解析出事件信息。"},
        {"role": "user", "content": "一般在周一晚上，孙志岗会在他的视频号邀请一名 AI 全栈工程师课程的学员连麦直播。"},
    ],
    response_format=CalendarEvent,
)
event = completion.choices[0].message.parsed
print_json(event)
```

**Output:**
```
{
    "name": "AI 全栈工程师课程 学员连麦直播",
    "date": "每周一晚上",
    "address": "",
    "participants": [
        "孙志岗",
        "AI 全栈工程师课程学员"
    ]
}
```

### 原理

把 JSON 的结构定义一并给到大模型，所以能更稳定。

下面是调用时传的参数：

```json
{
  "model": "gpt-4o-mini-2024-07-18",
  "messages": [
    {
      "role": "system",
      "content": "解析出事件信息。"
    },
    {
      "role": "user",
      "content": "一般在周一晚上，孙志岗会在他的视频号邀请一名 AI 全栈工程师课程的学员连麦直播。"
    }
  ],
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "calendar_event",
      "schema": {
        "type": "object",
        "properties": {
          "name": { "type": "string" },
          "date": { "type": "string" },
          "address": { "type": "string" },
          "participants": {
            "type": "array",
            "items": { "type": "string" }
          },
          "required": ["name", "date", "address", "participants"],
          "additionalProperties": false
        }
      },
      "strict": true
    }
  }
}
```

## 作业

尝试用 Function Calling 的方式实现第二课手机中流量包智能客服的例子。