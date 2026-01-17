# 12 Transformer   Index



# 神经网络与Transformer详解

# 1. 一个模型的典型场景

### 对用户咨询的法律问题做自动归类：

### 婚姻纠纷、劳动纠纷、合同纠纷、债权债务、房产纠纷、交通事故、医疗纠纷、版权纠纷

![Image Description](./assets/12-transformer/用户对话.png)

# 2. 模型就是一个数学公式


#### 我们一般将这样的问题描述为：给定一组输入数据，经过一系列数学公式计算后，输出n个概率，分别代表该用户对话属于某分类的概率

#### 举个非常简单的例子：

![Image Description](./assets/12-transformer/鳄鱼与蛇1.png)![Image Description](./assets/12-transformer/鳄鱼与蛇2.png)
![Image Description](./assets/12-transformer/鳄鱼与蛇3.png)![Image Description](./assets/12-transformer/鳄鱼与蛇4.png)
![Image Description](./assets/12-transformer/鳄鱼与蛇5.png)![Image Description](./assets/12-transformer/鳄鱼与蛇6.png)
![Image Description](./assets/12-transformer/鳄鱼与蛇7.png)

# 3. 万金油公式 - 神经网络

## 确定数学公式的过程

#### 1、公式：y = ax + b
#### 2、参数：a = 50， b = -100

#### 真实场景的任务，人类搞不定

<br/><br/>

## 神经网络的公式结构

### MNIST（Mixed National Institute of Standards and Technology database）

#### 包含了70,000张手写数字的图像，其中60,000张用于训练，10,000张用于测试，每张图像的内容只包含一个手写数字，从0到9的其中一个数字。
#### 任务：给定一张28x28像素的灰度图像，经过一系列数学公式计算后，输出10个概率，分别代表该图像中的内容是0-9某个数字的概率
![image](./assets/12-transformer/MNIST.png)

![image](./assets/12-transformer/MNIST4.png)![image](./assets/12-transformer/MNIST2.png)
<br/><br/>

![image](./assets/12-transformer/MNIST3.png)

![image](./assets/12-transformer/MNIST7.png)
![image](./assets/12-transformer/MNIST6.png)


> ✅ **Tip:** 划重点：

这种在输入向量x和输出向量y之间，增加了一层z向量，
并且用上述格式的计算公式去计算z向量和y向量中的每一个数值的结构，
就叫做神经网络。

<br/><br/>

## 神经网络的参数设计
#### 1、我可能会这样设计：设定z向量的长度为784，则x向量与z向量等长

![image](./assets/12-transformer/MNIST8.png) ![image](./assets/12-transformer/MNIST9.png)
<br/><br/>

#### 2、会这样简化公式：z[i] = x[i+1] - x[i]（下一个像素值-当前像素值）
相当于把公式 z0 = w0 * x0 + w1 * x1 + w2 * x2 + ...... + w782 * x782 + w783 * x783 + w784<br/>
的系数 w0设置为-1，w1设置为1，w2及以后的系数全部都设置为0<br/>
公式自然变成了 z[0] = x[1] - x[0]<br/>

![image](./assets/12-transformer/MNIST10.png) ![image](./assets/12-transformer/MNIST11.png)
![image](./assets/12-transformer/MNIST12.png)<br/>

![image](./assets/12-transformer/MNIST4.png) ![image](./assets/12-transformer/MNIST13.png)

<br/><br/>

#### 3、再加一层z向量

![image](./assets/12-transformer/MNIST14.png)
![image](./assets/12-transformer/MNIST15.png)

> ✅ **Tip:** 划重点：

在x层和y层之间，加入多层z向量，用以提取更深层特征，这种多层结构，叫做深度神经网络。
而通过计算机完成大规模数学计算以找到相对更优的w参数组合的过程，就叫做机器学习，也就是我们所说的模型训练。

# 4. Transformer的模型长什么样
### 回到课程最开始的场景
![Image Description](./assets/12-transformer/用户对话.png)

