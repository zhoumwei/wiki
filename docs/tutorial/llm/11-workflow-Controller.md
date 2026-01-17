# 11 Workflow   Controller



### 案例：使用工作流实现通过自然语言进行设备控制

```python
# 准备设备基本信息和控制指令
def turn_on_camera(camera_name):
    print(f"[打开相机]: { camera_name }")
    return { "camera_name": camera_name, "power": 1 }

def turn_off_camera(camera_name):
    print(f"[关闭相机]: { camera_name }")
    return { "camera_name": camera_name, "power": 0 }

def zoom_camera(target_camera, target_zoom_factor):
    print(f"[焦距变化]: { target_camera } to { target_zoom_factor }")
    return { "camera_name": target_camera, "zoom_factor": target_zoom_factor }

op_dict = {
    "turn_on_camera": {
        "desc": "turn on the camera",
        "args": {
            "camera_name": ("'camera_1' | 'camera_2'", "[Required]"),
        },
        "func": turn_on_camera,
        "get": [ "camera_status" ],
        "set": { "camera_status.<$camera_name>.power": "<$power>" },
    },
    "turn_off_camera": {
        "desc": "turn off the camera",
        "args": {
            "camera_name": ("'camera_1' | 'camera_2'", "[Required]"),
        },
        "func": turn_off_camera,
        "get": [ "camera_status" ],
        "set": { "camera_status.<$camera_name>.power": "<$power>" },
    },
    "zoom": {
        "desc": "change zoom factor",
        "args": {
            "target_camera": ("'camera_1' | 'camera_2'", "[Required]"),
            "target_zoom_factor": ("float", "[Optional] Reset current zoom factor of the camera to target zoom factor.")
        },
        "func": zoom_camera,
        "get": [ "camera_status" ],
        "set": { "camera_status.<$camera_name>.zoom_factor": "<$zoom_factor>" },
    },
}

op_desc_dict = {}
for function_name in op_dict.keys():
    op_desc_dict.update({ function_name: {
        "desc": op_dict[function_name]["desc"],
        "args": list(op_dict[function_name].keys())
    } })
```

