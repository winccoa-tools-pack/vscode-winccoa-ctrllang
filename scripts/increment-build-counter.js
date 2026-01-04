#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const counterFile = process.argv[2];
const binDir = path.dirname(counterFile);

// Ensure bin directory exists
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir, { recursive: true });
}

// Read or initialize counter
let count = 0;
if (fs.existsSync(counterFile)) {
  count = parseInt(fs.readFileSync(counterFile, 'utf8').trim(), 10) || 0;
}

// Increment and save
count++;
fs.writeFileSync(counterFile, count.toString(), 'utf8');

// Output for Make to capture
console.log(count);
