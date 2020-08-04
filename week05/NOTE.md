# 前端训练营 第五周 总结

## 计算 CSS(CSS Computing)

### 收集 CSS 规则

借助了`css`包中的`css.parse`来生成一套`ast语法树`,在语法树种的`styleSheet.rules`属性记录了 CSS 的样式规则，可以理解为一个完整的 css 功能就是一个样式表（`stylesheet`）

```
const css = require("css");

let rules = [];
function addCSSRules(text) {
  var ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}
```

> 总结

1. 遇到 style 标签时，把 css 规则保存起来
2. 调用了现成的 CSS Parser 来分析了 CSS 的规则

### 添加调用

在创建一个元素后立即计算 CSS（满足于大部分规则）

```
function computeCSS(element) {
  // 根据传入的element进行计算
}
```

> 总结

1. 当我们创建一个元素后，立即计算 CSS
2. 理论上，当分析一个元素时，所有的 CSS 规则已经收集完毕
3. 在真实浏览器中，可能遇到写在 body 中的 style 标签，需要重新计算 CSS 的情况（在 toy brower 中忽略的这个条件）

### 获取父元素序列

将父元素队列进行 reverse（CSS 在计算过程中是从当前元素向外一级一级查找匹配的过程）

```
function computeCSS(element) {
  var elements = stack.slice().reverse();
}
```

> 总结

1. 在`computeCSS`函数中，我们必须知道元素的所有父元素才能判断元素于规则是否匹配
2. 可以从之前中的`stack`(stack 在之前的 html parse)中获取所有的父元素
3. 首先获取的是当前元素，所以获取和计算元素匹配的顺序是从内向外进行

### 选择器与元素匹配

```
function computeCSS(element) {
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(" ").reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    let matched = false;
    var j = 1;
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    // 检测是否所有选择器都已经匹配
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      // 用于计算当前CSS规则的优先级
    }
  }
}
```

> 总结

1. 选择器也要从当前元素向外排列
2. 复杂选择器拆成针对单个元素的选择器，用循环匹配父元素队列

### 生成 computed 属性

```
function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  // id选择器
  if (selector.charAt(0) === "#") {
    var attr = element.attributes.filter((attr) => attr.name === "id")[0];
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    // class选择器
    var attr = element.attributes.filter((attr) => attr.name === "class")[0];
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    // tagname选择器
    if (element.tagName === selector) {
      return true;
    }
  }
  return false;
}
```

> 总结

1. 根据选择器的类型和元素属性，计算是否与当前元素匹配
2. 这里仅仅实现了三种基本选择器，实际浏览器中哟啊处理负责选择器

### specificity（优先级）计算

优先级排列可以分为 `inline>id>class>tagname [0,0,0,0]`（越左权重越高）

```
function computeCSS(element) {
  var elements = stack.slice().reverse();
  if (!element.computedStyle) {
    element.computedStyle = {};
  }
  for (let rule of rules) {
    var selectorParts = rule.selectors[0].split(" ").reverse();
    if (!match(element, selectorParts[0])) {
      continue;
    }
    let matched = false;
    var j = 1;
    for (var i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    // 检测是否所有选择器都已经匹配
    if (j >= selectorParts.length) {
      matched = true;
    }
    if (matched) {
      // 计算当前CSS规则的优先级
      var sp = specificity(rule.selectors);
      var computedStyle = element.computedStyle;
      for (var declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {};
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (
          compare(computedStyle[declaration.property].specificity, sp) < 0
        ) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        }
      }
    }
  }
}
```

> 总结

1.  CSS 规则根据 specificity 和后来优先规则覆盖
2.  specificity 是一个四元组，越左边权重越高
3.  一个 CSS 规则的 specificity 根据包含的简单选择器相加而成

## 排版（Layout）

### 排版概念

1. 第一代：正常流排版（position、display、float 等）
2. 第二代：felx
3. 第三代：grid
4. 第四代：CSS Houdini

### 根据浏览器属性进行排版（flex）

