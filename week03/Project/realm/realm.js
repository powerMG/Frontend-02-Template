// JS内置对象
const JSObject = [
  "AsyncFunction",
  "Atomics",
  "BigInt",
  "BigInt64Array",
  "BigUint64Array",
  "Boolean",
  "DataView",
  "Date",
  "Error",
  "EvalError",
  "FinalizationRegistry",
  "Float32Array",
  "Float64Array",
  "Function",
  "Generator",
  "GeneratorFunction",
  "Infinity",
  "Int16Array",
  "Int32Array",
  "Int8Array",
  "InternalError",
  "Intl",
  "JSON",
  "Map",
  "Math",
  "NaN",
  "Number",
  "Object",
  "Promise",
  "Proxy",
  "RangeError",
  "ReferenceError",
  "Reflect",
  "RegExp",
  "Set",
  "SharedArrayBuffer",
  "String",
  "Symbol",
  "SyntaxError",
  "TypeError",
  "TypedArray",
  "URIError",
  "Uint16Array",
  "Uint32Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "WeakMap",
  "WeakRef",
  "WeakSet",
  "WebAssembly",
  "decodeURI()",
  "decodeURIComponent()",
  "encodeURI()",
  "encodeURIComponent()",
  "eval()",
  "globalThis",
  "isFinite()",
  "isNaN()",
  "null",
  "parseFloat",
  "parseInt",
  "undefined",
  "uneval()",
];
let arrInfo = JSObject.map((item, i) => {
  return {
    id: `node${i + 1}`,
    label: item,
    groupId: "group1",
    size: 80,
    x: Math.floor(Math.random() * (700 - 60 + 1) + 60),
    y: Math.floor(Math.random() * (700 - 60 + 1) + 60),
  };
});
const data = {
  nodes: arrInfo,
  groups: [
    {
      id: "group1",
    },
  ],
};

const graph = new G6.Graph({
  container: "mountNode",
  width:1200,
  height: 1200,
  modes: {
    default: ["drag-group", "collapse-expand-group", "drag-node-with-group"],
  },
  defaultEdge: { color: "#bae7ff" },
});

graph.data(data);
graph.render();
