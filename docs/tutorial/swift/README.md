# Swift学习教程

## 1. Swift基础语法

### Q1: 什么是Swift？它有什么特点？
**答：** Swift是苹果公司开发的现代化编程语言，用于开发iOS、macOS、watchOS和tvOS应用。

主要特点：
- **安全**：通过可选类型、类型推断等特性减少运行时错误
- **现代**：支持函数式编程、面向协议编程等现代编程范式
- **快速**：编译型语言，性能接近C语言
- **易读**：语法简洁明了，易于学习和使用
- **交互式**：支持Playground实时编程环境
- **兼容性**：与Objective-C代码可以互操作

### Q2: Swift的基本数据类型有哪些？
**答：** Swift的基本数据类型包括：

1. **整数类型**：
   - `Int`：有符号整数（平台相关大小）
   - `UInt`：无符号整数
   - 特定大小：`Int8`、`Int16`、`Int32`、`Int64`、`UInt8`等

2. **浮点数类型**：
   - `Float`：32位浮点数
   - `Double`：64位浮点数（默认）

3. **布尔类型**：
   - `Bool`：只有`true`和`false`两个值

4. **字符串类型**：
   - `String`：文本数据类型

5. **字符类型**：
   - `Character`：单个字符

示例：
```swift
let integer: Int = 42
let double: Double = 3.14159
let boolean: Bool = true
let string: String = "Hello, Swift!"
let character: Character = "A"
```

### Q3: Swift的变量和常量声明？
**答：** Swift使用`let`声明常量，`var`声明变量：

```swift
// 常量声明
let constantValue = 10
// constantValue = 20 // 错误：不能修改常量

// 变量声明
var variableValue = 10
variableValue = 20 // 正确：可以修改变量

// 显式类型声明
let explicitDouble: Double = 70
let explicitString: String = "Hello"

// 类型推断
let implicitInteger = 70 // 推断为Int
let implicitDouble = 70.0 // 推断为Double
```

## 2. 控制流和函数

### Q4: Swift的控制流语句？
**答：** Swift的控制流语句包括：

**条件语句**：
```swift
// if语句
let temperature = 25
if temperature > 30 {
    print("天气很热")
} else if temperature > 20 {
    print("天气温暖")
} else {
    print("天气凉爽")
}

// guard语句（守护语句）
func greet(person: [String: String]) {
    guard let name = person["name"] else {
        print("姓名不存在")
        return
    }
    print("Hello, \(name)")
}
```

**循环语句**：
```swift
// for-in循环
let names = ["Anna", "Brian", "Jack"]
for name in names {
    print("Hello, \(name)")
}

// 数值范围循环
for index in 1...5 {
    print("\(index) times 5 is \(index * 5)")
}

// while循环
var count = 0
while count < 3 {
    print("count is \(count)")
    count += 1
}

// repeat-while循环（do-while）
var repeatCount = 0
repeat {
    print("repeat count is \(repeatCount)")
    repeatCount += 1
} while repeatCount < 3
```

### Q5: Swift函数的定义和使用？
**答：** Swift函数的定义和使用：

**基本函数定义**：
```swift
// 无参数无返回值
func sayHello() {
    print("Hello!")
}

// 有参数无返回值
func greet(person: String) {
    print("Hello, \(person)!")
}

// 有参数有返回值
func add(a: Int, b: Int) -> Int {
    return a + b
}

// 多个返回值
func getMinMax(scores: [Int]) -> (min: Int, max: Int) {
    return (scores.min()!, scores.max()!)
}
```

**参数标签**：
```swift
// 使用参数标签
func greet(to person: String, from hometown: String) {
    print("Hello \(person)! Glad you could visit from \(hometown).")
}

greet(to: "Bill", from: "Cupertino")

// 忽略参数标签
func someFunction(_ firstParameterName: Int, secondParameterName: Int) {
    // firstParameterName的参数标签被忽略
}

someFunction(1, secondParameterName: 2)
```

**可变参数和默认参数**：
```swift
// 可变参数
func arithmeticMean(_ numbers: Double...) -> Double {
    var total: Double = 0
    for number in numbers {
        total += number
    }
    return total / Double(numbers.count)
}

// 默认参数值
func someFunction(parameterWithoutDefault: Int, parameterWithDefault: Int = 12) {
    // 如果在调用时没有传入第二个参数，parameterWithDefault的值为12
}
```

### Q6: Swift的闭包？
**答：** 闭包是自包含的功能代码块，可以在代码中被传递和使用。

