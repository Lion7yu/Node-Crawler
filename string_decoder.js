const { StringDecoder } = require("string_decoder");
const decoder = new StringDecoder("utf8");

const str = Buffer.from([0x4ece]);
console.log(decoder.write(str));