## Tokenization - 文本变成Token

### 首先，我们要把这一段文字，变成一组Token，也就是词元化（Tokenization）。

⼦词(subword)词元化是词元化的⼀种，这种⽅案把会单词再切得更细⼀些，⽤更基础的单位来表达语⾔。⽐如："subword"这个词，可以拆分成"sub"和"word"两个⼦词，"sub"是⼀个通⽤的前缀可以和其他组合词的"sub"前缀合并，这样⼤模型将会学会使⽤"sub"前缀。类似的，"encoded"可以拆解为"encod"+"ed"，“encoding”可以拆解为“encod”+"ing"，这样两个词的核⼼部分"encod"被提取出来了，⽽且还得到时态信息。所以这种子词的处理方式，会让一段内容的Token数量多于单词数量，例如OpenAI的官网上，1000 Tokens大概是750个英文单词上下（500个汉字上下）。

![Image Description](./assets/12-transformer/transformer01.png)
![Image Description](./assets/12-transformer/transformer02.png)
![Image Description](./assets/12-transformer/transformer03.png)
![Image Description](./assets/12-transformer/transformer04.png)
![Image Description](./assets/12-transformer/transformer05.png)

如果输入内容是：海南麒麟瓜<br/>
  海, unicode:28023, utf8:b'\xe6\xb5\xb7'<br/>
  南, unicode:21335, utf8:b'\xe5\x8d\x97'<br/>
  麒, unicode:40594, utf8:b'\xe9\xba\x92'<br/>
  麟, unicode:40607, utf8:b'\xe9\xba\x9f'<br/>
  瓜, unicode:29916, utf8:b'\xe7\x93\x9c'<br/><br/>
  
通过tiktoken处理之后得到的Token序列是：（共11个Token）<br/>
  b'\xe6\xb5\xb7'<br/>
  b'\xe5\x8d\x97'<br/>
  b'\xe9'<br/>
  b'\xba'<br/>
  b'\x92'<br/>
  b'\xe9'<br/>
  b'\xba'<br/>
  b'\x9f'<br/>
  b'\xe7'<br/>
  b'\x93'<br/>
  b'\x9c'<br/><br/>

## Embedding - Token变成向量
### one-hot编码

![Image Description](./assets/12-transformer/transformer06.png)

### 比如一句话：“我饿了，你吃了么？”

![Image Description](./assets/12-transformer/transformer07.png)

### one-hot的一些问题

#### 1、维度过高，过于稀疏：
容纳3000个汉字就需要3000个3000维向量，容纳5000个汉字则需要5000个5000维向量；
#### 2、没有体现出“距离”概念：
如果两个字之间的意思相近，那两个对应的向量求“距离”的时候，就应该更相近；<br/>
![Image Description](./assets/12-transformer/transformer08.png)
#### 3、没有数学或逻辑关系：
最好能满足：国王 - 男人 + 女人 = 女王 <br/><br/>

### 需要了解的几个Embedding模型
#### 1、Word2Vec：Google在2013年提出的概念，也是一个预训练模型
#### 2、OpenAI Embedding Models：就是RAG那节课中，王卓然老师介绍到的OpenAI的API
![Image Description](./assets/12-transformer/transformer09.png)

#### 3、OpenAI Clip Text Encoder：如果一段文本描述的内容，和一张图片包含的内容，是相似或相近的，则生成的向量也是相似度较高的<br/>
![image](./assets/12-transformer/transformer10.png)![image](./assets/12-transformer/transformer11.png)<br/>
![image](./assets/12-transformer/transformer12.png)![image](./assets/12-transformer/transformer13.png)<br/>
![image](./assets/12-transformer/transformer14.png)![image](./assets/12-transformer/transformer15.png)<br/>
![image](./assets/12-transformer/transformer16.png)![image](./assets/12-transformer/transformer17.png)<br/>

> ✅ **Tip:** 划重点：

