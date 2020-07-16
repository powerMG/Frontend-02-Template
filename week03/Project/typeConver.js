/**
 * 2进制转换
 * @param {Number} num 转换的值
 * @param {Array} arrRemainder 记录转换后的每个2进制值
 */
function numberByBinary(num, arrRemainder) {
  if (num > 0) {
    arrRemainder.push(num % 2);
    return numberByBinary(Math.floor(num / 2), arrRemainder);
  } else {
    return arrRemainder.reverse().join("");
  }
}
/**
 * 8进制转换
 * @param {Number} num 转换的值
 */
function numberByOctal(num) {
  let arrRemainder = [];
  // 得到当前字符的二进制
  let _currentBinary = numberByBinary(num, []);
  // 通过二进制转换8进制
  for (let i = 0; i < Math.ceil(`${_currentBinary}`.length / 3); i++) {
    arrRemainder.push(7 & num >> (3 * i))
  }
  return `0${arrRemainder.reverse().join("")}`;
}
/**
 * 16进制转换
 * @param {Number} num 转换后的值
 */
function numberByHexadecimal(num) {
  let arrRemainder = [];
  // 得到当前字符的二进制
  let _currentBinary = numberByBinary(num, []);
  let _converHexadecimal = {
    10: "a",
    11: "b",
    12: "c",
    13: "d",
    14: "e",
    15: "f"
  }
  // 通过二进制转换16进制
  for (let i = 0; i < Math.ceil(`${_currentBinary}`.length / 4); i++) {
    let _currentNum = 15 & num >> (4 * i);
    arrRemainder.push(_converHexadecimal[_currentNum] || _currentNum);
  }
  return `0x${arrRemainder.reverse().join("")}`;
}
/**
 * StringToNumber
 * @param {String} input 转换后的字符
 */
function stringToNumber(input) {
  for (let i = 0; i < input.length; i++) {
    // 十进制转换
    let _decimal = input.charCodeAt(i)
    // 二进制转换
    let _binary = numberByBinary(_decimal, []);
    // 八进制转换
    let _octal = numberByOctal(_decimal);
    // 十六进制转换
    let _hexadecimal = numberByHexadecimal(_decimal);
    console.log(`转换汉字“${input.charAt(i)}”的2进制为：${_binary}，8进制为：${_octal}，10进制为：${_decimal}，16进制为：${_hexadecimal}`)
  }
}
/**
 * NumberToString
 * @param {Number} number 要转换的数值 
 * @param {Number} type 转换的进制类型 2，8，10(默认)，16
 */
function numberToString(number, type) {
  let _result = number;
  if (type === 2) {
    _result = numberByBinary(number, [])
  } else if (type === 8) {
    _result = numberByOctal(number);
  } else if (type === 16) {
    _result = numberByHexadecimal(number);
  }
  console.log(`转换后的${type || 10}进制数为`, _result);
}
// test
console.log(stringToNumber("中国"));
//  test
console.log(numberToString(20013, 8));