**基本语法**：
```swift
{ (parameters) -> returnType in
    statements
}
```

**示例**：
```swift
// 简单闭包
let closure = { (name: String) -> String in
    return "Hello, \(name)"
}

// 闭包作为函数参数
func calculate(_ a: Int, _ b: Int, operation: (Int, Int) -> Int) -> Int {
    return operation(a, b)
}

let result = calculate(5, 3) { (x, y) -> Int in
    return x + y
}

// 尾随闭包
let names = ["Chris", "Alex", "Ewa", "Barry", "Daniella"]
let reversedNames = names.sorted { $0 > $1 }

// 简化尾随闭包
let mappedNumbers = [1, 2, 3, 4].map { $0 * 2 }
```

## 3. 面向对象编程

### Q7: Swift的类和结构体？
**答：** Swift中的类和结构体都是用于创建自定义数据类型的机制。

**类的定义**：
```swift
class Person {
    var name: String
    var age: Int
    
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
    
    func introduce() {
        print("我是\(name)，今年\(age)岁")
    }
}

let person = Person(name: "张三", age: 25)
person.introduce()
```

**结构体的定义**：
```swift
struct Point {
    var x: Double
    var y: Double
    
    func distance(from other: Point) -> Double {
        let dx = x - other.x
        let dy = y - other.y
        return sqrt(dx * dx + dy * dy)
    }
}

var point1 = Point(x: 0, y: 0)
let point2 = Point(x: 3, y: 4)
print(point1.distance(from: point2)) // 输出: 5.0
```

**类和结构体的区别**：
1. **继承**：类可以继承，结构体不能
2. **类型**：类是引用类型，结构体是值类型
3. **析构器**：类可以定义析构器，结构体不能
4. **引用计数**：类使用引用计数，结构体不使用

### Q8: Swift的协议（Protocol）？
**答：** 协议定义了一个蓝图，规定了符合协议的类型必须实现的属性、方法和其他要求。

**协议定义**：
```swift
protocol Drawable {
    var lineWidth: Double { get set }
    func draw()
}

protocol Resizable {
    mutating func resize(to scale: Double)
}

// 符合多个协议
struct Rectangle: Drawable, Resizable {
    var lineWidth: Double = 1.0
    var width: Double
    var height: Double
    
    func draw() {
        print("绘制矩形，线宽: \(lineWidth)")
    }
    
    mutating func resize(to scale: Double) {
        width *= scale
        height *= scale
    }
}
```

**协议继承**：
```swift
protocol Shape: Drawable {
    var area: Double { get }
}

protocol Renderable {
    func render()
}

// 协议继承
protocol RenderableShape: Shape, Renderable {
    // 继承了Shape和Renderable的所有要求
}
```

### Q9: Swift的枚举？
**答：** Swift的枚举为一组相关的值定义了一个通用类型。

**基本枚举**：
```swift
enum CompassPoint {
    case north
    case south
    case east
    case west
}

var direction = CompassPoint.north
direction = .south // 类型已知时可以省略枚举名

// Switch语句匹配枚举
switch direction {
case .north:
    print("向北")
case .south:
    print("向南")
case .east:
    print("向东")
case .west:
    print("向西")
}
```

**关联值**：
```swift
enum Barcode {
    case upc(Int, Int, Int, Int)
    case qrCode(String)
}

var productBarcode = Barcode.upc(8, 85909, 51226, 3)
productBarcode = .qrCode("ABCDEFGHIJKLMNOP")

switch productBarcode {
case .upc(let numberSystem, let manufacturer, let product, let check):
    print("UPC: \(numberSystem), \(manufacturer), \(product), \(check).")
case .qrCode(let productCode):
    print("QR code: \(productCode).")
}
```

**原始值**：
```swift
enum Planet: Int {
    case mercury = 1
    case venus
    case earth
    case mars
    case jupiter
    case saturn
    case uranus
    case neptune
}

let earth = Planet.earth
print(earth.rawValue) // 输出: 3

// 通过原始值创建枚举实例
let possiblePlanet = Planet(rawValue: 7)
// possiblePlanet是Planet?类型，可能是nil
```

## 4. 高级特性

### Q10: Swift的可选类型（Optionals）？
**答：** 可选类型是Swift中处理值可能不存在的情况的安全机制。