```python
import re
import os
import Agently

agent = (
    Agently.create_agent()
        .set_settings("current_model", "OAIClient")
        .set_settings("model.OAIClient.url", os.environ["OPENAI_BASE_URL"])
        .set_settings("model.OAIClient.auth", { "api_key": os.environ["OPENAI_API_KEY"] })
        .set_settings("model.OAIClient.options", { "model": "gpt-4" })
)

workflow = Agently.Workflow()
op_workflow = Agently.Workflow()

# 把相关信息存储到Workflow公共存储中去
workflow.public_storage.update_by_dict({
    "status":{
        "camera_status" : {
            "camera_1": {
                "power": 1,
                "zoom_factor": 1.0,
            },
            "camera_2": {
                "power": 0,
                "zoom_factor": 1.0,
            },
        },
    },
    "op_dict": op_dict,
    "op_desc_dict": op_desc_dict,
})

# 占位符替换函数（用于更新环境信息）
def replace_placeholders(origin_text, key_values):
    def replace(match):
        key = match.group(1)
        return key_values.get(key, match.group(0))
    
    pattern = r'<\$(\w+)>'
    return (
        key_values[origin_text[2:-1]]
        if origin_text.startswith("<$") and origin_text.endswith(">")
        else re.sub(pattern, replace, origin_text)
    )

# 定义工作块
@workflow.chunk()
def init_data(inputs, storage):
    storage.set("user_input", inputs["default"])
    return

@workflow.chunk()
def make_op_plan(inputs, storage):
    return (
        agent
            .input(storage.get("user_input"))
            .info({
                "current_equipment_status": workflow.public_storage.get("status"),
                "operation_dict": op_desc_dict,
            })
            .output({                
                "can_reply_directly": ("bool", "can you reply {input} directly according {info.current_equipment_status}?"),
                "direct_reply": ("str", "if {output.can_reply_directly} == true, generate reply, else output null."),
                "action_plan": (
                    [{
                        "purpose": ("str", "specify user one step operating purpose from {input}, must include key matters according {info}"),
                        "key_factors": ([("str", )], "specify this step's key factors, object name, quantity, etc."),
                        "op_name": ("str", "key name from {info.operation_dict}"),
                    }],
                    "if {output.can_reply_directly} == false, " +
                    "make operating plan according {input} and split operation according {info.operation_dict} in correct orders, " +
                    "else output [].\n" +
                    "IF MULTIPLE DEVICE COMPONENTS NEED TO BE OPERATED THROUGH INSTRUCTIONS, " +
                    "EACH ACTION INSTRUCTION CAN ONLY SPECIFY ONE COMPONENT\n" +
                    "For example: when user said 'all cameras' you should seperate cameras into camera 1, camera 2, etc."
                )
            })
            .start()
    )

@workflow.chunk()
def direct_reply(inputs, storage):
    print("[直接回复]:", inputs["default"]["direct_reply"])
    return

@op_workflow.chunk()
def init_data(inputs, storage):
    storage.set("purpose", inputs["default"]["purpose"])
    storage.set("key_factors", inputs["default"]["key_factors"])
    storage.set("op_name", inputs["default"]["op_name"])
    return

@op_workflow.chunk()
def prepare_env_info(inputs, storage):
    info_dict = {}
    get_list = workflow.public_storage.get(f"op_dict.{ storage.get('op_name') }.get", [])
    for info_name in get_list:
        info_dict.update({ info_name: workflow.public_storage.get(f"status.{ info_name }") })
    return info_dict

@op_workflow.chunk()
def generate_calling_info(inputs, storage):
    return (
        agent
            .input({
                "purpose": storage.get("purpose"),
                "key_factors": storage.get("key_factors"),
            })
            .info(inputs["default"])
            .instruct([
                "generate operation calling parameter values to achieve {input} purpose.",
                "output language: Chinese",
            ])
            .output({
                "can_do": ("bool", "judge if operation can be done according {info}"),
                "explanation": ("str | null", "if {can_do}==false, generate explanation why the operation can no be done and operation suggestions in language {input} used."),
                "suggestion_order": ("str | null", "if {can_do}==false, generate order you suggest user to say, do not use args name directly, use natural language to point to args."),
                "args": (
                    workflow.public_storage.get(f"op_dict.{ storage.get('op_name') }.args"),
                    "if {can_do}==true, generate args"
                ),
            })
            .start()
    )

@op_workflow.chunk()
def call_op(inputs, storage):
    return workflow.public_storage.get(f"op_dict.{ storage.get('op_name') }.func")(**inputs["default"]["args"])

@op_workflow.chunk()
def update_env_info(inputs, storage):
    set_dict = workflow.public_storage.get(f"op_dict.{ storage.get('op_name') }.set")
    for key, value in set_dict.items():
        target_key = replace_placeholders(key, inputs["default"])
        target_value = replace_placeholders(value, inputs["default"])
        workflow.public_storage.set(f"status.{ target_key }", target_value)
        print("[信息更新]:", f"{ target_key } = { target_value }")
    return

@op_workflow.chunk()
def set_skip_data(inputs, storage):
    workflow.public_storage.set("skip", True)
    workflow.public_storage.set("explanation", inputs["default"]["explanation"])
    workflow.public_storage.set("suggestion_order", inputs["default"]["suggestion_order"])
    return

@workflow.chunk()
def return_value(inputs, storage):
    skip = workflow.public_storage.get("skip")
    explanation = workflow.public_storage.get("explanation")
    suggestion_order = workflow.public_storage.get("suggestion_order")
    workflow.public_storage.set("explanation", None)
    workflow.public_storage.set("suggestion_order", None)
    workflow.public_storage.set("skip", False)
    return {
        "explanation": explanation,
        "suggestion_order": suggestion_order,
    } if skip else None

def print_result(inputs, storage):
    print(inputs["default"])
    return inputs["default"]

# 定义工作流
(
    op_workflow
        .connect_to("init_data")
        .if_condition(lambda return_value, storage: not workflow.public_storage.get("skip"))
            .connect_to("prepare_env_info")
            #.connect_to(print_result)
            .connect_to("generate_calling_info")
            #.connect_to(print_result)
            .if_condition(lambda return_value, storage: return_value["can_do"])
                .connect_to("call_op")
                #.connect_to(print_result)
                .connect_to("update_env_info")
                .connect_to("END")
            .else_condition()
                .connect_to("set_skip_data")
                .connect_to("END")
            .end_condition()
        .end_condition()
)
(
    workflow
        .connect_to("init_data")
        .connect_to("make_op_plan")
        #.connect_to(print_result)
        .if_condition(lambda return_value, storage: return_value["can_reply_directly"])
            .connect_to("direct_reply")
            .connect_to("END")
        .else_condition()
            .connect_to(lambda inputs, storage: inputs["default"]["action_plan"])
            .loop_with(op_workflow)
            .connect_to("return_value")
            .connect_to("END")
        .end_condition()
)
pass
```

