/**
 * 选择器
 * 元素选择器
 * 类选择器
 * ID选择器
 * 通配选择器
 * 属性选择器
 */
// 编写一个 match 函数。它接受两个参数，第一个参数是一个选择器字符串性质，第二个是一个 HTML 元素。
// 这个元素你可以认为它一定会在一棵 DOM 树里面。通过选择器和 DOM 元素来判断，当前的元素是否能够匹配到我们的选择器。
// （不能使用任何内置的浏览器的函数，仅通过 DOM 的 parent 和 children 这些 API，来判断一个元素是否能够跟一个选择器相匹配。）
// 记录匹配规则
let arrRulers = {
  rules: [],
};
let currentElement;
function match(selector, element) {
  debugger;
  OffspringSelector(selector);
  currentElement = element;
  arrRulers.rules.forEach((item) => {
    if (item.value.match(/#\w?.*/)) {
      // id选择器
      if (currentElement.id === item.value.indexOf()) {
        verification(item, currentElement);
      } else {
        return false;
      }
    } else if (item.value.match(/\.\w?.*/)) {
      // class选择器
      if (currentElement.className === item.value.replace(".")) {
        verification(item, currentElement);
      } else {
        return false;
      }
    } else if (item.value.match(/\[.\w?.*\]/)) {
      let tempInfo = item.value.replace("[", "").replace("]", "").split("=");
      // 属性选择器
      if (currentElement.getAttribute(tempInfo[0]) === tempInfo[1]) {
        verification(item, currentElement);
      } else {
        return false;
      }
    } else {
      // 标签选择器
      if (currentElement.tagName.toLowerCase() === item.value) {
        verification(item, currentElement);
      } else {
        return false;
      }
    }
  });
  // arrSelector.forEach((item) => {

  //   currentElement.id;
  // });
  // if (selector.match(/[\s>]/)) {
  //   currentElement = element.parent();
  // }
  return true;
}
function verification(item, element) {
  if (item.type === "Offspring") {
    // 后代选择器
    currentElement = element.parentNode;
  } else if (item.type === "Brother") {
    // 兄弟选择器
    currentElement = element.parentNode.children;
  } else if (item.type === "Adjacent") {
    // 相邻选择器
    currentElement = element.nextElementSibling;
  } else if (item.type === "Descendant") {
    // 子代选择器
    currentElement = element.parentNode;
  }
}
// 计算所有后代选择器
function OffspringSelector(selector) {
  // 获取到传入的样式层级
  let arrSelector = (selector && selector.split(/\s/).reverse()) || [];
  if (arrSelector.length > 1) {
    for (let i = 0; i < arrSelector.length; i++) {
      BrotherSelector(arrSelector[i]);
    }
  } else {
    arrRulers.rules.push({
      type: "Offspring",
      value: selector,
      children: [],
    });
  }
}
// 计算兄弟选择器
function BrotherSelector(selector) {
  // 获取到传入的样式层级
  let arrSelector = (selector && selector.split(/~/).reverse()) || [];
  if (arrSelector.length > 1) {
    for (let i = 0; i < arrSelector.length; i++) {
      AdjacentSelector(arrSelector[i]);
    }
  } else {
    arrRulers.rules.push({
      type: "Offspring",
      value: selector,
      children: [],
    });
  }
}

// 计算相邻选择器
function AdjacentSelector(selector) {
  // 获取到传入的样式层级
  let arrSelector = (selector && selector.split(/\+/).reverse()) || [];
  if (arrSelector.length > 1) {
    for (let i = 0; i < arrSelector.length; i++) {
      DescendantSelector(arrSelector[i]);
    }
  } else {
    arrRulers.rules.push({
      type: "Brother",
      value: selector,
      children: [],
    });
  }
}
// 计算子代选择器
function DescendantSelector(selector) {
  // 获取到传入的样式层级
  let arrSelector = (selector && selector.split(/>/).reverse()) || [];
  if (arrSelector.length > 1) {
    for (let i = 0; i < arrSelector.length; i++) {
      arrRulers.rules.push({
        type: "Descendant",
        value: arrSelector[i],
        children: [],
      });
    }
  } else {
    arrRulers.rules.push({
      type: "Adjacent",
      value: selector,
      children: [],
    });
  }
}
// OffspringSelector("div #id.class~.abc");
// console.log(arrRulers);
match("div #id.class", document.getElementById("id"));