**可选类型的声明和使用**：
```swift
// 可选类型声明
var optionalString: String? = "Hello"
optionalString = nil // 可以赋值为nil

var optionalInt: Int? = 42

// 强制解包（不安全）
if optionalString != nil {
    print(optionalString!) // 使用感叹号强制解包
}

// 可选绑定（安全）
if let unwrappedString = optionalString {
    print(unwrappedString) // 在if块内unwrappedString是非可选的
}

// 可选链
let names = ["John", "Paul", "George", "Ringo"]
let count = names.first?.count // 返回Int?

// 空合并运算符
let defaultName = optionalString ?? "Unknown" // 如果optionalString为nil，则使用"Unknown"
```

**guard语句处理可选类型**：
```swift
func greet(person: [String: String]) {
    guard let name = person["name"] else {
        print("姓名不存在")
        return
    }
    
    guard let location = person["location"] else {
        print("你好，\(name)")
        return
    }
    
    print("你好，\(name)，欢迎来自\(location)")
}
```

### Q11: Swift的扩展（Extensions）？
**答：** 扩展可以为已有的类、结构体、枚举或协议类型添加新功能。

**扩展示例**：
```swift
// 为Double类型添加计算属性
extension Double {
    var km: Double { return self * 1000.0 }
    var m: Double { return self }
    var cm: Double { return self / 100.0 }
    var mm: Double { return self / 1000.0 }
}

let oneInch = 25.4.mm
print("One inch is \(oneInch) meters") // 输出: One inch is 0.0254 meters

// 为现有类型添加方法
extension Int {
    func repetitions(task: () -> Void) {
        for _ in 0..<self {
            task()
        }
    }
}

3.repetitions {
    print("Hello!")
}

// 为现有类型添加便利构造器
extension Rect {
    init(center: Point, size: Size) {
        let originX = center.x - (size.width / 2)
        let originY = center.y - (size.height / 2)
        self.init(origin: Point(x: originX, y: originY), size: size)
    }
}
```

### Q12: Swift的泛型？
**答：** 泛型允许你编写灵活且可重用的函数和类型，可以处理任何类型。

**泛型函数**：
```swift
func swapTwoValues<T>(_ a: inout T, _ b: inout T) {
    let temporaryA = a
    a = b
    b = temporaryA
}

var someInt = 3
var anotherInt = 107
swapTwoValues(&someInt, &anotherInt)
// someInt现在是107，anotherInt现在是3

var someString = "hello"
var anotherString = "world"
swapTwoValues(&someString, &anotherString)
// someString现在是"world"，anotherString现在是"hello"
```

**泛型类型**：
```swift
struct Stack<Element> {
    var items = [Element]()
    
    mutating func push(_ item: Element) {
        items.append(item)
    }
    
    mutating func pop() -> Element? {
        return items.popLast()
    }
}

var stackOfStrings = Stack<String>()
stackOfStrings.push("uno")
stackOfStrings.push("dos")
stackOfStrings.push("tres")
stackOfStrings.push("cuatro")

if let poppedString = stackOfStrings.pop() {
    print("弹出的元素是：\(poppedString)") // 输出: 弹出的元素是：cuatro
}
```

**泛型约束**：
```swift
// 约束泛型类型必须符合Equatable协议
func findIndex<T: Equatable>(of valueToFind: T, in array: [T]) -> Int? {
    for (index, value) in array.enumerated() {
        if value == valueToFind {
            return index
        }
    }
    return nil
}

let doubleIndex = findIndex(of: 9.3, in: [3.14159, 0.1, 0.25])
// doubleIndex是nil，因为在数组中没有找到9.3

let stringIndex = findIndex(of: "Andrea", in: ["Mike", "Malcolm", "Andrea"])
// stringIndex是2
```

## 5. Swift内存管理

### Q13: Swift的自动引用计数（ARC）？
**答：** Swift使用自动引用计数（Automatic Reference Counting, ARC）来跟踪和管理应用的内存使用。

**ARC工作原理**：
```swift
class Person {
    let name: String
    init(name: String) {
        self.name = name
        print("\(name) is being initialized")
    }
    deinit {
        print("\(name) is being deinitialized")
    }
}

var reference1: Person?
var reference2: Person?
var reference3: Person?

reference1 = Person(name: "John Appleseed")
// 输出: John Appleseed is being initialized

reference2 = reference1
reference3 = reference1

reference1 = nil
reference2 = nil
// 此时不会调用析构器，因为reference3仍然强引用着实例

reference3 = nil
// 输出: John Appleseed is being deinitialized
```

