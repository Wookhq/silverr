const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { parse } = require('jsonc-parser');

/** read json (supports comments) */
async function readJson(filePath) {
	try {
		let fp = filePath;
		if (fp.startsWith('~')) fp = path.join(os.homedir(), fp.slice(1));
		const raw = await fs.readFile(fp, 'utf8');
		return parse(raw) || {};
	} catch (err) {
		return {}; // return empty object if file doesnt exist
	}
}

/** write json */
async function writeJson(filePath, data) {
	let fp = filePath;
	if (fp.startsWith('~')) fp = path.join(os.homedir(), fp.slice(1));
	await fs.mkdir(path.dirname(fp), { recursive: true });
	await fs.writeFile(fp, JSON.stringify(data, null, 2), 'utf8');
	return data;
}

/** update a key inside fflags */
async function updateFastFlag(filePath, key, value) {
	let data = await readJson(filePath);
	if (!data.fflags) data.fflags = {};
	data.fflags[key] = value;
	return writeJson(filePath, data);
}

/** update a key in sober conf*/
async function updateSoberConf(filePath, key, value) {
	let data = await readJson(filePath);
	data[key] = value;
	return writeJson(filePath, data);
}

module.exports = { readJson, writeJson, updateFastFlag, updateSoberConf };
