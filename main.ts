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

// Read-back verification: the file must match the entry exactly, checked
// three ways — raw bytes, decoded UTF-8 text, and the gate itself re-run
// on what was actually read back (not just on the in-memory constant).
// Any mismatch fails the run instead of silently shipping a wrong file.
const back = readFileSync(OUT);
const expected = Buffer.from(ENTRY, "utf8");
if (!back.equals(expected)) {
  fail("read-back mismatch: /output/entry.txt bytes do not match the entry");
}
if (back.length !== expected.length) {
  fail(`read-back is ${back.length} bytes, expected ${expected.length}`);
}
if (back.includes(0x0a) || back.includes(0x0d)) {
  fail("read-back has a newline byte");
}
const backText = back.toString("utf8");
if (backText !== ENTRY) {
  fail("read-back mismatch: /output/entry.txt text does not match the entry");
}
const backLength = [...backText].length;
if (backLength < 1 || backLength > 140) {
  fail(`read-back is ${backLength} characters, must be 1-140`);
}
if (backText.includes("\n") || backText.includes("\r")) {
  fail("read-back is not a single line");
}
if (backText.trim().length === 0) {
  fail("read-back is only whitespace");
}

console.log(`wrote ${length} characters (${back.length} bytes) to ${OUT}`);
