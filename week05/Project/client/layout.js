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
