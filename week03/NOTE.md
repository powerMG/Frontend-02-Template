# 前端训练营第三周 总结

- [JS 表达式](#js-表达式)        
- [运算符和表达式](#运算符和表达式)            
- [语法 Grammar](#语法-grammar)      
- [1.1. JS 表达式](#11-js-表达式)
- [1.1.1. 运算符和表达式](#111-运算符和表达式)
- [1.1.1.1. 语法 Grammar](#1111-语法-grammar)
- [1.1.1.2. 运行时 Runtime](#1112-运行时-runtime)
 - [1.1.1.3. 表达式 Expressions](#1113-表达式-expressions)
- [1.1.2. 类型转换](#112-类型转换)
- [1.1.3. Unboxing（拆箱）](#113-unboxing拆箱)
- [1.1.4. boxing（装箱）](#114-boxing装箱)
- [1.2. JS 语句](#12-js-语句)
- [1.2.1. 运行时相关概念](#121-运行时相关概念)
- [1.2.1.1. 语法（Grammar）](#1211-语法grammar)
- [1.2.1.2. 运行时（runtime）](#1212-运行时runtime)
- [1.2.2. 简单语句和复合语句](#122-简单语句和复合语句)
- [1.2.2.1. 简单语句](#1221-简单语句)
- [1.2.2.2. 复合语句](#1222-复合语句)
- [1.2.3. 声明](#123-声明)
- [1.2.4. 预处理（pre-process）](#124-预处理pre-process)
- [1.2.5. 作用域](#125-作用域)
- [1.3. JS 结构化](#13-js-结构化)
- [1.3.1. 宏任务和微任务](#131-宏任务和微任务)
- [1.3.2. JS 函数调用](#132-js-函数调用)
- [1.3.2.1. Execution Context（执行上下文）](#1321-execution-context执行上下文)
- [1.3.2.2. Environment Records](#1322-environment-records)
- [运行时 Runtime](#运行时-runtime)
- [表达式 Expressions](#表达式-expressions)
- [类型转换](#类型转换)
- [Unboxing（拆箱）](#unboxing拆箱)
- [boxing（装箱）](#boxing装箱)
- [JS 语句](#js-语句)
- [运行时相关概念](#运行时相关概念)
- [语法（Grammar）](#语法grammar)
- [运行时（runtime）](#运行时runtime)
- [简单语句和复合语句](#简单语句和复合语句)
- [简单语句](#简单语句)
- [复合语句](#复合语句)
- [声明](#声明)
- [预处理（pre-process）](#预处理pre-process)
- [作用域](#作用域)
- [JS 结构化](#js-结构化)
- [宏任务和微任务](#宏任务和微任务)
- [JS 函数调用](#js-函数调用)
- [Execution Context（执行上下文）](#execution-context执行上下文)
- [Environment Records](#environment-records)

## 1.1. JS 表达式

### 1.1.1. 运算符和表达式

分别从语法、运行时和表达式三个方面介绍了运算符和表达式

#### 1.1.1.1. 语法 Grammar

语法树和运算符优先级：
Member 运算：

```
a.b、a[b]、foo`string`、super.b、super['b']、new.target、new Foo()
```

New 运算

```
new Foo
```

#### 1.1.1.2. 运行时 Runtime

Reference（引用类型：标准中的类型）

```
引用类型分为两部分：Object和Key
key可以是一个String类型也可以是Symbol
例如：
delete、assign这样的基础类型就会用到Reference
```

#### 1.1.1.3. 表达式 Expressions

Call Expressions

```
foo()、super()、foo()['b']、foo().b、foo()`abc`
```

Left Handside

```
a.b=c、a+b=c
```

Right Handside

```
a++、a--、--a、++a
```

Unary(单目运算符)

```
delete a.b、void foo()、typeof a、+a、-a、~a、!a、await a
```

\*\*（乘方）

```
3**2**3、3**(2**3)
```

Multiplicative

```
*、/、%
```

Additive

```
+、-
```

Shift

```
<<、>>、>>>
```

Releationship

```
<>、<=、>=、instanceof、in
```

Equality

```
==、!=、===、!==
```

BitWise

```
&、^、|
```

Logical

```
&&、||
```

Conditional

```
[条件]?[真值]:[假值]
```

### 1.1.2. 类型转换

| 类型      |     Number     |           String |  Boolean | Undefined | Null | Object | Symbol |
| --------- | :------------: | ---------------: | -------: | --------: | ---: | -----: | -----: |
| Number    |       -        |                  |  0 false |         X |    X | Boxing |      X |
| String    |                |                - | "" false |         X |    X | Boxing |      X |
| Boolean   | true 1,false 0 |   'true','false' |        - |         X |    X | Boxing |      X |
| Undefined |      NaN       |      'Undefined' |    false |         - |    X |      X |      X |
| Null      |       0        |           'null' |    false |         X |    - |      X |      X |
| Object    |    valueOf     | valueOf,toString |     true |         X |    X |      - |      X |
| Symbol    |       X        |                X |        X |         X |    X | Boxing |      - |

### 1.1.3. Unboxing（拆箱）

```
ToPrimitive
toString vs valueOf
Symbol.toprimitive
```

### 1.1.4. boxing（装箱）

| 类型    |          对象           |          值 |
| ------- | :---------------------: | ----------: |
| Number  |      new Number(1)      |           1 |
| String  |     new String("a")     |         "a" |
| Boolean |    new Boolean(true)    |        true |
| Symbol  | new Ojbect(Symbol("a")) | Symbol("a") |

---

## 1.2. JS 语句

### 1.2.1. 运行时相关概念

#### 1.2.1.1. 语法（Grammar）

1. 简单语句
2. 组合语句
3. 声明

#### 1.2.1.2. 运行时（runtime）

1. Completion Record

- [[type]]

```
normal、break、continue、return、throw
```

- [[value]]

```
基本类型
```

- [[target]]

```
label
```

2. Lexical Environment

### 1.2.2. 简单语句和复合语句

#### 1.2.2.1. 简单语句

1. ExpressionStatement（表达式语句）
2. EmptyStatement（空语句）
3. DebuggerStatement（debugger 语句）
4. ThrowStatement（throw 语句）
5. ContinueStatement（continue 语句）

```
[[type]]:continue
[[value]]:不明
[[target]]:label
```

6. BreakStatement（break 语句）

```
[[type]]:break
[[value]]:不明
[[target]]:label
```

6. ReturnStatement（return 语句）

#### 1.2.2.2. 复合语句

1. BlockStatement

```
[[type]]:normal
[[value]]:不明
[[target]]:不明
```

2. IfStatement
3. SwitchStatement
4. IterationStatement

```
while
do while
for
for in
for of
for await (of)
```

5. WithStatement
6. LabelledStatement
7. TryStatement

```
[[type]]:return
[[value]]:不明
[[target]]:label
```

### 1.2.3. 声明

```
FuntionDeclaration（函数声明）
GeneratorDeclaration（语句声明）
AsyncFunctionDeclaration（异步函数声明）
AsyncGeneratorDeclaration（异步语句声明）
VarlableStatement（变量声明）
ClassDeclaration（类声明）
LexicalDeclartion（词法声明）
```

### 1.2.4. 预处理（pre-process）

1. 函数预处理
2. 变量预处理

```
var a=2;
void function(){
    a=1;
    return;
    var a;
}();
console.log(a); //2

var a=2;
void function(){
    a=1;
    return;
    const a; // 代码执行异常
}();
console.log(a);
```

### 1.2.5. 作用域

1. var
2. let 和 const

```
var a=2;
void function(){
    a=1;
    {
        var a;
    }
}();
console.log(a);

var a=2;
void function(){
    a=1;
    {
        const a;
    }
}();
console.log(a)
```

---

## 1.3. JS 结构化

### 1.3.1. 宏任务和微任务

从 JS 执行颗粒度（运行时）分析

1. 宏任务
2. 微任务（Promise）
   > MacroTask(Job)

```
var x=1;
var p=new Promise(resolve=>resolve());
p.then(()=>x=3);
x=2;
```

> 事件循环

```
Get Cdoe（获取代码）——>execute（执行代码）——>wait（等待），反复循环的过程
```

3. 函数调用（Excution Context）
4. 语句/声明（Completion Record）
5. 表达式（Reference）
6. 直接量/变量/this……

### 1.3.2. JS 函数调用

#### 1.3.2.1. Execution Context（执行上下文）

1. ECMAScript Code Execution Content

- code evaluation state（用于 async 和 generator 函数）
- Function
- Script of Module
- Realm（保存着所有的内置对象）
- LexicalEnvironment

```
this、new.target、super、变量
```

- VariableEnvitironm

```
var
```

2. Generator Execution Content
1. ECMAScript Code Execution Content

- code evaluation state（用于 async 和 generator 函数）
- Function
- Script of Module
- Realm（保存着所有的内置对象）
- LexicalEnvironment

```
this、new.target、super、变量
```

- VariableEnvitironm

```
var
```

- Generator

#### 1.3.2.2. Environment Records

1. Declarative Environment Records

- Function Environment Records
- Module Environment Records

2. Global Environment Records
3. Object Environment Records