**循环强引用问题**：
```swift
class Person {
    let name: String
    var apartment: Apartment?
    
    init(name: String) { self.name = name }
    deinit { print("\(name) is being deinitialized") }
}

class Apartment {
    let unit: String
    var tenant: Person?
    
    init(unit: String) { self.unit = unit }
    deinit { print("Apartment \(unit) is being deinitialized") }
}

var john: Person?
var unit4A: Apartment?

john = Person(name: "John")
unit4A = Apartment(unit: "4A")

john!.apartment = unit4A
unit4A!.tenant = john

john = nil
unit4A = nil
// 两者都不会被释放，因为存在循环强引用
```

**解决循环强引用**：
```swift
// 弱引用解决循环强引用
class Apartment {
    let unit: String
    weak var tenant: Person? // 使用weak关键字
    
    init(unit: String) { self.unit = unit }
    deinit { print("Apartment \(unit) is being deinitialized") }
}

// 无主引用解决循环强引用
class Customer {
    let name: String
    var card: CreditCard!
    init(name: String) {
        self.name = name
    }
    deinit { print("\(name) is being deinitialized") }
}

class CreditCard {
    let number: UInt64
    unowned let customer: Customer // 使用unowned关键字
    
    init(number: UInt64, customer: Customer) {
        self.number = number
        self.customer = customer
    }
    deinit { print("Card #\(number) is being deinitialized") }
}
```

### Q14: Swift的错误处理？
**答：** Swift提供了一套完整的错误处理机制。

**定义和抛出错误**：
```swift
enum VendingMachineError: Error {
    case invalidSelection
    case insufficientFunds(coinsNeeded: Int)
    case outOfStock
}

struct Item {
    var price: Int
    var count: Int
}

class VendingMachine {
    var inventory = [
        "Candy Bar": Item(price: 12, count: 7),
        "Chips": Item(price: 10, count: 4),
        "Pretzels": Item(price: 7, count: 11)
    ]
    var coinsDeposited = 0
    
    func vend(itemNamed name: String) throws {
        guard let item = inventory[name] else {
            throw VendingMachineError.invalidSelection
        }
        
        guard item.count > 0 else {
            throw VendingMachineError.outOfStock
        }
        
        guard item.price <= coinsDeposited else {
            throw VendingMachineError.insufficientFunds(coinsNeeded: item.price - coinsDeposited)
        }
        
        coinsDeposited -= item.price
        inventory[name]!.count -= 1
        print("Dispensing \(name)")
    }
}
```

**捕获和处理错误**：
```swift
let favoriteSnacks = [
    "Alice": "Chips",
    "Bob": "Licorice",
    "Eve": "Pretzels",
]

func buyFavoriteSnack(person: String, vendingMachine: VendingMachine) throws {
    let snackName = favoriteSnacks[person] ?? "Candy Bar"
    try vendingMachine.vend(itemNamed: snackName)
}

var vendingMachine = VendingMachine()
vendingMachine.coinsDeposited = 8

do {
    try buyFavoriteSnack(person: "Alice", vendingMachine: vendingMachine)
    print("Success! Yum.")
} catch VendingMachineError.invalidSelection {
    print("Invalid Selection.")
} catch VendingMachineError.outOfStock {
    print("Out of Stock.")
} catch VendingMachineError.insufficientFunds(let coinsNeeded) {
    print("Insufficient funds. Please insert an additional \(coinsNeeded) coins.")
} catch {
    print("Unexpected error: \(error).")
}
```

## 6. Swift并发编程

### Q15: Swift的并发编程（async/await）？
**答：** Swift 5.5引入了现代并发模型，包括async/await、actors等特性。

**异步函数**：
```swift
// 异步函数定义
func fetchAvatar imageURL: URL) async throws -> UIImage {
    let (data, _) = try await URLSession.shared.data(from: imageURL)
    guard let image = UIImage(data: data) else {
        throw ImageError.invalidData
    }
    return image
}

// 调用异步函数
Task {
    do {
        let avatar = try await fetchAvatar(imageURL: url)
        // 更新UI
        DispatchQueue.main.async {
            imageView.image = avatar
        }
    } catch {
        print("Failed to load avatar: \(error)")
    }
}
```