排版中的`主轴（main axis）`用来控制元素排版时主要的延伸方向，跟主轴相垂直的方向为`交叉轴（cross axis）`其属性为交叉轴属性，根据`flex-direction`来定义主轴的方向，如果主轴为`row`时，主轴相关的属性为`widht x left right`，交叉轴相关的属性为`height y top bottom`，若主轴为`column`时主轴相关属性为`height y top bottom`，交叉轴属性为`width x left right`

```
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    var p = element.computedStyle[prop].value;
    element.style[prop] = element.computedStyle[prop].value;
    // 将带有px的属性值去掉px
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    // 纯数字的转换类型
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}
function layout(element) {
  // 过滤没有样式的的dom节点
  if (!element.computedStyle) {
    return false;
  }
  let elementStyle = getStyle(element);
  if (!elementStyle || elementStyle.display !== "flex") {
    return;
  }
  var items = element.children.filter((e) => e.type === "element");
  items.sort((a, b) => (a.order || 0) - (b.order || 0));
  var style = elementStyle;
  // 处理空的或者auto的宽度或高度
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });
  // 处理flexDirection值
  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.aliginItems || style.aliginItems === "auto") {
    style.aliginItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowarp";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }
  var mainSize,
    mianStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === "row") {
    mainSize = "width";
    mianStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mianStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "column") {
    mainSize = "height";
    mianStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mianStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.height;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexWrap === "wrap-reverse") {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }
  var isAutoMainSize = false;
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }
}
module.exports = layout;

```

### 收集元素进行

```
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    var p = element.computedStyle[prop].value;
    element.style[prop] = element.computedStyle[prop].value;
    // 将带有px的属性值去掉px
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    // 纯数字的转换类型
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}
function layout(element) {
  // 过滤没有样式的的dom节点
  if (!element.computedStyle) {
    return false;
  }
  let elementStyle = getStyle(element);
  if (!elementStyle || elementStyle.display !== "flex") {
    return;
  }
  var items = element.children.filter((e) => e.type === "element");
  items.sort((a, b) => (a.order || 0) - (b.order || 0));
  var style = elementStyle;
  // 处理空的或者auto的宽度或高度
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });
  // 处理flexDirection值
  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.aliginItems || style.aliginItems === "auto") {
    style.aliginItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowarp";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }
  var mainSize,
    mianStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === "row") {
    mainSize = "width";
    mianStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mianStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "column") {
    mainSize = "height";
    mianStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mianStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.height;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexWrap === "wrap-reverse") {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }
  var isAutoMainSize = false;
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }
  // 收集元素行
  var flexLine = [];
  var flexLines = [flexLine];
  var mainSpace = elementStyle[mainSize];
  var crossSpace = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemStyle = getStyle(item);
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }
    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLines.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;
  console.log(item);
  if (style.flexWrap === "nowrap" || isAutoMainSize) {
    flexLines.crossSpace =
      style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
}
module.exports = layout;

```

### 计算主轴

```
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    var p = element.computedStyle[prop].value;
    element.style[prop] = element.computedStyle[prop].value;
    // 将带有px的属性值去掉px
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    // 纯数字的转换类型
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}
function layout(element) {
  // 过滤没有样式的的dom节点
  if (!element.computedStyle) {
    return false;
  }
  let elementStyle = getStyle(element);
  if (!elementStyle || elementStyle.display !== "flex") {
    return;
  }
  var items = element.children.filter((e) => e.type === "element");
  items.sort((a, b) => (a.order || 0) - (b.order || 0));
  var style = elementStyle;
  // 处理空的或者auto的宽度或高度
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });
  // 处理flexDirection值
  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.aliginItems || style.aliginItems === "auto") {
    style.aliginItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowarp";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }
  var mainSize,
    mianStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === "row") {
    mainSize = "width";
    mianStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mianStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "column") {
    mainSize = "height";
    mianStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mianStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.height;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexWrap === "wrap-reverse") {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }
  var isAutoMainSize = false;
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }
  // 收集元素行
  var flexLine = [];
  var flexLines = [flexLine];
  var mainSpace = elementStyle[mainSize];
  var crossSpace = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemStyle = getStyle(item);
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }
    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLines.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;
  console.log(item);
  if (style.flexWrap === "nowrap" || isAutoMainSize) {
    flexLines.crossSpace =
      style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
  /**
   * 计算主轴信息
   */
  // 剩余空间小于0时，进行等比压缩
  if (mainSpace < 0) {
    var scale = style[mainSize] / (style[mainSize] - mainSpace);
    var currentMain = mainBase;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mianStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mianStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach((items) => {
      var mainSpace = items.mainSpace;
      var flexTotal = 0;
      // 循环计算所有flex的数量
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);
        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }
      // 存在flex元素时
      if (flexTotal > 0) {
        var currentMain = mainBase;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemStyle = getStyle(item);
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mianStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mianStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        if (style.justifyContent === "flex-start") {
          var currentMain = mainBase;
          var step = 0;
        }
        if (style.justifyContent === "flex-end") {
          var currentMain = mainSpace * mainSign + mainBase;
          var step = 0;
        }
        if (style.justifyContent === "content") {
          var currentMain = (mainSpace / 2) * mainSign + mainBase;
          var step = 0;
        }
        if (style.justifyContent === "space-between") {
          var step = (mainSpace / (items.length - 1)) * mainSign;
          var currentMain = mainBase;
        }
        if (style.justifyContent === "space-around") {
          var step = (mainSpace / items.length) * mainSign;
          var currentMain = step / 2 + mainBase;
        }
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          itemStyle[mianStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mianStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }
}
module.exports = layout;

```

