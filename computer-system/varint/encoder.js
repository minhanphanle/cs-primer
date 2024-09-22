// Implementation of Base 128 Varint Encoding

const fs = require("node:fs");

// Buffer in node.js reqpresents fixed-length sequence of bytes, handlign binary data directly

function readContent(file) {
  const buffer = fs.readFileSync(file, null); // 'binary' encoding is an alias for 'latin1, null returns a Buffer, which outside of V8 Javascript engine = raw memory allocation

  // Read as a BigInt (64-bit unsigned integer) Big Endien -> first significant bit first
  const value = buffer.readBigUInt64BE(0);

  return value;
}

/**
 *
 * ENCODE
 *
 */

function encodeModulo(n) {
  const out = [];
  while (n > 0n) {
    let part = n % 128n; // return a remainder of [0, 127] which represents the lowest-7 bit
    // binary literal: n % 0b10000000
    // hexadecimal: n % 0x80 -> highest bit in the high order or nybble
    //      a nybble: 4 bits or half a byte
    //      8: higher-order nybble (1000 in binary)
    //      0: lower order nybble (0000 in binary)

    n = n >> 7n; // drop off the lowest 7 bit

    // if there is more byte add a continuation bit
    if (n > 0n) {
      part += 128n; // add the most significant bit (MSB)
    }
    out.push(Number(part)); // convert to Number as Buffer only accepts Number
  }

  return Buffer.from(out);
}

function encodeBitwise(n) {
  const out = [];
  while (n > 0n) {
    let part = n & 0x7fn; // perform bitwise AND operator 0111 1111 = 7f
    n = n >> 7n;
    if (n > 0n) {
      part |= 0x80n; // perform bitwise OR operator 1000 0000 = 80; exclusive OR
    }
    out.push(Number(part));
  }

  return Buffer.from(out);
}

/**
 * DECODE
 */

function decodeBitwise(buffer) {
  let result = 0n;

  const groups = [];
  for (let i = 0; i < buffer.length; i++) {
    let byte = BigInt(buffer[i]);

    // drop continuation bit and convert to big endian
    groups.unshift(byte & 0x7fn);

    if ((byte & 0x80n) === 0n) {
      // if it's the last byte then break
      break;
    }
  }

  // concatenate the 7-bit groups (currently in the big endian order)
  for (let group of groups) {
    result = (result << 7n) | group;
  }

  return result;
}

function main() {
  const files = fs.readdirSync("./");
  const uint64Files = files.filter((f) => {
    return !f.endsWith(".js");
  });

  const nArr = uint64Files.map((f) => readContent(f));

  const varintEncodedArr = nArr.map((n) => encodeBitwise(n));
  const varintDecodedArr = varintEncodedArr.map((b) => decodeBitwise(b));

  for (let i = 0; i < nArr.length; i++) {
    if (nArr[i] !== varintDecodedArr[i]) {
      console.log("Test fail");
    }
  }
  console.log("Test success");
}

main();
