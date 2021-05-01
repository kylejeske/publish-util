"use strict";

const Fs = require("fs").promises;
const Os = require("os");
const Path = require("path");

exports.getInfo = async () => {
  const pkgDir = process.cwd();
  const pkgFile = Path.join(pkgDir, "package.json");
  const pkgData = await Fs.readFile(pkgFile);
  const pkg = JSON.parse(pkgData);

  const tmpDir = Os.tmpdir();
  const saveName = `${pkg.name.replace(/[@\/]/g, "_")}_pkg.json`;
  const saveFile = Path.join(tmpDir, saveName);

  return { pkgDir, pkg, pkgData, tmpDir, saveName, saveFile, pkgFile };
};

function transferField(f, from, to) {
  if (f.startsWith("/")) {
    const parts = f.split("/");

    if (parts.length === 3) {
      const regex = new RegExp(parts[1], parts[2]);
      Object.keys(from).forEach(fk => {
        if (fk.match(regex)) {
          to[fk] = from[fk];
        }
      });
      return;
    }
  }
  to[f] = from[f];
}

function deleteFields(f, obj) {
  if (f.startsWith("/")) {
    const parts = f.split("/");

    if (parts.length === 3) {
      const regex = new RegExp(parts[1], parts[2]);
      Object.keys(from).forEach(fk => {
        if (fk.match(regex)) {
          delete obj[fk];
        }
      });
      return;
    }
  }

  delete obj[f];
}

exports.removeFromObj = function removeFromObj(obj, fields) {
  for (const f of fields) {
    if (typeof f === "string") {
      deleteFields(f, obj);
    } else {
      Object.keys(f).forEach(f2 => {
        removeFromObj(obj[f2], f[f2]);
      });
    }
  }
};

exports.extractFromObj = function extractFromObj(obj, fields, output = {}) {
  for (const f of fields) {
    if (typeof f === "string") {
      transferField(f, obj, output);
      continue;
    }

    for (const f2 of Object.keys(f)) {
      const obj2 = obj[f2];
      // falsy is just a primitive, safe to assign
      if (!obj2) {
        output[f2] = obj2;
        continue;
      }

      const t = typeof obj2;
      if (
        t === "number" ||
        t === "string" ||
        t === "boolean" ||
        t === "bigint" ||
        t === "symbol"
      ) {
        // assign primitive
        output[f2] = obj2;
      } else {
        // extract into potential object
        output[f2] = extractFromObj(obj2, f[f2], obj2.constructor());
      }
    }
  }

  return output;
};

// https://docs.npmjs.com/cli/v7/configuring-npm/package-json
exports.keepStandardFields = [
  "name",
  "version",
  "description",
  "keywords",
  "homepage",
  "bugs",
  "license",
  "author",
  "contributors",
  "funding",
  "files",
  "main",
  "browser",
  "bin",
  "man",
  "directories",
  "repository",
  "scripts",
  "config",
  "dependencies",
  "devDependencies",
  "peerDependencies",
  "peerDependenciesMeta",
  "bundledDependencies",
  "optionalDependencies",
  "engines",
  "os",
  "cpu",
  "private",
  "publishConfig",
  //   "workspaces"

  // extras
  "module"
];