# 前端训练营第三周 总结

## JS 表达式

### 运算符和表达式

分别从语法、运行时和表达式三个方面介绍了运算符和表达式

#### 语法 Grammar

语法树和运算符优先级：
Member 运算：

```
a.b、a[b]、foo`string`、super.b、super['b']、new.target、new Foo()
```

New 运算

```
new Foo
```

#### 运行时 Runtime

Reference（引用类型：标准中的类型）

```
引用类型分为两部分：Object和Key
key可以是一个String类型也可以是Symbol
例如：
delete、assign这样的基础类型就会用到Reference
```

#### 表达式 Expressions

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

### 类型转换

| 类型      |     Number     |           String |  Boolean | Undefined | Null | Object | Symbol |
| --------- | :------------: | ---------------: | -------: | --------: | ---: | -----: | -----: |
| Number    |       -        |                  |  0 false |         X |    X | Boxing |      X |
| String    |                |                - | "" false |         X |    X | Boxing |      X |
| Boolean   | true 1,false 0 |   'true','false' |        - |         X |    X | Boxing |      X |
| Undefined |      NaN       |      'Undefined' |    false |         - |    X |      X |      X |
| Null      |       0        |           'null' |    false |         X |    - |      X |      X |
| Object    |    valueOf     | valueOf,toString |     true |         X |    X |      - |      X |
| Symbol    |       X        |                X |        X |         X |    X | Boxing |      - |

### Unboxing（拆箱）

```
ToPrimitive
toString vs valueOf
Symbol.toprimitive
```

### boxing（装箱）

| 类型    |          对象           |          值 |
| ------- | :---------------------: | ----------: |
| Number  |      new Number(1)      |           1 |
| String  |     new String("a")     |         "a" |
| Boolean |    new Boolean(true)    |        true |
| Symbol  | new Ojbect(Symbol("a")) | Symbol("a") |

---

## JS 语句
### 运行时相关概念
#### 语法（Grammar）
1. 简单语句
2. 组合语句
3. 声明
#### 运行时（runtime）
1. Completion Record
+ [[type]]
```
normal、break、continue、return、throw
```
+ [[value]]
```
基本类型
```
+ [[target]]
```
label
```
2. Lexical Environment
### 简单语句和复合语句

### 声明
### 预处理
### 作用域
---

## JS 结构化