```python
workflow.draw(type="img")
```

```python
print(workflow.draw())
```

**Output:**
```
%%{ init: { 'flowchart': { 'curve': 'linear' }, 'theme': 'neutral' } }%%
%% Rendered By Agently %%
flowchart LR
classDef chunk_style fill:#fbfcdb,stroke:#666,stroke-width:1px,color:#333;
classDef condition_chunk_style fill:#ECECFF,stroke:#9370DB,stroke-width:1px,color:#333;
classDef loop_style fill:#f5f7fa,stroke:#666,stroke-width:1px,color:#333,stroke-dasharray: 5 5
    subgraph Loop_1
    direction LR
    120b9218-75e6-4c11-8df0-c8cd89d6e3ab("START"):::chunk_style -.-> |"* -->-- default"| 7cfecd9a-0487-4a5b-a99f-35511d313584("init_data"):::chunk_style
    7cfecd9a-0487-4a5b-a99f-35511d313584("init_data"):::chunk_style -.-> |"* -->-- default"| a6db2fe8-2f79-4686-ab97-119233dfaaa0{{"Condition"}}:::condition_chunk_style
    a6db2fe8-2f79-4686-ab97-119233dfaaa0{{"Condition"}}:::condition_chunk_style -.-> |"* -- ◇ -- default"| d56beb0d-f100-43a1-b20d-b7f08c2e57e7("prepare_env_info"):::chunk_style
    d56beb0d-f100-43a1-b20d-b7f08c2e57e7("prepare_env_info"):::chunk_style -.-> |"* -->-- default"| 2933154b-6014-4c9d-95da-18e582ea87e3("generate_calling_info"):::chunk_style
    2933154b-6014-4c9d-95da-18e582ea87e3("generate_calling_info"):::chunk_style -.-> |"* -->-- default"| 58b4f10c-40b6-4c6d-bac2-384c4eb6392e{{"Condition"}}:::condition_chunk_style
    58b4f10c-40b6-4c6d-bac2-384c4eb6392e{{"Condition"}}:::condition_chunk_style -.-> |"* -- ◇ -- default"| 496f67cd-2095-47f9-9167-1758f3b7e01f("call_op"):::chunk_style
    496f67cd-2095-47f9-9167-1758f3b7e01f("call_op"):::chunk_style -.-> |"* -->-- default"| 5b8d29c3-9b04-4ea9-9f06-d359e8487b7d("update_env_info"):::chunk_style
    5b8d29c3-9b04-4ea9-9f06-d359e8487b7d("update_env_info"):::chunk_style -.-> |"* -->-- default"| 14a12dd3-1bb5-482b-b314-0b5b658d8316("END"):::chunk_style
    58b4f10c-40b6-4c6d-bac2-384c4eb6392e{{"Condition"}}:::condition_chunk_style -.-> |"* -- ◇ -- default"| 06525746-cb52-4279-aabb-434fee028c31("set_skip_data"):::chunk_style
    06525746-cb52-4279-aabb-434fee028c31("set_skip_data"):::chunk_style -.-> |"* -->-- default"| 14a12dd3-1bb5-482b-b314-0b5b658d8316("END"):::chunk_style
    end
    442d8263-7d44-43a5-9a99-4268d6057c2c("START"):::chunk_style -.-> |"* -->-- default"| 3f256ce2-b66f-4a11-9936-d5b7024a9728("init_data"):::chunk_style
    3f256ce2-b66f-4a11-9936-d5b7024a9728("init_data"):::chunk_style -.-> |"* -->-- default"| 5f4ad5cf-5965-4417-95b0-0c48c1c517f6("make_op_plan"):::chunk_style
    5f4ad5cf-5965-4417-95b0-0c48c1c517f6("make_op_plan"):::chunk_style -.-> |"* -->-- default"| ba2ffc8f-9cdc-4435-b46b-4e1eabf5e7b8{{"Condition"}}:::condition_chunk_style
    ba2ffc8f-9cdc-4435-b46b-4e1eabf5e7b8{{"Condition"}}:::condition_chunk_style -.-> |"* -- ◇ -- default"| fb9c0a16-b81d-4e25-932b-0d96534ef723("direct_reply"):::chunk_style
    fb9c0a16-b81d-4e25-932b-0d96534ef723("direct_reply"):::chunk_style -.-> |"* -->-- default"| d0cbeec6-ba36-43eb-a330-d88f4d1762f9("END"):::chunk_style
    ba2ffc8f-9cdc-4435-b46b-4e1eabf5e7b8{{"Condition"}}:::condition_chunk_style -.-> |"* -- ◇ -- default"| 29777879-0d45-44b3-9ba5-045f7689b8a8("lambda-f95a25e2-a60f-4c2e-be51-07d12695e5a7"):::chunk_style
    29777879-0d45-44b3-9ba5-045f7689b8a8("lambda-f95a25e2-a60f-4c2e-be51-07d12695e5a7"):::chunk_style -.-> |"* -->-- default"| Loop_1:::loop_style
    Loop_1:::loop_style -.-> |"* -->-- default"| 699e9a04-4274-4387-9db8-fabdc134ba40("return_value"):::chunk_style
    699e9a04-4274-4387-9db8-fabdc134ba40("return_value"):::chunk_style -.-> |"* -->-- default"| d0cbeec6-ba36-43eb-a330-d88f4d1762f9("END"):::chunk_style
```

