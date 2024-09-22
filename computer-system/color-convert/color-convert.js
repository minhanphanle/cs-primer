// A program to convert hex color to rgb

/**
 *
 * 6 digits: RR GG BB
 * 8 digits: RR GG BB AA
 * 3 digits: each digit is repeated twice to form 6-digit rgb
 * 4 digits: each digit is repeated twice to form 8-digit rgba
 *
 * test case: diff <(node color-convert.js advanced.css) advanced_expected.css
 */

const fs = require("fs");

const hexLetterMap = {
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15,
};

function readFile(path) {
  try {
    const file = fs.readFileSync(path, "utf-8");
    return file;
  } catch (err) {
    console.error(err);
  }
}

function isLetter(str) {
  return str.toUpperCase() !== str.toLowerCase();
}

function hexCharToNumber(str) {
  return isLetter(str) ? hexLetterMap[str.toLowerCase()] : Number(str);
}

function converter(hexStr) {
  // create an array of character
  let charArr = hexStr.startsWith("#")
    ? hexStr.slice(1).split("")
    : hexCharArr.split("");
  const rgbArr = [];

  // for 3 and 4 digit notation, repeat every digit twice
  if (charArr.length === 3 || charArr.length === 4) {
    charArr = charArr.flatMap((char) => [char, char]);
  }

  // slice and convert to number first
  for (let i = 0; i <= charArr.length - 2; i += 2) {
    const n1 = hexCharToNumber(charArr[i]);
    const n2 = hexCharToNumber(charArr[i + 1]);
    rgbArr.push(n1 * 16 + n2);
  }

  if (charArr.length === 6) {
    // (6 digit)
    return `rgb(${rgbArr.join(" ")})`;
  } else {
    // (8 digit)
    const [r, g, b, a] = rgbArr;
    const alpha = (a / 255).toFixed(5);
    return `rgba(${r} ${g} ${b} / ${alpha})`;
  }
}

function replaceHexColor(string) {
  const regex =
    /#(?:[0-9A-Fa-f]{8}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{4}|[0-9A-Fa-f]{3})\b/g;

  return string.replace(regex, (match) => {
    return converter(match);
  });
}

function main(filePath) {
  const fileContent = readFile(filePath);
  const convertedCSS = replaceHexColor(fileContent);

  // output to stdout
  process.stdout.write(convertedCSS);
}

if (process.argv.length < 3) {
  console.log("Usage: node color-convert.js <input_file>");
  process.exit(1);
}

const inputFilePath = process.argv[2];

main(inputFilePath);