### 计算交叉轴

```
function getStyle(element) {
  if (!element.style) {
    element.style = {};
  }
  for (let prop in element.computedStyle) {
    var p = element.computedStyle[prop].value;
    element.style[prop] = element.computedStyle[prop].value;
    // 将带有px的属性值去掉px
    if (element.style[prop].toString().match(/px$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
    // 纯数字的转换类型
    if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
      element.style[prop] = parseInt(element.style[prop]);
    }
  }
  return element.style;
}
function layout(element) {
  // 过滤没有样式的的dom节点
  if (!element.computedStyle) {
    return false;
  }
  let elementStyle = getStyle(element);
  if (!elementStyle || elementStyle.display !== "flex") {
    return;
  }
  var items = element.children.filter((e) => e.type === "element");
  items.sort((a, b) => (a.order || 0) - (b.order || 0));
  var style = elementStyle;
  // 处理空的或者auto的宽度或高度
  ["width", "height"].forEach((size) => {
    if (style[size] === "auto" || style[size] === "") {
      style[size] = null;
    }
  });
  // 处理flexDirection值
  if (!style.flexDirection || style.flexDirection === "auto") {
    style.flexDirection = "row";
  }
  if (!style.aliginItems || style.aliginItems === "auto") {
    style.aliginItems = "stretch";
  }
  if (!style.justifyContent || style.justifyContent === "auto") {
    style.justifyContent = "flex-start";
  }
  if (!style.flexWrap || style.flexWrap === "auto") {
    style.flexWrap = "nowarp";
  }
  if (!style.alignContent || style.alignContent === "auto") {
    style.alignContent = "stretch";
  }
  var mainSize,
    mianStart,
    mainEnd,
    mainSign,
    mainBase,
    crossSize,
    crossStart,
    crossEnd,
    crossSign,
    crossBase;
  if (style.flexDirection === "row") {
    mainSize = "width";
    mianStart = "left";
    mainEnd = "right";
    mainSign = +1;
    mainBase = 0;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "row-reverse") {
    mainSize = "width";
    mianStart = "right";
    mainEnd = "left";
    mainSign = -1;
    mainBase = style.width;
    crossSize = "height";
    crossStart = "top";
    crossEnd = "bottom";
  }
  if (style.flexDirection === "column") {
    mainSize = "height";
    mianStart = "top";
    mainEnd = "bottom";
    mainSign = +1;
    mainBase = 0;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexDirection === "column-reverse") {
    mainSize = "height";
    mianStart = "bottom";
    mainEnd = "top";
    mainSign = -1;
    mainBase = style.height;
    crossSize = "widht";
    crossStart = "left";
    crossEnd = "right";
  }
  if (style.flexWrap === "wrap-reverse") {
    var tmp = crossStart;
    crossStart = crossEnd;
    crossEnd = tmp;
    crossSign = -1;
  } else {
    crossBase = 0;
    crossSign = 1;
  }
  var isAutoMainSize = false;
  if (!style[mainSize]) {
    elementStyle[mainSize] = 0;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== void 0) {
        elementStyle[mainSize] = elementStyle[mainSize];
      }
    }
    isAutoMainSize = true;
  }
  // 收集元素行
  var flexLine = [];
  var flexLines = [flexLine];
  var mainSpace = elementStyle[mainSize];
  var crossSpace = 0;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemStyle = getStyle(item);
    if (itemStyle[mainSize] === null) {
      itemStyle[mainSize] = 0;
    }
    if (itemStyle.flex) {
      flexLine.push(item);
    } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize];
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      flexLines.push(item);
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize];
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace;
        flexLine.crossSpace = crossSpace;
        flexLine = [item];
        flexLines.push(flexLine);
        mainSpace = style[mainSize];
        crossSpace = 0;
      } else {
        flexLine.push(item);
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
      }
      mainSpace -= itemStyle[mainSize];
    }
  }
  flexLine.mainSpace = mainSpace;
  console.log(item);
  if (style.flexWrap === "nowrap" || isAutoMainSize) {
    flexLines.crossSpace =
      style[crossSize] !== undefined ? style[crossSize] : crossSpace;
  } else {
    flexLine.crossSpace = crossSpace;
  }
  /**
   * 计算主轴信息
   */
  // 剩余空间小于0时，进行等比压缩
  if (mainSpace < 0) {
    var scale = style[mainSize] / (style[mainSize] - mainSpace);
    var currentMain = mainBase;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemStyle = getStyle(item);
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0;
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale;
      itemStyle[mianStart] = currentMain;
      itemStyle[mainEnd] =
        itemStyle[mianStart] + mainSign * itemStyle[mainSize];
      currentMain = itemStyle[mainEnd];
    }
  } else {
    flexLines.forEach((items) => {
      var mainSpace = items.mainSpace;
      var flexTotal = 0;
      // 循环计算所有flex的数量
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);
        if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
          flexTotal += itemStyle.flex;
          continue;
        }
      }
      // 存在flex元素时
      if (flexTotal > 0) {
        var currentMain = mainBase;
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var itemStyle = getStyle(item);
          if (itemStyle.flex) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
          }
          itemStyle[mianStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mianStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd];
        }
      } else {
        if (style.justifyContent === "flex-start") {
          var currentMain = mainBase;
          var step = 0;
        }
        if (style.justifyContent === "flex-end") {
          var currentMain = mainSpace * mainSign + mainBase;
          var step = 0;
        }
        if (style.justifyContent === "content") {
          var currentMain = (mainSpace / 2) * mainSign + mainBase;
          var step = 0;
        }
        if (style.justifyContent === "space-between") {
          var step = (mainSpace / (items.length - 1)) * mainSign;
          var currentMain = mainBase;
        }
        if (style.justifyContent === "space-around") {
          var step = (mainSpace / items.length) * mainSign;
          var currentMain = step / 2 + mainBase;
        }
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          itemStyle[mianStart] = currentMain;
          itemStyle[mainEnd] =
            itemStyle[mianStart] + mainSign * itemStyle[mainSize];
          currentMain = itemStyle[mainEnd] + step;
        }
      }
    });
  }
  /**
   * 计算交叉轴信息
   */
  var crossSpace;
  if (!style[crossSize]) {// 父元素不存在行高时
    crossSpace = 0;
    elementStyle[crossSize] = 0;
    for (var i = 0; i < flexLines.length; i++) {
      elementStyle[crossSize] =
        elementStyle[crossSize] + flexLines[i].crossSpace;
    }
  } else {// 父元素存在行高时
    crossSpace = style[crossSize];
    for (var i = 0; i < flexLines.length; i++) {
      crossSpace -= flexLines[i].crossSpace;
    }
  }
  if (style.flexWrap === "wrap-reverse") {
    crossBase = style[crossSize];
  } else {
    crossBase = 0;
  }
  var lineSize = style[crossSize] / flexLines.length;
  var step;
  if (style.alignContent === "flex-start") {
    crossBase += 0;
    step = 0;
  }
  if (style.alignContent === "flex-end") {
    crossBase += crossSign * crossSpace;
    step = 0;
  }
  if (style.alignContent === "center") {
    crossBase += (crossSign * crossSpace) / 2;
    step = 0;
  }
  if (style.alignContent === "space-between") {
    crossBase += 0;
    step = crossSpace / (flexLines.length - 1);
  }
  if (style.alignContent === "space-around") {
    step = crossSpace / flexLines.length;
    crossBase += (crossSign * step) / 2;
  }
  if (style.alignContent === "stretch") {
    crossBase += 0;
    step = 0;
  }
  flexLines.forEach((items) => {
    // 记录真实交叉轴的尺寸
    var lineCrossSize =
      style.alignContent === "stretch"
        ? items.crossSpace + crossSpace / flexLines.length
        : items.crossSpace;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var itemStyle = getStyle(item);
      var align = itemStyle.alignSelf || style.aliginItems;
      // item未指定交叉轴尺寸时
      if (!itemStyle[crossSize]) {
        itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;
      }
      if (align === "flex-start") {
        itemStyle[crossStart] = crossBase;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === "flex-end") {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
        itemStyle[crossStart] =
          itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
      }
      if (align === "center") {
        itemStyle[crossStart] =
          crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
        itemStyle[crossEnd] =
          itemStyle[crossStart] + crossSign * itemStyle[crossSize];
      }
      if (align === "stretch") {
        itemStyle[crossStart] = crossBase;
        // 填满
        itemStyle[crossEnd] =
          crossBase +
          crossSign *
            ((itemStyle[crossSize] !== null && itemStyle[crossSize]) || 0);
        itemStyle[crossSize] =
          crossSign * crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
      }
    }
    crossBase += crossSign * (lineCrossSize + step);
  });
  console.log(items);
}
module.exports = layout;

```

