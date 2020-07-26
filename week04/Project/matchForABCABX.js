/**
 * abcabx
 */
function match(str) {
  let state = start;
  for (let item of str) {
    state = state(item);
  }
  if (state === end) {
    return true;
  } else {
    return false;
  }
}
function start(str) {
  if (str === "a") {
    return stateB;
  } else {
    return start;
  }
}
function stateB(str) {
  if (str === "b") {
    return stateC;
  } else {
    return start(str);
  }
}
function stateC(str) {
  if (str === "c") {
    return stateA2;
  } else {
    return start(str);
  }
}
function stateA2(str) {
  if (str === "a") {
    return stateB2;
  } else {
    return start(str);
  }
}
function stateB2(str) {
  if (str === "b") {
    return stateX;
  } else {
    return stateB(str);
  }
}
function end() {
  return end;
}
function stateX(str) {
  if (str === "x") {
    return end;
  } else {
    return stateC(str);
  }
}

console.log(match("abcabbabcabx"));