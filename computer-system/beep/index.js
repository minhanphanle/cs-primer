/**
 *
 * A program to make the terminal peep
 *  "\x07" and "\u0007" are the same bell ring
 *
 */

const readline = require("readline");

readline.emitKeypressEvents(process.stdin);

if (process.stdin.setRawMode != null) {
  process.stdin.setRawMode(true);
}

function range(size, startAt = 0) {
  const arr = [...Array(size).keys()].map((i) => i + startAt);
  console.log(arr);
  return arr;
}

function beep(counts) {
  if (counts > 0) {
    process.stdout.write("\x07");
    setTimeout(() => beep(counts - 1), 100);
  }
}

process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name == "c") {
    process.emit("SIGINT");
  }

  if (range(9, 1).includes(parseInt(key.name))) {
    let num = parseInt(key.name);
    for (let i = 0; i < num; i++) {
      beep(num);
    }
  }
});

// ctr + c then exit the program
process.on("SIGINT", () => {
  process.exit();
});