## CSS 渲染（Render）

### 绘制单个元素

```
// client.js
void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8190,
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "powerMG",
    },
  });
  let response = await request.send();
  // 解析HTML
  let dom = htmlParser.parseHtml(response.body);
  console.log(JSON.stringify(response));
  let viewport = images(800, 600);
  render(viewport, , dom.children[0].children[3].children[1].children[3]);
  viewport.save("viewport.jpg");
})();
// rander.js
const images = require("images");
function render(viewport, element) {
  if (element.style) {
    var img = images(element.style.width, element.style.height);
    if (element.style["background-color"]) {
      let color = element.style["background-color"] || "rgb(0,255,0)";
      color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      img.fill(
        Number(RegExp.$1),
        Number(RegExp.$2),
        Number(RegExp.$3),
        Number(RegExp.$4)
      );
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }
}
module.exports = render;

```

### 绘制 DOM 树

```
// client.js
void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8190,
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "powerMG",
    },
  });
  let response = await request.send();
  // 解析HTML
  let dom = htmlParser.parseHtml(response.body);
  console.log(JSON.stringify(response));
  let viewport = images(800, 600);
  render(viewport, dom);
  viewport.save("viewport.jpg");
})();
// rander.js
const images = require("images");
function render(viewport, element) {
  if (element.style) {
    var img = images(element.style.width, element.style.height);
    if (element.style["background-color"]) {
      let color = element.style["background-color"] || "rgb(0,255,0)";
      color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      img.fill(
        Number(RegExp.$1),
        Number(RegExp.$2),
        Number(RegExp.$3),
        Number(RegExp.$4)
      );
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }
  if (element.children) {
    for (var child of element.children) {
      render(viewport, child);
    }
  }
}
module.exports = render;
```

## 所感所想
本周在layout环节的时候计算属性值出现了算错的情况，后续反复看了课程也得到了纠正，结果还是美好的，成功的输出了渲染后的图片，还有小有成就的，坚持了这么长时间感受了整个toy brower的演变过程，虽然现在还不能自信清晰的将这些知识点描述出来，但我相信通过反复的沉淀、探索、论证、思考终究会有一天能够自信的将这些阐述并传达出去。另外记录还得一下本周因其他事情没能按时提交作业，非常恐慌，生怕惰性使然越落越多，再此鞭策一下自己，加油！！！