function UTF8_Encoding(str) {
  // 校验类型
  if (typeof str !== "string") {
    return;
  }
  // 2进制
  let _reaultArr = [];
  // 记录字节长度
  let _byteLength = 0;
  // 循环取出当前字符串的字节长度
  for (let i = 0; i < str.length; i++) {
    let _code = str.charCodeAt(i);
    /**
     * UTF-8 最大6个字节。分别判断当前字符串的字节长度
     * 0~127：1个字节，U+0000~U+007F
     * 128~2047：2个字节，U+0080~U+07FF
     * 2048~0xFFFF：3个字节，U+0800~U+FFFF
     * 65536~0x1FFFFF：4个字节，U+10000~U+1FFFFF
     * 0x200000~0x3FFFFFF：5个字节，U+200000~U+3FFFFFF
     * 0x4000000~0xFFFFFFF：6个字节，U+4000000~U+7FFFFFFF
     */
    if (_code >= 0 && _code <= 127) {
      _byteLength = 1;
    } else if (_code >= 128 && _code <= 2047) {
      _byteLength = 2;
    } else if (_code > 2048 && _code <= 0xffff) {
      _byteLength = 3;
    } else if (_code >= 65536 && _code <= 0x1fffff) {
      _byteLength = 4;
    } else if (_code >= 0x200000 && _code <= x3FFFFFF) {
      _byteLength = 5;
    } else {
      _byteLength = 6;
    }
    // 记录所有转换后的Utf-8 二进制及十六进制内容
    _reaultArr.push(UTF8_EncodingForExec(_code, _byteLength));
  }
  return _reaultArr;
  //   return new Buffer.from(string,"utf8");
}
// 转换二进制
function BinaryInteger(num, arrRemainder) {
  if (num > 0) {
    arrRemainder.push(num % 2);
    return BinaryInteger(Math.floor(num / 2), arrRemainder);
  } else {
    return arrRemainder.reverse().join("");
  }
}
// 转换十六进制
function HexInteger(num, arrRemainder) {
  if (num > 0) {
    let _currentRemainder = num % 16;
    switch (_currentRemainder) {
      case 10:
        _currentRemainder = "a";
        break;
      case 11:
        _currentRemainder = "b";
        break;
      case 12:
        _currentRemainder = "d";
        break;
      case 13:
        _currentRemainder = "d";
        break;
      case 14:
        _currentRemainder = "e";
        break;
      case 15:
        _currentRemainder = "f";
        break;
      default:
        _currentRemainder;
        break;
    }
    arrRemainder.push(`${_currentRemainder}`);
    return HexInteger(Math.floor(num / 16), arrRemainder);
  } else {
    return arrRemainder.reverse().join("");
  }
}
// 执行UTF8转换的逻辑
function UTF8_EncodingForExec(code, byteLength) {
  let _resForBinaryInteger = "";
  let _resForHexInteger = "";
  let byte1, byte2, byte3, byte4, byte5, byte6;
  switch (byteLength) {
    case 1:
      _resForBinaryInteger = BinaryInteger(code, []);
      _resForHexInteger = `0x${HexInteger(code, [])}`;
      break;
    case 2:
      byte1 = 192 | (31 & (code >> 6));
      byte2 = 128 | (63 & code);
      _resForBinaryInteger = `${BinaryInteger(byte1, [])}${BinaryInteger(
        byte2,
        []
      )}`;
      _resForHexInteger = ` 0x${HexInteger(byte1, [])} 0x${HexInteger(
        byte2,
        []
      )}`;
      break;
    case 3:
      byte1 = 224 | (15 & (code >> 12));
      byte2 = 128 | (63 & (code >> 6));
      byte3 = 128 | (63 & code);
      _resForBinaryInteger = `${BinaryInteger(byte1, [])}${BinaryInteger(
        byte2,
        []
      )}${BinaryInteger(byte3, [])}`;
      // 十六进制
      _resForHexInteger = ` 0x${HexInteger(byte1, [])} 0x${HexInteger(
        byte2,
        []
      )} 0x${HexInteger(byte3, [])}`;
      break;
    case 4:
      byte1 = 240 | (7 & (code >> 18));
      byte2 = 128 | (63 & (code >> 12));
      byte3 = 128 | (63 & (code >> 6));
      byte4 = 128 | (63 & code);
      _resForBinaryInteger = `${BinaryInteger(byte1, [])}${BinaryInteger(
        byte2,
        []
      )}${BinaryInteger(byte3, [])}${BinaryInteger(byte4, [])}`;
      // 十六进制
      _resForHexInteger = ` 0x${HexInteger(byte1, [])} 0x${HexInteger(
        byte2,
        []
      )} 0x${HexInteger(byte3, [])} 0x${HexInteger(byte4, [])}`;
      break;
    case 5:
      byte1 = 248 | (3 & (code >> 24));
      byte2 = 128 | (63 & (code >> 18));
      byte3 = 128 | (63 & (code >> 12));
      byte4 = 128 | (63 & (code > 6));
      byte5 = 128 | (63 & code);
      _resForBinaryInteger = `${BinaryInteger(byte1, [])}${BinaryInteger(
        byte2,
        []
      )}${BinaryInteger(byte3, [])}${BinaryInteger(byte4, [])}${BinaryInteger(
        byte5,
        []
      )}${BinaryInteger(byte6, [])}`;
      // 十六进制
      _resForHexInteger = ` 0x${HexInteger(byte1, [])} 0x${HexInteger(
        byte2,
        []
      )} 0x${HexInteger(byte3, [])} 0x${HexInteger(byte4, [])} 0x${HexInteger(
        byte5,
        []
      )} 0x${HexInteger(byte6, [])}`;
      break;
    default:
      byte1 = 252 | (2 & (code >> 30));
      byte2 = 128 | (63 & (code >> 24));
      byte3 = 128 | (63 & (code >> 18));
      byte4 = 128 | (63 & (code > 12));
      byte5 = 128 | (63 & (code >> 5));
      byte6 = 128 | (63 & code);
      _resForBinaryInteger = `${BinaryInteger(byte1, [])}${BinaryInteger(
        byte2,
        []
      )}${BinaryInteger(byte3, [])}${BinaryInteger(byte4, [])}${BinaryInteger(
        byte5,
        []
      )}`;
      // 十六进制
      _resForHexInteger = ` 0x${HexInteger(byte1, [])} 0x${HexInteger(
        byte2,
        []
      )} 0x${HexInteger(byte3, [])} 0x${HexInteger(byte4, [])} 0x${HexInteger(
        byte5,
        []
      )}`;
      break;
  }
  return { binaryInteger: _resForBinaryInteger, hexInteger: _resForHexInteger };
}

let sendBtn = document.getElementById("sendBtn");
let input = document.getElementById("input");
let resultInfo = document.getElementById("resultInfo");
sendBtn.onclick = () => {
  let result = UTF8_Encoding(input.value);
  let _innerText = "";
  result.forEach((item, i) => {
    _innerText += `第${i + 1}组中，二进制为：${
      item.binaryInteger
    }。十六进制为：${item.hexInteger}`;
  });
  resultInfo.innerText = `本次转换共${result.length}组汉字：${_innerText}`;
};