我们可以通过一个模型把一个Token变成一个Embedding向量、把一个单词变成一个Embedding向量、把一句话变成一个Embedding向量、把一张图变成一个Embedding向量
<br/>

### 这段对话中有650个字，GPT会把这些汉字转换成大概1300个Token，然后再变成1300个Embedding向量
![image](./assets/12-transformer/用户对话.png)
![image](./assets/12-transformer/transformer19.png)
![image](./assets/12-transformer/transformer20.png)
![image](./assets/12-transformer/transformer21.png)<br/>

> ✅ **Tip:** 划重点：

把每一个Token都变成一个512的向量之后，这1300个向量只能代表这1300个Token，并不能充分的体现这段文字的语义。
<br/>

## Encoder & Decoder

![image](./assets/12-transformer/Encoder&Decoder01.png)
![image](./assets/12-transformer/Encoder&Decoder02.png)
![image](./assets/12-transformer/Encoder&Decoder03.png)
![image](./assets/12-transformer/Encoder&Decoder04.png)
![image](./assets/12-transformer/Encoder&Decoder05.png)
![image](./assets/12-transformer/Encoder&Decoder06.png)

### Encoder一般用来做分析，Decoder一般用来做生成，内部核心计算模块以RNN为主
![image](./assets/12-transformer/Encoder&Decoder07.png)
![image](./assets/12-transformer/Encoder&Decoder08.png)
![image](./assets/12-transformer/Encoder&Decoder09.png)
![image](./assets/12-transformer/Encoder&Decoder10.png)
![image](./assets/12-transformer/Encoder&Decoder11.png)

### 过去以RNN为核心的Encoder Decoder有以下几个重要的问题
#### 1、信息丢失
#### 2、无法处理较长句子
#### 3、不能并行计算

## Transformer Encoder & Decoder

### 带有Attention机制的Transformer Encoder
![image](./assets/12-transformer/Encoder&Decoder01.png)
![image](./assets/12-transformer/Encoder&Decoder02.png)
![image](./assets/12-transformer/Encoder&Decoder03.png)
![image](./assets/12-transformer/Encoder&Decoder04.png)
![image](./assets/12-transformer/Encoder&Decoder05.png)
![image](./assets/12-transformer/Encoder&Decoder06.png)
![image](./assets/12-transformer/Encoder&Decoder07.png)

> ✅ **Tip:** 划重点：

Self-Attention之后的输出，每个向量中，除了包含对应Token的向量数据之外，还加入了上下文中其它所有Token以关联程度为系数的向量数据
<br/>

![image](./assets/12-transformer/Encoder&Decoder08.png)
<br/><br/>
![image](./assets/12-transformer/Encoder&Decoder09.png)
<br/><br/>
![image](./assets/12-transformer/Encoder&Decoder10.png)
<br/><br/>
![image](./assets/12-transformer/Encoder&Decoder11.png)
![image](./assets/12-transformer/Encoder&Decoder12.png)
![image](./assets/12-transformer/Encoder&Decoder13.png)

![image](./assets/12-transformer/Encoder&Decoder14.png)

### 带有Attention机制的Transformer Decoder

![image](./assets/12-transformer/Encoder&Decoder15.png)
![image](./assets/12-transformer/Encoder&Decoder16.png)
![image](./assets/12-transformer/Encoder&Decoder17.png)

### Encoder only & Decoder only

![image](./assets/12-transformer/Encoder&Decoder18.png)
![image](./assets/12-transformer/Encoder&Decoder19.png)
![image](./assets/12-transformer/Encoder&Decoder20.png)

# 5. 新模型框架的重要尝试

## Transformer的O(n^2)计算复杂度
![image](./assets/12-transformer/new01.png)

## RWKV的线性注意力机制
![image](./assets/12-transformer/new02.png)

## Mamba的选择性SSM架构
![image](./assets/12-transformer/new03.png)

## MoE 混合专家模型
![image](./assets/12-transformer/new04.png)