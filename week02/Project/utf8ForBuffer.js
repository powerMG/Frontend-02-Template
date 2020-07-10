function UTF8_Encoding(str) {
  // 校验类型
  if (typeof str !== "string") {
    return;
  }
  // 记录当前每个汉字的chartCode
  let _chatCodeArr = [];
  // 2进制
  let _binaryIntegerArr = [];
  // 16进制
  let _heInteger = [];
  // 记录字节长度
  let _byteLength = 0;
  // 循环取出当前字符串的字节长度
  for (let i = 0; i < str.length; i++) {
    let _code = str.charCodeAt(i);
    _chatCodeArr.push(_code);
    // 转换二进制
    let _binaryInteger = _code.toString(2);
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
      _byteLength += 1;
      _binaryIntegerArr.push(`0${_binaryInteger}`);
    } else if (_code >= 128 && _code <= 2047) {
      _byteLength += 2;
      _binaryIntegerArr.push(`0${_binaryInteger}`);
    } else if (_code > 2048 && _code <= 0xffff) {
      _byteLength += 3;
    } else if (_code >= 65536 && _code <= 0x1fffff) {
      _byteLength += 4;
    } else if (_code >= 0x200000 && _code <= x3FFFFFF) {
      _byteLength += 5;
    } else {
      _byteLength += 6;
    }
  }
  console.log(_encodingForBinaryInteger);
  return _byteLength;
  //   return new Buffer.from(string,"utf8");
}
let a = UTF8_Encoding("中");
console.log(a);
