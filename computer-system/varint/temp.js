function processBuffer(buffer) {
  // Ensure the buffer has 8 bytes
  if (buffer.length !== 8) {
    throw new Error("Buffer must be exactly 8 bytes long");
  }

  const result = [];

  for (let i = 0; i < buffer.length; i++) {
    // Get the byte
    let byte = buffer[i];

    // Convert to binary string, pad to 8 bits
    let binaryString = byte.toString(2).padStart(8, "0");

    // Drop the first (most significant) bit
    let droppedMSB = binaryString.slice(1);

    // Convert back to a number
    let processedByte = parseInt(droppedMSB, 2);

    result.push(processedByte);
  }

  return result;
}

// Example usage
const buffer = Buffer.from([0xff, 0xa5, 0x7f, 0x80, 0x00, 0x3c, 0x55, 0xaa]);
const processed = processBuffer(buffer);

console.log("Original buffer:", buffer);
console.log("Processed bytes:", processed);
console.log(
  "Processed bytes in binary:",
  processed.map((b) => b.toString(2).padStart(7, "0"))
);
