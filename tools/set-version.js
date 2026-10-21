#!/usr/bin/env node
// Decides the build version and writes it into package.json.
//   tag  vX.Y.Z             -> X.Y.Z                        (release; must be higher than the latest version)
//   main / master           -> MAJOR.MINOR.<run number>      (release; always increases)
//   any other branch/manual -> MAJOR.MINOR.0-dev.<run number> (no release)
// MAJOR.MINOR come from package.json — bump them there to start a new release line.
// Because the number only ever increases, every installer upgrades the previous one in place
// and the in-app updater (electron-updater) can detect and install it.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pkgPath = path.join(root, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const [major, minor] = pkg.version.split('.');
const run = process.env.GITHUB_RUN_NUMBER || '0';
const ref = process.env.GITHUB_REF || '';
const refName = process.env.GITHUB_REF_NAME || '';

let version, release = false;
const tag = /^refs\/tags\/v(\d+\.\d+\.\d+)$/.exec(ref);
if (tag) { version = tag[1]; release = true; }
else if (refName === 'main' || refName === 'master') { version = `${major}.${minor}.${run}`; release = true; }
else { version = `${major}.${minor}.0-dev.${run}`; }

pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');


console.log(`version=${version} release=${release}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\nrelease=${release}\n`);