```python
is_end = ""
user_input = None
while not is_end.lower() == "y":
    if not user_input:
        result = workflow.start(input("[用户输入]:"))
    else:
        result = workflow.start(user_input)
    if result["default"] and "suggestion_order" in result["default"]:
        print(f"[无法操作]: 原因是{ result['default']['explanation'] }")
        accept_confirm = ""
        while accept_confirm.lower() not in ("y", "n"):
            print(f"[建议指令]: { result['default']['suggestion_order'] }")
            accept_confirm = input("[是否接受](y/n):")
        if accept_confirm == "y":
            user_input = result["default"]["suggestion_order"]
        else:
            is_end = ""
            user_input = None
    else:
        while is_end.lower() not in ("y", "n"):
            is_end = input("[是否结束](y/n):")
        if is_end.lower() == "n":
            is_end = ""
            user_input = None
```

**Output:**
```
[用户输入]: 报告设备状态
[直接回复]: 当前设备状态：摄像头1和摄像头2都已开启，放大倍数为2.0。
[是否结束](y/n): n
[用户输入]: 关闭摄像头1
{'default': {'purpose': 'turn off camera 1', 'key_factors': ['camera_1'], 'op_name': 'turn_off_camera'}}
[关闭相机]: camera_1
[信息更新]: camera_status.camera_1.power = 0
[是否结束](y/n): n
[用户输入]: 所有摄像头放大2倍
{'default': {'purpose': 'Change zoom factor of Camera 1', 'key_factors': ['Camera 1', '4.0'], 'op_name': 'zoom'}}
{'default': {'purpose': 'Change zoom factor of Camera 2', 'key_factors': ['Camera 2', '4.0'], 'op_name': 'zoom'}}
[无法操作]: 原因是摄像机 1 当前没有开启，无法调整其缩放系数。
[建议指令]: 请您首先打开摄像机 1，然后再尝试更改其缩放系数。
[是否接受](y/n): y
{'default': {'purpose': 'turn on camera 1', 'key_factors': ['camera 1'], 'op_name': 'turn_on_camera'}}
[打开相机]: camera_1
[信息更新]: camera_status.camera_1.power = 1
{'default': {'purpose': 'change zoom factor of camera 1', 'key_factors': ['camera 1'], 'op_name': 'zoom'}}
[焦距变化]: camera_1 to 2.0
[信息更新]: camera_status.camera_1.zoom_factor = 2.0
[是否结束](y/n): y
```