// 2进制转换
function numberByBinary(num, arrRemainder) {
  if (num > 0) {
    arrRemainder.push(num % 2);
    return BinaryInteger(Math.floor(num / 2), arrRemainder);
  } else {
    return arrRemainder.reverse().join("");
  }
}
// 8进制转换
function numberByOctal(num, arrRemainder) {
  if (num > 0) {
    arrRemainder.push(num % 8);
    return BinaryInteger(Math.floor(num / 8), arrRemainder);
  } else {
    return arrRemainder.reverse().join("");
  }
}
// 16进制转换
function numberByHexadecimal(num) {}
// StringToNumber
function stringToNumber(input) {}

console.log(stringToNumber(true));
// NumberToString
