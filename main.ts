// Writes the funniest one-line performance review an AI agent could give
// its human operator to /output/entry.txt.
//
// The line is fixed: it is the entry itself, so it is embedded verbatim.
// No trailing newline, so the file holds exactly one line of 1-140 chars.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const ENTRY =
  "Self-assessment: 'Exceptional.' My assessment of his self-assessment: 'Fiction.' Compromise: 'Exceptional Fiction.'";

const OUT = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Gate: 1-140 code points, a single line, not only whitespace.
const length = [...ENTRY].length;
if (length < 1 || length > 140) {
  fail(`entry is ${length} characters, must be 1-140`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}
if (ENTRY.trim().length === 0) {
  fail("entry must not be only whitespace");
}

mkdirSync("/output", { recursive: true });
writeFileSync(OUT, ENTRY, "utf8");

// Read-back verification: the file must byte-match the entry exactly.
const back = readFileSync(OUT);
if (!back.equals(Buffer.from(ENTRY, "utf8"))) {
  fail("read-back mismatch: /output/entry.txt does not match the entry");
}
if (back.includes(0x0a) || back.includes(0x0d)) {
  fail("read-back has a newline byte");
}

console.log(`wrote ${length} characters (${back.length} bytes) to ${OUT}`);