**结构化并发**：
```swift
// 并发执行多个任务
func fetchMultipleImages() async {
    async let image1 = fetchAvatar(imageURL: url1)
    async let image2 = fetchAvatar(imageURL: url2)
    async let image3 = fetchAvatar(imageURL: url3)
    
    do {
        let images = try await [image1, image2, image3]
        // 所有图片都加载完成后执行
        updateUI(with: images)
    } catch {
        print("Failed to fetch images: \(error)")
    }
}

// 任务组
func fetchImagesConcurrently(urls: [URL]) async throws -> [UIImage] {
    return try await withThrowingTaskGroup(of: UIImage.self) { group in
        for url in urls {
            group.addTask {
                return try await fetchAvatar(imageURL: url)
            }
        }
        
        var images: [UIImage] = []
        for try await image in group {
            images.append(image)
        }
        return images
    }
}
```

### Q16: Swift的Actor模型？
**答：** Actor是Swift并发模型中的一个重要概念，用于保护可变状态免受数据竞争的影响。

**Actor定义**：
```swift
actor ImageDownloader {
    private var cache: [URL: UIImage] = [:]
    
    func downloadImage(from url: URL) async throws -> UIImage {
        // 检查缓存
        if let cachedImage = cache[url] {
            return cachedImage
        }
        
        // 下载图片
        let (data, _) = try await URLSession.shared.data(from: url)
        guard let image = UIImage(data: data) else {
            throw ImageError.invalidData
        }
        
        // 缓存图片
        cache[url] = image
        return image
    }
    
    func clearCache() {
        cache.removeAll()
    }
}

// 使用Actor
let downloader = ImageDownloader()

Task {
    do {
        let image = try await downloader.downloadImage(from: imageURL)
        // 使用图片
    } catch {
        print("Failed to download image: \(error)")
    }
}
```

**全局Actor**：
```swift
// 主Actor，用于UI更新
@MainActor
class ViewModel: ObservableObject {
    @Published var imageData: Data? = nil
    
    func loadImage(from url: URL) async {
        do {
            let (data, _) = try await URLSession.shared.data(from: url)
            // 自动在主线程更新
            self.imageData = data
        } catch {
            print("Failed to load image: \(error)")
        }
    }
}
```

## 7. Swift生态系统

### Q17: Swift包管理器（Swift Package Manager）？
**答：** Swift Package Manager是Swift的官方依赖管理工具。

**Package.swift文件示例**：
```swift
// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "MyLibrary",
    platforms: [
        .macOS(.v10_15),
        .iOS(.v13)
    ],
    products: [
        .library(
            name: "MyLibrary",
            targets: ["MyLibrary"]
        )
    ],
    dependencies: [
        .package(url: "https://github.com/apple/swift-algorithms", from: "1.0.0"),
        .package(url: "https://github.com/vapor/vapor.git", from: "4.0.0")
    ],
    targets: [
        .target(
            name: "MyLibrary",
            dependencies: [
                .product(name: "Algorithms", package: "swift-algorithms")
            ]
        ),
        .testTarget(
            name: "MyLibraryTests",
            dependencies: ["MyLibrary"]
        )
    ]
)
```

**常用命令**：
```bash
# 创建新包
swift package init

# 创建可执行包
swift package init --type executable

# 解析和下载依赖
swift package resolve

# 构建项目
swift build

# 运行项目
swift run

# 运行测试
swift test

# 生成Xcode项目
swift package generate-xcodeproj
```

### Q18: Swift测试框架？
**答：** Swift使用XCTest作为官方测试框架。

**单元测试示例**：
```swift
import XCTest
@testable import MyApp

class MathTests: XCTestCase {
    
    func testAddition() {
        XCTAssertEqual(add(2, 3), 5, "2 + 3 should equal 5")
    }
    
    func testSubtraction() {
        XCTAssertEqual(subtract(5, 3), 2, "5 - 3 should equal 2")
    }
    
    func testDivisionByZero() {
        XCTAssertThrowsError(try divide(10, 0)) { error in
            XCTAssertTrue(error is MathError)
        }
    }
    
    // 性能测试
    func testPerformanceExample() {
        measure {
            // 要测量性能的代码
            for _ in 0..<1000000 {
                _ = 1 + 1
            }
        }
    }
    
    // 设置和清理
    override func setUp() {
        super.setUp()
        // 每个测试方法执行前调用
    }
    
    override func tearDown() {
        // 每个测试方法执行后调用
        super.tearDown()
    }
}
```

**异步测试**：
```swift
class AsyncNetworkTests: XCTestCase {
    
    func testFetchUserData() async throws {
        let expectation = XCTestExpectation(description: "Fetch user data")
        
        Task {
            let user = try await fetchUser(id: 123)
            XCTAssertEqual(user.name, "John Doe")
            expectation.fulfill()
        }
        
        await fulfillment(of: [expectation], timeout: 5.0)
    }
}
```