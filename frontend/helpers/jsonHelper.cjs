const fs = require('fs');
const path = require('path');
const os = require('os');
const { parse } = require('jsonc-parser');

async function readJson(filePath) {
	try {
		let fp = filePath;
		if (fp.startsWith('~')) {
			fp = path.join(os.homedir(), fp.slice(1));
		}
		const raw = await fs.promises.readFile(fp, 'utf8');
		return parse(raw); // tolerate comments
	} catch (err) {
		console.error('Error in readJson:', err);
		throw err;
	}
}

async function writeJson(filePath, data) {
	let fp = filePath;
	if (fp.startsWith('~')) {
		fp = path.join(os.homedir(), fp.slice(1));
	}
	await fs.promises.writeFile(fp, JSON.stringify(data, null, 2), 'utf8');
	return data;
}

async function editJson(filePath, updater) {
	const obj = await readJson(filePath);
	const updated = updater(obj);
	await writeJson(filePath, updated);
	return updated;
}

module.exports = { readJson, writeJson, editJson };
