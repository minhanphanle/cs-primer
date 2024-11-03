/**
 * Double precision format:
 * 1 bit (sign) | 11 bits (exponent) | 52 bits (mantissa)
 */

export function conceal(str) {
  // convert string to bytes with utf-8 encoding
  const bytes = Buffer.from(str, "utf-8");

  // check if the length of bytes is > 6 (> 48 bit), raise error:
  if (bytes.length > 6) {
    throw new Error("Not valid");
  }

  let base = 0n; // BigInt 64 bit

  let maskSign = 1n << 63n; // 63 (1)
  let maskExponent = 0x7ffn << 52n; // 62 -> 52 (11)
  let maskFirst4BitMantissa = (1n + BigInt(bytes.length)) << 48n; // 51 -> 48 (4)

  ///// set the sign, exponent, first 4 mantissa Bit
  base |= maskSign;
  base |= maskExponent;
  base |= maskFirst4BitMantissa;

  // other method:
  // base = base | maskSign | maskExponent | first4BitMantissa;

  // 47 -> 0 (48)
  // copy the bytes
  for (let i = 0; i < bytes.length; i++) {
    const shift = 40n - BigInt(i * 8);
    base |= BigInt(bytes[i]) << shift;
  }

  return base;
}

export function extract(num) {
  if (typeof num !== "bigint") {
    throw new Error("Input must be BigInt");
  }

  // extract length from the first 4 bit of mantissa
  // shift right 48 bit, 0xF = 1111 -> only get the last 4 bit, add 1 back
  const length = Number((num >> 48n) & 0xfn) - 1;

  const buffer = Buffer.alloc(length);

  // extract the bytes
  for (let i = 0; i < length; i++) {
    const shift = 40n - BigInt(i * 8);
    // 0xFF = 11111111 to mask 8 bits
    buffer[i] = Number((num >> shift) & 0xffn);
  }

  return buffer.toString("utf-8");
}

function main() {
  // Test case 1: Basic string
  let x = "secret";
  let concealed = conceal(x);
  console.log("Test 1:");
  console.log("Original:", x);
  console.log("Concealed (BigInt):", concealed);
  console.log("Is BigInt:", typeof concealed === "bigint");
  let revealed = extract(concealed);
  console.log("Revealed:", revealed);
  console.log("Matches original:", x === revealed);

  // Test case 2: Empty string
  console.log("\nTest 2:");
  testString("");

  // Test case 3: String with special characters
  console.log("\nTest 3:");
  testString("Hello! 🌟");

  // Test case 4: Max length (6 bytes)
  console.log("\nTest 4:");
  testString("123456");

  // Test case 5: Error case (> 6 bytes)
  console.log("\nTest 5:");
  try {
    testString("1234567");
    console.log("Failed: Should have thrown error");
  } catch (e) {
    console.log("Successfully caught error for long string:", e.message);
  }
}

function testString(str) {
  try {
    console.log("Testing string:", str);
    let concealed = conceal(str);
    let revealed = extract(concealed);
    console.log("Concealed (BigInt):", concealed);
    console.log("Revealed:", revealed);
    console.log("Matches original:", str === revealed);
  } catch (e) {
    console.log("Error:", e.message);
  }
}

main();
