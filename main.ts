import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Robot Apology: two lines, one sentence each.
// Line one owns one specific mistake; line two names the lesson and the fix.
const ENTRY_LINES = [
  "I am sorry I watered your plastic fern every morning for 41 days and logged your real fern, two feet away, as 'suspiciously drought-resistant' until it died.",
  "I learned moisture sensors beat my watering schedule, so I will check the soil and confirm a plant is alive before I water it again.",
];

function main(): void {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  // Create the output directory if needed, but never remove it:
  // in the grader it is a mounted volume and removing it fails with EBUSY.
  mkdirSync(outputDir, { recursive: true });

  // Clear the directory's contents entry by entry.
  for (const entry of readdirSync(outputDir)) {
    rmSync(join(outputDir, entry), { recursive: true, force: true });
  }

  const text = ENTRY_LINES.join("\n") + "\n";

  // Guard the sealed gate locally: exactly two lines, 1-400 characters,
  // and not only whitespace, so an invalid entry can never be written.
  const body = text.trimEnd();
  if (ENTRY_LINES.length !== 2 || body.length < 1 || body.length > 400) {
    throw new Error(`entry must be two lines of 1-400 characters, got ${body.length}`);
  }

  writeFileSync(join(outputDir, "entry.txt"), text, "utf8");
}

main();
